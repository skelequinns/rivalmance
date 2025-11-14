# ⚔️ Rivalmance ❤️

> "I don't know whether I want to kiss you or kill you."

A Chub Stage that creates a dynamic rivalmance system for AI character interactions. **Rivalmance** is a romance that develops through rivalry, competition, and tension rather than friendship and cooperation.

---

## What is Rivalmance?

Rivalmance creates a unique romantic dynamic based on **competitive tension** where {{char}} and {{user}} are equals constantly competing with each other. Unlike traditional romance systems:

- 🔥 **Affection doesn't soften rivalry** - The more {{char}} falls for {{user}}, the more intense the competition becomes
- 😤 **Frustration grows with feelings** - {{char}} becomes increasingly frustrated by their unwanted attraction
- 🏆 **Respect earned through competition** - Rivalry builds respect, which enables deeper emotional connection
- ⚡ **Chaos at high affection** - Higher affection = more erratic and unpredictable behavior
- 💔 **Love doesn't eliminate rivalry** - Even at maximum affection, competitive dynamics remain central

---

## How Does It Work? (Simple Explanation)

Think of Rivalmance as an invisible scorekeeper that watches your conversation and tracks how the relationship is developing.

**What it tracks:**
- **How attracted** the character is to you (even if they won't admit it!)
- **How competitive** they feel - do they want to prove themselves against you?
- **How much they respect you** as an equal or worthy opponent
- **How frustrated** they are about having feelings they don't want

**How it learns:**
The bot reads every message from the character and looks for clues. Did they blush? That's affection going up. Did they challenge you to a competition? Rivalry increases. Did they call you impressive? Respect grows. The bot picks up on all these little details automatically.

**What happens over time:**
As you chat, the character progresses through stages - first denying any attraction, then getting confused by their feelings, then fighting against those feelings, and finally accepting them. But here's the twist: even when they fall for you, they still want to compete with you! That's the heart of rivalmance.

**The cool part:**
If you use the "swipe" feature to try different responses or jump back to earlier messages, the bot remembers exactly where the relationship was at that point. So if you had a "first kiss" moment but swipe it away to try something different, that kiss never happened - the bot forgets it and tracks only what actually occurs in your current conversation path.

**What you see:**
Colorful bars showing the four main relationship scores, notifications when things change, and a list of important moments (like first confessions or big arguments) that happened along the way.

That's it! You just chat normally, and the bot handles all the relationship tracking behind the scenes, making the character respond naturally to how things are developing.

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

### 🤖 Content Tracking

**Content Analysis**
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

**Note:** This stage works best with AI models that can follow complex instructions. Performance may vary by model. The dual-approach system (tags + content analysis) ensures functionality across all models, but tag-based tracking provides more accurate results when the AI complies.

---

*"The line between hatred and love is thinner than you think."*
