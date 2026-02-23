const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

export class HighlightSettingsApp extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "rnk-highlight-settings",
    classes: ["rnk-highlight", "window-app"],
    window: { title: "RNKHIGHLIGHT.settings.title" },
    position: { width: 600, height: 500 }
  };

  static PARTS = {
    main: { template: "modules/rnk-highlight/templates/settings.hbs" }
  };

  async _prepareContext(options) {
    return {
      glowEnabled: game.settings.get('rnk-highlight', 'glowEnabled'),
      glowColor: game.settings.get('rnk-highlight', 'glowColor'),
      intensity: game.settings.get('rnk-highlight', 'intensity'),
      size: game.settings.get('rnk-highlight', 'size'),
      animation: game.settings.get('rnk-highlight', 'animation'),
      tokens: game.settings.get('rnk-highlight', 'tokens'),
      tiles: game.settings.get('rnk-highlight', 'tiles'),
      drawings: game.settings.get('rnk-highlight', 'drawings'),
      walls: game.settings.get('rnk-highlight', 'walls'),
      lights: game.settings.get('rnk-highlight', 'lights')
    };
  }

  _onRender(context, options) {
    super._onRender(context, options);
    const html = this.element;
    html.querySelectorAll('input[type="range"]').forEach(input => {
      input.addEventListener('input', (ev) => {
        const display = html.querySelector(`span[data-for="${ev.target.id}"]`);
        if (display) {
          display.textContent = ev.target.value + (ev.target.id === 'size' ? 'px' : '%');
        }
      });
    });
    html.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', this._onChange.bind(this));
    });
    const saveBtn = html.querySelector('.save-settings');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.close());
    }
  }

  _onChange(event) {
    const { name, value, checked } = event.target;
    const settingValue = event.target.type === 'checkbox' ? checked : (event.target.type === 'range' ? parseInt(value) : value);
    game.settings.set('rnk-highlight', name, settingValue);
    window.RNKHighlight?.reinitializeHovers();
  }
}