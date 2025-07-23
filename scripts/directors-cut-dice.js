// Director's Cut RPG Dice Module for Foundry VTT

// Enum for roll phases
const RollPhase = {
  INITIAL: 1,
  REROLL: 2,
  FREE_REROLL: 3,
  ALL_IN: 4
};

// Roll class
class Roll {
  constructor(dice = []) {
    this.dice = dice.sort((a, b) => a - b);
    this.numDice = dice.length;
    this.matches = this._groupMatches();
    this.failedReroll = false;
    this.failedMatches = {};
  }

  matchedDice() {
    const nonMatches = this.matches[1] || [];
    return this.dice.filter(die => !nonMatches.includes(die));
  }

  nonMatchedDice() {
    return this.matches[1] || [];
  }

  markAsFailedReroll() {
    this.failedReroll = true;
    
    // Move the lowest success from matches to failed matches
    const successKeys = Object.keys(this.matches).filter(k => k > 1).map(Number);
    if (successKeys.length > 0) {
      const lowestMatch = Math.min(...successKeys);
      const lostDice = this.matches[lowestMatch].shift();
      this.failedMatches = { [lowestMatch]: [lostDice] };
      
      // Remove the key if there are no more dice with that number of matches
      if (this.matches[lowestMatch].length === 0) {
        delete this.matches[lowestMatch];
      }
    }
  }

  markAsFailedAllIn() {
    this.failedReroll = true;
    const nonMatchedDice = this.matches[1];
    this.failedMatches = { ...this.matches };
    delete this.failedMatches[1];
    this.matches = { 1: nonMatchedDice };
  }

  isBetterThan(otherRoll) {
    const score = this._calculateScore();
    const otherScore = otherRoll._calculateScore();
    return score > otherScore;
  }

  _calculateScore() {
    return Object.entries(this.matches)
      .filter(([numMatches]) => numMatches > 1)
      .reduce((score, [numMatches, dice]) => {
        return score + (Math.pow(3, numMatches - 1) * dice.length);
      }, 0);
  }

  _groupMatches() {
    const counts = {};
    for (const die of this.dice) {
      counts[die] = (counts[die] || 0) + 1;
    }

    const matches = {};
    for (const [die, count] of Object.entries(counts)) {
      if (!matches[count]) {
        matches[count] = [];
      }
      matches[count].push(parseInt(die));
    }
    return matches;
  }
}

// RollHistory class
class RollHistory {
  constructor() {
    this.numDice = null;
    this.rolls = {};
  }

  addRoll(phase, roll) {
    this.rolls[phase] = roll;
    if (!this.numDice) {
      this.numDice = roll.numDice;
    }
  }

  getRoll(phase) {
    return this.rolls[phase];
  }

  getFinalRoll() {
    const phases = Object.keys(this.rolls).map(Number);
    const maxPhase = Math.max(...phases);
    return this.rolls[maxPhase];
  }

  canReroll() {
    const hasNoAdvancedRolls = ![RollPhase.REROLL, RollPhase.FREE_REROLL, RollPhase.ALL_IN]
      .some(phase => this.rolls[phase]);
    const finalRoll = this.getFinalRoll();
    return hasNoAdvancedRolls && 
           finalRoll.nonMatchedDice().length > 0 && 
           this._hasAtLeastOneSuccess();
  }

  canFreeReroll() {
    const hasNoAdvancedRolls = ![RollPhase.REROLL, RollPhase.FREE_REROLL, RollPhase.ALL_IN]
      .some(phase => this.rolls[phase]);
    const finalRoll = this.getFinalRoll();
    return hasNoAdvancedRolls && finalRoll.nonMatchedDice().length > 0;
  }

  canGoAllIn() {
    const hasAllIn = this.rolls[RollPhase.ALL_IN];
    const hasReroll = this.rolls[RollPhase.REROLL] || this.rolls[RollPhase.FREE_REROLL];
    const lastRoll = this.getFinalRoll();
    const initialRoll = this.getRoll(RollPhase.INITIAL);
    
    return !hasAllIn && 
           hasReroll && 
           !lastRoll.failedReroll && 
           lastRoll.isBetterThan(initialRoll) && 
           lastRoll.nonMatchedDice().length > 0;
  }

  _hasAtLeastOneSuccess() {
    const finalRoll = this.getFinalRoll();
    return Object.keys(finalRoll.matches).some(numMatches => numMatches > 1);
  }
}

// Roller class
class Roller {
  constructor(numDice = 0, rollHistory = null) {
    if (rollHistory) {
      this.numDice = rollHistory.numDice;
      this.rollHistory = rollHistory;
    } else if (numDice > 0) {
      this.numDice = numDice;
      this.rollHistory = new RollHistory();
    } else {
      throw new Error(game.i18n.localize('directors-cut-dice.errors.invalidConstructor'));
    }
  }

  roll() {
    const dice = this.rollDice(this.numDice);
    const roll = new Roll(dice);
    this.rollHistory.addRoll(RollPhase.INITIAL, roll);
  }

  reroll() {
    const initialRoll = this.rollHistory.getRoll(RollPhase.INITIAL);
    if (!initialRoll) {
      throw new Error(game.i18n.localize('directors-cut-dice.errors.noInitialRoll'));
    }
    
    const rerolledDice = this.rollDice(initialRoll.nonMatchedDice().length);
    const combinedRoll = new Roll([...initialRoll.matchedDice(), ...rerolledDice]);
    
    if (!combinedRoll.isBetterThan(initialRoll)) {
      combinedRoll.markAsFailedReroll();
    }
    
    this.rollHistory.addRoll(RollPhase.REROLL, combinedRoll);
  }

  freeReroll() {
    const initialRoll = this.rollHistory.getRoll(RollPhase.INITIAL);
    if (!initialRoll) {
      throw new Error(game.i18n.localize('directors-cut-dice.errors.noInitialRoll'));
    }
    
    const rerolledDice = this.rollDice(initialRoll.nonMatchedDice().length);
    const combinedRoll = new Roll([...initialRoll.matchedDice(), ...rerolledDice]);
    
    this.rollHistory.addRoll(RollPhase.FREE_REROLL, combinedRoll);
  }

  allIn() {
    const lastRoll = this.rollHistory.getFinalRoll();
    if (!lastRoll) {
      throw new Error(game.i18n.localize('directors-cut-dice.errors.noRollForAllIn'));
    }
    
    const rerolledDice = this.rollDice(lastRoll.nonMatchedDice().length);
    const combinedRoll = new Roll([...lastRoll.matchedDice(), ...rerolledDice]);
    
    if (!combinedRoll.isBetterThan(lastRoll)) {
      combinedRoll.markAsFailedAllIn();
    }
    
    this.rollHistory.addRoll(RollPhase.ALL_IN, combinedRoll);
  }

  rollDice(numDice) {
    return Array.from({ length: numDice }, () => Math.floor(Math.random() * 6) + 1);
  }
}

// Message generation
class MessageGenerator {
  generateRollMessage(rollHistory) {
    let message = '';
    
    // Add roll lines
    const phases = [RollPhase.INITIAL, RollPhase.REROLL, RollPhase.FREE_REROLL, RollPhase.ALL_IN];
    for (const phase of phases) {
      message += this._generateRollLine(rollHistory, phase);
    }
    
    message += '<hr>';
    
    // Add matches
    const finalRoll = rollHistory.getFinalRoll();
    message += this._generateMatchesText(finalRoll.matches);
    message += this._generateMatchesText(finalRoll.failedMatches, true);
    
    return message;
  }

  _generateRollLine(rollHistory, rollPhase) {
    const roll = rollHistory.getRoll(rollPhase);
    if (!roll) return '';
    
    const phaseName = this._getPhaseDisplayName(rollPhase);
    let rollEmoji = '';
    
    if (rollPhase === RollPhase.REROLL || rollPhase === RollPhase.ALL_IN) {
      rollEmoji = roll.failedReroll ? 
        ' ' + game.i18n.localize('directors-cut-dice.indicators.failure') : 
        ' ' + game.i18n.localize('directors-cut-dice.indicators.success');
    } else if (rollPhase === RollPhase.FREE_REROLL) {
      const initialRoll = rollHistory.getRoll(RollPhase.INITIAL);
      if (roll.isBetterThan(initialRoll)) {
        rollEmoji = ' ' + game.i18n.localize('directors-cut-dice.indicators.success');
      }
    }
    
    const diceDisplay = roll.dice.map(die => this._createDieHTML(die)).join(' ');
    return `<div><strong>${phaseName}${rollEmoji}:</strong> ${diceDisplay}</div>`;
  }

  _generateMatchesText(matches, lost = false) {
    let message = '';
    const lostText = lost ? game.i18n.localize('directors-cut-dice.indicators.lost') + ' ' : '';
    
    const sortedMatches = Object.entries(matches)
      .filter(([numMatches]) => numMatches > 1)
      .sort(([a], [b]) => b - a);
    
    for (const [numMatches, dice] of sortedMatches) {
      const successName = this._getSuccessName(parseInt(numMatches));
      const diceDisplay = dice.map(die => {
        const dieHTML = this._createDieHTML(die);
        return Array(parseInt(numMatches)).fill(dieHTML).join('');
      }).join(' , ');
      
      message += `<div><strong>${lostText}${dice.length} ${successName}:</strong> ${diceDisplay}</div>`;
    }
    
    return message;
  }

  _createDieHTML(dieValue) {
    return `<span class="dc-die outgunned-${dieValue}"></span>`;
  }

  _getPhaseDisplayName(phase) {
    switch (phase) {
      case RollPhase.INITIAL: return game.i18n.localize('directors-cut-dice.phases.initial');
      case RollPhase.REROLL: return game.i18n.localize('directors-cut-dice.phases.reroll');
      case RollPhase.FREE_REROLL: return game.i18n.localize('directors-cut-dice.phases.freereroll');
      case RollPhase.ALL_IN: return game.i18n.localize('directors-cut-dice.phases.allin');
      default: return game.i18n.localize('directors-cut-dice.misc.unknown');
    }
  }

  _getSuccessName(numMatches) {
    switch (numMatches) {
      case 2: return game.i18n.localize('directors-cut-dice.success.basic');
      case 3: return game.i18n.localize('directors-cut-dice.success.critical');
      case 4: return game.i18n.localize('directors-cut-dice.success.extreme');
      case 5: return game.i18n.localize('directors-cut-dice.success.impossible');
      case 6: 
      case 7:
      case 8:
      case 9: return game.i18n.localize('directors-cut-dice.success.jackpot');
      default: return 'N/A';
    }
  }
}

// Chat command handler
class DirectorsCutDice {
  static ID = 'directors-cut-dice';
  
  static initialize() {
    console.log("Director's Cut Dice | Initializing");
    
    // Register chat commands
    this.registerChatCommands();
    
    // Add socket listeners for button interactions
    this.setupSocketListeners();
  }

  static registerChatCommands() {
    // Register /roll command
    Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
      const rollMatch = messageText.match(/^\/roll\s+(\d+)$/i);
      if (rollMatch) {
        const numDice = parseInt(rollMatch[1]);
        if (numDice > 0 && numDice <= 20) {
          this.handleRollCommand(numDice, chatData);
          return false; // Prevent default processing
        }
      }

      const coinMatch = messageText.match(/^\/coin$/i);
      if (coinMatch) {
        this.handleCoinCommand(chatData);
        return false;
      }

      const d6Match = messageText.match(/^\/d6$/i);
      if (d6Match) {
        this.handleD6Command(chatData);
        return false;
      }
    });
  }

  static async handleRollCommand(numDice, chatData) {
    const roller = new Roller(numDice);
    roller.roll();
    
    const messageGen = new MessageGenerator();
    const content = messageGen.generateRollMessage(roller.rollHistory);
    
    const messageData = {
      user: chatData.user,
      speaker: chatData.speaker,
      content: this.createChatMessage(content, roller.rollHistory)
    };
    
    ChatMessage.create(messageData);
  }

  static createChatMessage(content, rollHistory) {
    const rollId = foundry.utils.randomID();
    const canReroll = rollHistory.canReroll();
    const canFreeReroll = rollHistory.canFreeReroll();
    const canAllIn = rollHistory.canGoAllIn();
    
    let buttons = '';
    if (canReroll) {
      buttons += `<button class="dc-reroll-btn" data-action="reroll" data-roll-id="${rollId}">${game.i18n.localize('directors-cut-dice.buttons.reroll')}</button>`;
    }
    if (canFreeReroll) {
      buttons += `<button class="dc-reroll-btn" data-action="freereroll" data-roll-id="${rollId}">${game.i18n.localize('directors-cut-dice.buttons.freereroll')}</button>`;
    }
    if (canAllIn) {
      buttons += `<button class="dc-reroll-btn" data-action="allin" data-roll-id="${rollId}">${game.i18n.localize('directors-cut-dice.buttons.allin')}</button>`;
    }
    
    // Store roll history for button interactions
    game.modules.get(this.ID).rollHistories = game.modules.get(this.ID).rollHistories || {};
    game.modules.get(this.ID).rollHistories[rollId] = rollHistory;
    
    return `
      <div class="directors-cut-roll" data-roll-id="${rollId}">
        ${content}
        ${buttons ? `<div class="dc-button-container">${buttons}</div>` : ''}
      </div>
    `;
  }

  static async handleCoinCommand(chatData) {
    const result = Math.random() < 0.5 ? 
      game.i18n.localize('directors-cut-dice.messages.coinHeads') : 
      game.i18n.localize('directors-cut-dice.messages.coinTails');
    
    const messageData = {
      user: chatData.user,
      speaker: chatData.speaker,
      content: `<div><strong>${game.i18n.localize('directors-cut-dice.messages.coinFlip')}:</strong> ${result}</div>`
    };
    
    ChatMessage.create(messageData);
  }

  static async handleD6Command(chatData) {
    const result = Math.floor(Math.random() * 6) + 1;
    const messageGen = new MessageGenerator();
    
    const messageData = {
      user: chatData.user,
      speaker: chatData.speaker,
      content: `<div><strong>${game.i18n.localize('directors-cut-dice.messages.d6')}:</strong> ${messageGen._createDieHTML(result)}</div>`
    };
    
    ChatMessage.create(messageData);
  }

  static setupSocketListeners() {
    // Handle button clicks
    $(document).on('click', '.dc-reroll-btn', async (event) => {
      const action = event.currentTarget.dataset.action;
      const rollId = event.currentTarget.dataset.rollId;
      
      const rollHistories = game.modules.get(this.ID).rollHistories || {};
      const rollHistory = rollHistories[rollId];
      
      if (!rollHistory) {
        ui.notifications.error(game.i18n.localize('directors-cut-dice.messages.rollHistoryNotFound'));
        return;
      }
      
      const roller = new Roller(0, rollHistory);
      
      try {
        switch (action) {
          case 'reroll':
            if (!rollHistory.canReroll()) {
              ui.notifications.error(game.i18n.localize('directors-cut-dice.messages.cannotReroll'));
              return;
            }
            roller.reroll();
            break;
          case 'freereroll':
            if (!rollHistory.canFreeReroll()) {
              ui.notifications.error(game.i18n.localize('directors-cut-dice.messages.cannotFreeReroll'));
              return;
            }
            roller.freeReroll();
            break;
          case 'allin':
            if (!rollHistory.canGoAllIn()) {
              ui.notifications.error(game.i18n.localize('directors-cut-dice.messages.cannotAllIn'));
              return;
            }
            roller.allIn();
            break;
        }
        
        // Update the message
        const messageGen = new MessageGenerator();
        const content = messageGen.generateRollMessage(rollHistory);
        const newContent = this.createChatMessage(content, rollHistory);
        
        const chatMessage = game.messages.find(m => m.content.includes(`data-roll-id="${rollId}"`));
        if (chatMessage) {
          await chatMessage.update({ content: newContent });
        }
        
      } catch (error) {
        ui.notifications.error(error.message);
      }
    });
  }
}

// Initialize when Foundry is ready
Hooks.once('ready', () => {
  DirectorsCutDice.initialize();
});

console.log("Director's Cut Dice | Module loaded"); 