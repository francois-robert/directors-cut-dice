// Dice Settings Configuration for Director's Cut RPG Dice Module

class DiceSettings {
  static ID = 'directors-cut-dice';
  static SETTINGS = {
    SHOW_THUMBNAILS: 'showThumbnails',
    AUTO_SORT: 'autoSort'
  };

  static initialize() {
    // Register module settings
    this.registerSettings();
    
    // Add settings menu
    this.addSettingsMenu();
  }

  static registerSettings() {
    // Show Thumbnails Setting
    game.settings.register(this.ID, this.SETTINGS.SHOW_THUMBNAILS, {
      name: game.i18n.localize(`${this.ID}.settings.showThumbnails.name`),
      hint: game.i18n.localize(`${this.ID}.settings.showThumbnails.hint`),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });

    // Auto Sort Setting
    game.settings.register(this.ID, this.SETTINGS.AUTO_SORT, {
      name: game.i18n.localize(`${this.ID}.settings.autoSort.name`),
      hint: game.i18n.localize(`${this.ID}.settings.autoSort.hint`),
      scope: 'world',
      config: true,
      type: Boolean,
      default: true
    });
  }

  static addSettingsMenu() {
    game.settings.registerMenu(this.ID, 'diceSettingsMenu', {
      name: game.i18n.localize(`${this.ID}.settings.menu.name`),
      label: game.i18n.localize(`${this.ID}.settings.menu.label`),
      hint: game.i18n.localize(`${this.ID}.settings.menu.hint`),
      icon: 'fas fa-dice',
      type: DiceSettingsMenu,
      restricted: true
    });
  }

  static getShowThumbnails() {
    return game.settings.get(this.ID, this.SETTINGS.SHOW_THUMBNAILS);
  }

  static getAutoSort() {
    return game.settings.get(this.ID, this.SETTINGS.AUTO_SORT);
  }
}

class DiceSettingsMenu extends FormApplication {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('directors-cut-dice.settings.menu.title'),
      id: 'dice-settings-menu',
      template: 'modules/directors-cut-dice/templates/settings-menu.html',
      width: 500,
      height: 'auto',
      closeOnSubmit: true
    });
  }

  getData() {
    return {
      showThumbnails: DiceSettings.getShowThumbnails(),
      autoSort: DiceSettings.getAutoSort()
    };
  }

  async _updateObject(event, formData) {
    await game.settings.set(DiceSettings.ID, DiceSettings.SETTINGS.SHOW_THUMBNAILS, formData.showThumbnails);
    await game.settings.set(DiceSettings.ID, DiceSettings.SETTINGS.AUTO_SORT, formData.autoSort);
    
    ui.notifications.info(game.i18n.localize('directors-cut-dice.settings.saved'));
  }
}

// Initialize when ready
Hooks.once('ready', () => {
  DiceSettings.initialize();
}); 