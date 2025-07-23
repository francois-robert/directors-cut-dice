# Director's Cut RPG Dice Module

A Foundry VTT module that brings the advanced dice rolling system from the Director's Cut RPG Discord bot to your virtual tabletop. Features interactive reroll mechanics, multiple dice sets, and beautiful chat integration.

## Features

### 🎲 Advanced Dice Rolling
- Roll multiple dice with automatic sorting and match grouping
- Success levels: Basic (2 matches), Critical (3), Extreme (4), Impossible (5), Jackpot (6+)
- Interactive chat messages with real-time button updates

### 🔄 Reroll Mechanics
- **Re-roll**: Reroll unmatched dice, but lose a success if the result isn't better
- **Free Re-roll**: Reroll unmatched dice with no penalty (requires appropriate feat)
- **All In**: After a successful reroll, go all in with remaining unmatched dice

### 🎨 Multiple Dice Sets
- Outgunned (classic dice symbols)
- Outgunned Adventure
- Household
- Numbers (①②③④⑤⑥)
- Color Symbols (🔴🟢🔷💜⭐⬜)
- Color Squares (🟥🟩🟦🟪🟨🟫)
- Sabacc

### 💬 Chat Commands
- `/roll [number]` - Roll dice (1-20 dice)
- `/coin` - Flip a coin (HEADS=bad, TAILS=good)
- `/d6` - Roll a single d6

## Installation

1. Download or clone this module into your Foundry VTT `Data/modules/` directory
2. Enable the module in your world's module settings
3. Start rolling dice in chat!

## Usage

### Basic Rolling
Type `/roll 5` in chat to roll 5 dice. The results will show:
- Each roll phase (Roll, Re-roll, Free Re-roll, All In)
- Success/failure indicators (👍/👎)
- Grouped matches by success level
- Any lost successes from failed rerolls

### Interactive Buttons
After rolling, you'll see buttons for available actions:
- **Re-roll** (green): Available if you have unmatched dice and at least one success
- **Free Re-roll** (blue): Available if you have unmatched dice (no success requirement)
- **All In** (red): Available after a successful reroll if you have unmatched dice

### Dice Mechanics
The system follows Director's Cut RPG rules:
- Dice showing the same number create "matches"
- 2 matches = 1 Basic success
- 3 matches = 1 Critical success  
- 4 matches = 1 Extreme success
- 5 matches = 1 Impossible success
- 6+ matches = 1 Jackpot success

### Reroll Rules
- **Re-roll**: If the new result isn't better, you lose your lowest success
- **Free Re-roll**: No penalty regardless of result
- **All In**: If the result isn't better, you lose ALL previous successes

## Styling

The module includes beautiful chat styling with:
- Gradient backgrounds and golden borders
- Color-coded success types
- Hover effects on buttons
- Glowing animation for Jackpot successes
- Mobile-responsive design

## Language Support

The module supports multiple languages:
- **English** (en)
- **Français** (fr)

Language selection follows your Foundry VTT language settings.

## Compatibility

- **Foundry VTT**: v13+ (verified through v13)
- **System**: Universal (works with any game system)

## License

This module is released under the same license as the original Discord bot.

## Credits

Based on the Director's Cut RPG Discord bot by the original developers. Adapted for Foundry VTT with permission.

## Support

For issues or feature requests, please create an issue in the repository or contact the module developer. 