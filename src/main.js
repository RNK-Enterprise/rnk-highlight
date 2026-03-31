import { HighlightSettingsApp } from './settings.js';

const MODULE_ID = 'rnk-highlight';
const CONTROL_ID = 'rnk-highlight';
const CONTROL_TOOL_ID = 'rnk-highlight-open';
const SETTINGS = {
  glowEnabled: { type: Boolean, default: true, hasHint: true },
  glowColor: { type: String, default: '#ffffff' },
  intensity: { type: Number, default: 50 },
  size: { type: Number, default: 10 },
  tokens: { type: Boolean, default: true },
  tiles: { type: Boolean, default: true },
  drawings: { type: Boolean, default: true },
  walls: { type: Boolean, default: true },
  lights: { type: Boolean, default: true }
};
const HOVER_HOOKS = [
  ['hoverToken', 'tokens'],
  ['hoverTile', 'tiles'],
  ['hoverDrawing', 'drawings'],
  ['hoverWall', 'walls'],
  ['hoverAmbientLight', 'lights']
];

Hooks.once('init', () => {
  registerSettings();
});

Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user.isGM) return;

  const tool = {
    name: CONTROL_TOOL_ID,
    title: 'RNKHIGHLIGHT.settings.title',
    icon: 'fas fa-lightbulb',
    button: true,
    onClick: () => {
      new HighlightSettingsApp().render({ force: true });
    }
  };

  const control = {
    name: CONTROL_ID,
    title: 'RNKHIGHLIGHT.settings.title',
    icon: 'fas fa-highlighter',
    order: 100,
    layer: 'lighting',
    visible: true,
    tools: Array.isArray(controls) ? [tool] : { [CONTROL_TOOL_ID]: tool }
  };

  if (Array.isArray(controls)) {
    controls.push(control);
  } else if (controls && typeof controls === 'object') {
    controls[CONTROL_ID] = control;
  }
});

function registerSettings() {
  for (const [key, config] of Object.entries(SETTINGS)) {
    game.settings.register(MODULE_ID, key, {
      name: `RNKHIGHLIGHT.settings.${key}`,
      hint: config.hasHint ? `RNKHIGHLIGHT.settings.${key}Hint` : undefined,
      scope: 'world',
      config: false,
      type: config.type,
      default: config.default,
      onChange: () => reinitializeHoverEffects()
    });
  }
}

/**
 * Get the renderable PIXI display object for any PlaceableObject type.
 * Tokens/Tiles use .mesh, drawings use .shape, walls/lights use the object itself.
 */
function getSprite(object) {
  // Token and Tile have .mesh (PrimarySpriteMesh in v12+)
  if (object.mesh) return object.mesh;
  // Fallback for older Foundry versions
  if (object.icon) return object.icon;
  // Drawings have a .shape graphic
  if (object.shape) return object.shape;
  // Walls and lights are PIXI containers themselves — apply filters directly
  return object;
}

/**
 * Get the appropriate PIXI filter class, checking multiple locations
 * for compatibility across Foundry versions.
 */
function getFilterClass(filterName) {
  if (globalThis.PIXI?.filters?.[filterName]) return globalThis.PIXI.filters[filterName];
  if (globalThis[filterName]) return globalThis[filterName];
  return null;
}

/**
 * Parse a hex color string to a PIXI-compatible hex number.
 */
function parseColor(hex) {
  try {
    return Color.from(hex).valueOf();
  } catch {
    return 0xffffff;
  }
}

function getSetting(key) {
  return game.settings.get(MODULE_ID, key);
}

function getManagedPlaceables() {
  const layerMap = [
    ['tokens', canvas.tokens?.placeables],
    ['tiles', canvas.tiles?.placeables],
    ['drawings', canvas.drawings?.placeables],
    ['walls', canvas.walls?.placeables],
    ['lights', canvas.lighting?.placeables]
  ];

  return layerMap.flatMap(([key, placeables]) => {
    if (!Array.isArray(placeables)) return [];
    return placeables.map((placeable) => ({ key, placeable }));
  });
}

function isHoverEnabled(settingKey) {
  return getSetting('glowEnabled') && getSetting(settingKey);
}

function reinitializeHoverEffects() {
  if (!canvas?.ready) return;

  for (const { key, placeable } of getManagedPlaceables()) {
    removeGlow(placeable);
    if (placeable.hover && isHoverEnabled(key)) {
      applyGlow(placeable);
    }
  }
}

/**
 * Create a ColorMatrixFilter fallback when GlowFilter is unavailable.
 */
function createFallbackFilter(color, strength = 1) {
  const filter = new PIXI.ColorMatrixFilter();
  const c = Color.from(color);
  const rgb = c.rgb;
  filter.matrix = [
    1, 0, 0, 0, rgb[0] * strength * 0.3,
    0, 1, 0, 0, rgb[1] * strength * 0.3,
    0, 0, 1, 0, rgb[2] * strength * 0.3,
    0, 0, 0, 1, 0
  ];
  return filter;
}

function applyGlow(object) {
  if (!getSetting('glowEnabled')) return;

  const sprite = getSprite(object);
  if (!sprite) return;

  removeGlow(object);

  try {
    const color = parseColor(getSetting('glowColor'));
    const intensity = getSetting('intensity') / 100;
    const size = getSetting('size');

    const GlowFilter = getFilterClass('GlowFilter');
    let filter;

    if (GlowFilter) {
      filter = new GlowFilter({
        distance: size,
        outerStrength: intensity * 2.5,
        innerStrength: intensity * 0.5,
        color: color
      });
    } else {
      filter = createFallbackFilter(color, intensity);
    }

    filter._rnkHighlight = true;

    const existing = sprite.filters ? [...sprite.filters] : [];
    existing.push(filter);
    sprite.filters = existing;

    object._rnkHighlightSprite = sprite;
  } catch (err) {
    console.error('RNK™ Highlight | Failed to apply glow filter', err);
  }
}

function removeGlow(object) {
  const sprite = object._rnkHighlightSprite || getSprite(object);
  if (!sprite?.filters) return;

  try {
    const filtered = sprite.filters.filter(f => !f._rnkHighlight);
    sprite.filters = filtered.length > 0 ? filtered : null;
    delete object._rnkHighlightSprite;
  } catch (err) {
    console.error('RNK™ Highlight | Failed to remove glow filter', err);
  }
}

for (const [hookName, settingKey] of HOVER_HOOKS) {
  Hooks.on(hookName, (placeable, hovered) => {
    if (!getSetting(settingKey)) {
      removeGlow(placeable);
      return;
    }

    if (hovered) {
      applyGlow(placeable);
      return;
    }

    removeGlow(placeable);
  });
}

Hooks.on('canvasReady', () => {
  reinitializeHoverEffects();
});

window.RNKHighlight = {
  reinitializeHovers: reinitializeHoverEffects
};