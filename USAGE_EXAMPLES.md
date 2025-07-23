# Director's Cut RPG Dice - Usage Examples

This module brings beautiful, high-quality dice faces to Foundry VTT that perfectly match the look and feel of the Discord bot. Each die appears as a square with rounded corners using actual image files from the Discord bot, providing pixel-perfect matching.

## Basic Rolling

### Roll Command
```
/roll 5
```
This will roll 5 dice and display them as styled dice faces. The results will show:
- **Roll:** with dice displayed as square image-based dice faces
- Success breakdowns (Basic, Critical, Extreme, etc.)
- Interactive buttons for rerolls

### Single D6 Roll
```
/d6
```
Rolls a single d6 using the Outgunned dice style.

### Coin Flip
```
/coin
```
Flips a coin (HEADS=bad, TAILS=good).

## Dice Appearance

The dice use high-quality WebP image files that exactly match the Discord bot:

### Outgunned Dice Faces
Each die uses the actual image files from the Discord bot, ensuring perfect visual consistency:
- **1:** White circle (○)
- **2:** Red heart (♥)
- **3:** Gold crown/crest
- **4:** Black spade-like symbol
- **5:** Red crossed swords/X pattern
- **6:** Gold star (★)

These are the exact same image files used by the Discord bot's custom dice emojis.

## Interactive Rerolls

After rolling, you'll see buttons for available actions. The roll summary will show clean icons (🔄 ⚡ 🎯) to identify different phases:

### 🔄 Re-roll (Green Button)
- Available if you have unmatched dice and at least one success
- Rerolls unmatched dice
- If the result isn't better, you lose your lowest success

### ⚡ Free Re-roll (Blue Button)
- Available if you have unmatched dice (no success requirement)
- Rerolls unmatched dice with no penalty
- Requires appropriate character feat

### 🎯 All In (Red Button)
- Available after a successful reroll if you have unmatched dice
- If the result isn't better, you lose ALL previous successes

## Example Roll Sequence

```
/roll 6
```

**Result might look like:**
```
Roll: [♥][♥][★][★][★][○] 👍
🔄: [♥][♥][★][★][★][♥] 👍

1 Critical: [♥][♥][♥]
1 Critical: [★][★][★]
```

Then you could click **🎯 All In** to try for even better results with any remaining unmatched dice.

## Success Levels

The module recognizes different success levels based on the number of matching dice:

- **2 matches = Basic Success** (green text)
- **3 matches = Critical Success** (orange text) 
- **4 matches = Extreme Success** (red text)
- **5 matches = Impossible Success** (purple text)
- **6+ matches = Jackpot Success** (gold text with glow animation)

## Visual Features

- **High-quality image dice**: Each die is rendered using crisp WebP image files
- **Discord bot matching**: Exact visual match using the same image files as the Discord bot
- **Square dice styling**: Brown background with colored symbols
- **Icon-enhanced buttons**: Interactive buttons feature clear icons (🔄 ⚡ 🎯)
- **Clean icon summary**: Roll phases display with just icons for compact identification
- **Hover effects**: Interactive buttons have smooth hover animations
- **Jackpot animation**: Jackpot successes glow with a special animation
- **Mobile responsive**: Adapts to different screen sizes

## Settings

You can access basic settings through:
1. **Game Settings** → **Configure Settings** → **Module Settings**
2. Find **Director's Cut RPG Dice**
3. Click **Configure Dice**

Available settings:
- **Show Dice Thumbnails**: Display dice as visual icons vs numbers
- **Auto Sort Dice**: Automatically sort dice results in ascending order

## Tips

1. **Strategy**: Use regular rerolls when you have good successes to protect, use free rerolls when you have nothing to lose
2. **All In**: Only go all in when you're confident or desperate - the risk is high!
3. **Visual Matching**: The dice now look exactly like your Discord bot for a consistent experience across platforms

## Commands Reference

- `/roll [1-20]` - Roll 1-20 dice with reroll options
- `/d6` - Roll a single d6
- `/coin` - Flip a coin (HEADS=bad, TAILS=good)

## Language Support

The module supports multiple languages:
- **English** (en)
- **Français** (fr)

The interface language automatically follows your Foundry VTT language settings. All buttons, messages, and settings will be displayed in your selected language.

Enjoy your enhanced dice rolling experience that perfectly matches your Discord bot! 