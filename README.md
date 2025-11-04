# ⚔️ Rivalmance ❤️

> "I don't know whether I want to kiss you or kill you."

A Chub Stage that creates a dynamic rivalmance system for AI character interactions. **Rivalmance** is a romance that develops through rivalry, competition, and tension rather than friendship and cooperation.

![Rivalmance System](demo.GIF)

---

## What is Rivalmance?

Rivalmance creates a unique romantic dynamic based on **competitive tension** where {{char}} and {{user}} are equals constantly competing with each other. Unlike traditional romance systems:

- 🔥 **Affection doesn't soften rivalry** - The more {{char}} falls for {{user}}, the more intense the competition becomes
- 😤 **Frustration grows with feelings** - {{char}} becomes increasingly frustrated by their unwanted attraction
- 🏆 **Respect earned through competition** - Rivalry builds respect, which enables deeper emotional connection
- ⚡ **Chaos at high affection** - Higher affection = more erratic and unpredictable behavior
- 💔 **Love doesn't eliminate rivalry** - Even at maximum affection, competitive dynamics remain central

---

## Core Features

### 📊 Dynamic Relationship Tracking

The system tracks **four core metrics** (0-100):

| Metric | Description | How It Changes |
|--------|-------------|----------------|
| **Affection** | Attraction to {{user}} | Physical contact, compliments, vulnerability moments |
| **Rivalry** | Competitive intensity | Challenges, competitions, "I'll beat you" statements |
| **Respect** | Recognition as equal | Acknowledging skill, worthy opponent, impressive displays |
| **Frustration** | Annoyance at feelings | Auto-calculated: `(affection × rivalry) / 100` |

### 🎭 Four Relationship Stages

Progression based on affection level:

1. **🚫 Denial (0-25)**
   - Dismisses any attraction
   - Focuses purely on rivalry and competition
   - Reframes romantic tension as competitive energy

2. **😵 Confusion (26-50)**
   - Notices conflicting feelings
   - Behavior becomes inconsistent
   - Doesn't understand why {{user}} affects them

3. **⚔️ Resistance (51-75)**
   - Actively fights against feelings
   - Behavior highly erratic and chaotic
   - Alternates between aggression and vulnerability

4. **💔 Acceptance (76-100)**
   - Accepts complicated feelings
   - Expresses affection through competitive teasing
   - Rivalry remains core to the relationship

### ⚡ Chaos System

When affection exceeds the threshold (default: 50), a **chaos level** (0-10) tracks behavioral unpredictability:

- **Low (1-3)**: Subtle inconsistencies in behavior
- **Moderate (4-6)**: Emotional control slipping, mood swings
- **High (7-10)**: Highly unpredictable - sudden intimacy, confessions followed by denial, unexpected contact during arguments

### 🤖 Dual-Approach Tracking

**Primary Method: AI Self-Reporting**
- The system instructs the LLM to include hidden tags:
  ```
  [RIVALMANCE_UPDATE: affection_change=+3, rivalry_change=+5, respect_change=+2, interaction_type=competitive]
  ```
- Most accurate when the AI follows instructions

**Fallback Method: Content Analysis**
- If no tags detected, automatically analyzes message content
- Pattern-based detection:
  - Affection: Blushes, physical contact, "can't stop thinking about", reluctant care
  - Rivalry: Challenges, "I'll beat you", competitive language
  - Respect: "Impressive", "worthy opponent", skill acknowledgment
  - Interaction types: Competitive/romantic/confrontational keywords
- Ensures metrics **always update** regardless of AI model compliance

### 📈 Recent Changes Display

Visual feedback panel showing what just changed:
- Only appears when metrics update
- Color-coded badges:
  - 🟢 **Green**: Positive increases (affection, rivalry, respect up)
  - 🔴 **Red**: Decreases
  - 🟠 **Orange**: Frustration increases (warning)
- Example: `[Affection +3] [Rivalry +5] [Respect +2]`

### 💾 State Restoration & Chat Tree Navigation

Perfect consistency across branching conversations:
- Each message saves complete state snapshot
- Jumping back restores exact values from that point
- Swipes/alternate responses maintain separate progressions
- Example:
  ```
  Message A: Affection 13 → Recent Changes: +3
  Message B: Affection 15 → Recent Changes: +2
  Jump back to A → Shows Affection 13, Changes: +3 ✓
  ```

### 🎨 Visual UI

**Metric Bars**
- Color-coded progress bars for all four metrics
- Smooth animated transitions (0.5s)
- Gradient colors reflecting intensity:
  - Affection: Red gradient (light pink → deep red)
  - Rivalry: Orange gradient (light orange → burnt orange)
  - Respect: Blue gradient (light blue → deep blue)
  - Frustration: Purple gradient (lavender → deep purple)

**Status Panel**
- Current relationship stage with emoji
- Chaos level indicator (⚡ symbols when active)
- Last interaction type badge
- Total interactions counter

**Significant Moments**
- Collapsible history of key relationship events
- Auto-detected: First confession, first kiss, major confrontations
- Tracked across entire chat (not branch-specific)

---

## How It Works

### Message Flow

```
┌─────────────────────────────────────────────────────────┐
│ 1. User sends message: "I beat you again!"             │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 2. beforePrompt() injects stage directions:            │
│    [Current state: Affection=10, Rivalry=50...]        │
│    [Stage: DENIAL - Focus on competition...]           │
│    [Include: [RIVALMANCE_UPDATE: ...] at end]          │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 3. AI generates response:                              │
│    "Beginner's luck. Rematch. Now."                    │
│    [RIVALMANCE_UPDATE: affection_change=+2,            │
│     rivalry_change=+5, respect_change=+3,              │
│     interaction_type=competitive]                      │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 4. afterResponse() processes:                          │
│    - Parses tags OR runs content analysis              │
│    - Updates metrics: Affection 10→12, Rivalry 50→55   │
│    - Recalculates: Frustration 5→7, Stage: Denial      │
│    - Stores changes: {affection:+2, rivalry:+5}        │
│    - Strips tags from displayed message                │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│ 5. UI displays:                                        │
│    Affection: 12/100 [████░░░░░░░░░░░]                │
│    Recent Changes: [Affection +2] [Rivalry +5]         │
└─────────────────────────────────────────────────────────┘
```

### Content Analysis Examples

**Competitive Victory:**
```
AI: "I'll beat you next time! That's a promise!"
Detected: "beat you" (+2 rivalry), "next time" (+2 rivalry), challenge tone
Result: Rivalry +4
```

**Reluctant Affection:**
```
AI: "I hate that I keep thinking about you... Not that I care!"
Detected: "hate that I" (+3 affection), "thinking about" (+2 affection), "not that I care" (+2 affection)
Result: Affection +7, Frustration increases
```

**Respect Gain:**
```
AI: "You're actually skilled. I acknowledge you as a worthy opponent."
Detected: "skilled" (+3 respect), "worthy opponent" (+4 respect)
Result: Respect +7
```

---

## Configuration

When you first start a chat with the Rivalmance stage enabled, you'll see a **preset selection screen** with three pre-configured dynamics to choose from. This ensures balanced starting values and prevents invalid configurations.

### Available Presets

#### ⚔️ Enemies to Lovers (Slow Burn)
*High tension, bitter rivals - classic enemies-to-lovers dynamic*

```yaml
Starting Affection: 5       # Barely any initial attraction
Starting Rivalry: 75        # Intense competitive tension
Starting Respect: 20        # Minimal respect
Chaos Threshold: 60         # Chaos starts at moderate affection
Frustration Multiplier: 1.5 # Faster frustration build-up
```

**Best for:** Classic enemies-to-lovers stories, slow-burn romance, high tension narratives where characters start by genuinely disliking each other.

---

#### ⚖️ Balanced
*Equal mix of rivalry and attraction from the start*

```yaml
Starting Affection: 20      # Noticeable initial attraction
Starting Rivalry: 60        # Strong competitive element
Starting Respect: 30        # Moderate respect
Chaos Threshold: 60         # Standard chaos activation
Frustration Multiplier: 1.0 # Normal frustration growth
```

**Best for:** Traditional rivals-to-lovers, sports/competition settings, academic rivals, characters who are intrigued by each other from the start.

---

#### 🔥 Established Rivalry (Fast Progression)
*Deep mutual respect, faster progression - they already know each other well*

```yaml
Starting Affection: 30      # Clear attraction present
Starting Rivalry: 70        # Very high competitive drive
Starting Respect: 60        # Strong mutual respect
Chaos Threshold: 40         # Chaos activates early
Frustration Multiplier: 0.5 # Slower frustration (better control)
```

**Best for:** Long-time rivals with history, professional rivals, characters who've competed for years and secretly admire each other, faster-paced romance.

---

### How to Choose

Simply **click the preset button** that matches your desired dynamic when you first open the chat. Your selection is saved and persists throughout the chat session. The preset cannot be changed mid-chat, so choose carefully!

Each preset button shows:
- 🎯 **Emoji and name** for easy identification
- 📝 **Description** of the dynamic
- 📊 **Starting values** for Affection, Rivalry, and Respect

---

## Technical Implementation

### Architecture

```
src/
├── types.ts              # TypeScript interfaces and types
├── rivalmanceUtils.ts    # Core utility functions (calculations, parsing)
├── contentAnalyzer.ts    # Pattern-based content analysis fallback
├── Stage.tsx             # Main stage logic (lifecycle hooks)
└── index.scss            # UI styling and animations
```

### Key Classes

**RivalmanceUtils**
- `parseRivalmanceUpdates()` - Parse tags with content analysis fallback
- `applyUpdates()` - Update metrics with bounds checking (0-100)
- `recalculateMetrics()` - Calculate frustration, chaos, stage
- `generateStageDirections()` - Create adaptive prompt instructions

**RivalmanceContentAnalyzer**
- `analyzeContent()` - Full content analysis when tags missing
- `detectInteractionType()` - Classify interaction (competitive/romantic/confrontational/neutral)
- `detectAffectionChange()` - Pattern matching for affection indicators
- `detectRivalryChange()` - Competition and challenge detection
- `detectRespectChange()` - Skill acknowledgment and respect shifts

**Stage (Main Class)**
- `beforePrompt()` - Inject stage directions, increment counter
- `afterResponse()` - Parse updates, calculate changes, update state
- `setState()` - Restore state when navigating chat tree
- `render()` - Display UI with metrics and status

### State Management

**InitState (One-Time Initialization)**
- Set once when user selects a preset
- Contains: setupComplete (boolean), selectedPreset (preset name)
- Persists for entire chat lifetime
- Ensures selected configuration is restored on page reload

**MessageState (Per-Message)**
- Saved with each message node in chat tree
- Contains: affection, rivalry, respect, frustration, chaos, stage, lastChanges, significantMoments[]
- Fully restored when jumping back in conversation
- Tracks all metrics and recent changes for that specific point in the chat

**ChatState (Chat-Wide)**
- Persists across all branches
- Contains: totalInteractions (interaction counter)
- Not affected by swipes or navigation
- Shared across all paths in the chat tree

### Metric Calculations

**Frustration:**
```typescript
frustration = Math.floor((affection × rivalry) / 100 × frustrationMultiplier)
```
- Higher when both affection and rivalry are high
- Represents internal conflict

**Chaos Level:**
```typescript
if (affection >= chaosThreshold) {
  chaosProgress = (affection - threshold) / (100 - threshold)
  frustrationBonus = frustration / 100
  chaosLevel = Math.floor((chaosProgress + frustrationBonus) × 5)
}
```
- Only activates above threshold
- Scales with both affection and frustration

**Relationship Stage:**
- Denial: affection 0-25
- Confusion: affection 26-50
- Resistance: affection 51-75
- Acceptance: affection 76-100

---

## Development

### Prerequisites

- Node.js 21.7.1 (other versions may work but aren't officially supported)
- npm or yarn

### Local Development

```bash
# Install dependencies
npm install

# Run development server (uses TestRunner.tsx)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Project Structure

```
rivalmance/
├── src/
│   ├── types.ts                 # Type definitions
│   ├── rivalmanceUtils.ts       # Utility functions
│   ├── contentAnalyzer.ts       # Content analysis fallback
│   ├── Stage.tsx                # Main implementation
│   ├── index.scss               # Styling
│   ├── App.tsx                  # App entry point
│   ├── TestRunner.tsx           # Local testing
│   └── assets/
│       └── test-init.json       # Test data
├── public/
│   ├── chub_meta.yaml           # Stage metadata
│   └── characters/              # Character definitions
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD pipeline
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
└── vite.config.ts               # Build config
```

### Testing Locally

Modify `src/assets/test-init.json` to test different scenarios:
```json
{
  "config": {
    "startingAffection": 30,
    "startingRivalry": 70
  },
  "users": { ... },
  "characters": { ... }
}
```

Run `npm run dev` to see the UI and test interactions.

---

## Deployment

### Automatic Deployment via GitHub Actions

1. Get stage auth token from [Chub API](https://api.chub.ai/openapi/swagger#/User%20Account/create_projects_token_account_tokens_projects_post)
2. In GitHub: Settings → Secrets and Variables → Actions → New Repository Secret
3. Add token with name `CHUB_AUTH_TOKEN`
4. Push to `main` or `master` branch - automatically deploys to Chub

The workflow:
- Builds TypeScript + Vite bundle
- Generates/retrieves extension ID from Chub API
- Uploads artifacts to Chub platform
- Stage becomes available in Chub's stage library

---

## Usage Examples

### Example 1: Competitive Victory

**User:** "I beat you again! That's three in a row."

**AI (with tags):** "Beginner's luck. Next time I won't go easy on you... not that I did this time! Rematch. Now. [RIVALMANCE_UPDATE: affection_change=+2, rivalry_change=+5, respect_change=+3, interaction_type=competitive]"

**Result:**
- Affection: 10 → 12
- Rivalry: 50 → 55
- Respect: 30 → 33
- Frustration: 5 → 7 (auto-calculated)
- Recent Changes: `[Affection +2] [Rivalry +5] [Respect +3]`

### Example 2: Reluctant Compliment (No Tags)

**AI:** "You're... not terrible at this. Don't let it go to your head."

**Content Analysis Detects:**
- "not terrible" → compliment pattern (+2 affection)
- "don't let it go to your head" → tsundere deflection (+1 affection)
- Acknowledgment of skill → +2 respect

**Result:**
- Affection: 12 → 15
- Respect: 33 → 35
- Recent Changes: `[Affection +3] [Respect +2]`

### Example 3: High Chaos Confession

**Context:** Affection 85, Chaos Level 8

**AI:** "I hate you! I hate that you— *grabs your collar* Why do you make me feel like this?! *pushes away* Forget I said anything. We have a competition to finish. [RIVALMANCE_UPDATE: affection_change=+4, rivalry_change=+2, interaction_type=confrontational, significant_moment="Accidental confession"]"

**Result:**
- Affection: 85 → 89
- Rivalry: 80 → 82
- Stage: ACCEPTANCE
- Chaos Level: 9 (HIGH - pulsing animation)
- Significant Moment logged: "[#47] Accidental confession"

---

## Design Philosophy

### Core Principles

1. **Tension Over Harmony**
   - Romance develops through conflict, not cooperation
   - Competition fuels attraction

2. **Frustration as Feature**
   - Characters are annoyed by their feelings
   - This creates interesting dynamics and dialogue

3. **Respect as Foundation**
   - Only equals can have true rivalmance
   - Condescension kills the dynamic

4. **Chaos is Growth**
   - Erratic behavior signals emotional development
   - Predictability would undermine the premise

5. **Love Doesn't "Fix" Anyone**
   - Even at max affection, rivalry persists
   - The competitive dynamic is the relationship

### Anti-Patterns Avoided

❌ Softening character when affection increases
❌ Rivalry decreasing as romance grows
❌ Characters becoming submissive or docile
❌ Losing competitive edge at high affection
❌ "Taming" the rivalry into friendship

### What Makes Good Rivalmance

✅ Competitive teasing as flirting
✅ Aggressive compliments ("You're not bad... for now")
✅ Physical tension during arguments
✅ Reluctant vulnerability quickly deflected
✅ Challenges as love language
✅ Respect shown through acknowledgment of skill

---

## About Chub Stages

Chub Stages are interactive React components that run alongside AI character chats on the Chub platform.

### Benefits of Chub Stages

- **Write once, run everywhere**: Web, iOS, Android, Vision Pro
- **No DevOps required**: Built-in hosting, distribution, updates
- **Built-in audience**: Millions of users on Chub platform
- **Multimedia support**: Language, imagery, audio via unified interface
- **API protection**: No worrying about key theft or reverse engineering
- **Cross-platform distribution**: Automatic deployment to all platforms

### Resources

- [Chub Stages Documentation](https://docs.chub.ai/docs/stages)
- [Chub Stages TypeScript Library](https://github.com/CharHubAI/chub-stages-ts)
- [Stage Template Repository](https://github.com/CharHubAI/stage-template)
- [Chub Platform](https://chub.ai)

---

## Contributing

Contributions welcome! Areas for enhancement:

- Additional content analysis patterns
- More sophisticated chaos behaviors
- Alternative relationship progression paths
- Customizable UI themes
- Localization/language support
- Advanced metrics (jealousy, pride, etc.)

Please feel free to submit issues or pull requests.

---

## License

See LICENSE file for details.

---

## Acknowledgments

Built with:
- [Chub Stages Framework](https://docs.chub.ai/docs/stages)
- React 18
- TypeScript
- Vite
- SCSS

Inspired by the "enemies to lovers" and "rivals to romance" tropes in fiction.

---

**Note:** This stage works best with AI models that can follow complex instructions. Performance may vary by model. The dual-approach system (tags + content analysis) ensures functionality across all models, but tag-based tracking provides more accurate results when the AI complies.

---

*"The line between hatred and love is thinner than you think."*
