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


**Note:** This stage works best with AI models that can follow complex instructions. Performance may vary by model. The dual-approach system (tags + content analysis) ensures functionality across all models, but tag-based tracking provides more accurate results when the AI complies.

---

*"The line between hatred and love is thinner than you think."*
