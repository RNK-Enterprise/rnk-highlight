import { HighlightSettingsApp } from './settings.js';

Hooks.once('init', () => {
  game.settings.register('rnk-highlight', 'glowEnabled', {
    name: 'RNKHIGHLIGHT.settings.glowEnabled',
    hint: 'RNKHIGHLIGHT.settings.glowEnabledHint',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'glowColor', {
    name: 'RNKHIGHLIGHT.settings.glowColor',
    scope: 'world',
    config: false,
    type: String,
    default: '#ffffff'
  });

  game.settings.register('rnk-highlight', 'intensity', {
    name: 'RNKHIGHLIGHT.settings.intensity',
    scope: 'world',
    config: false,
    type: Number,
    default: 50
  });

  game.settings.register('rnk-highlight', 'size', {
    name: 'RNKHIGHLIGHT.settings.size',
    scope: 'world',
    config: false,
    type: Number,
    default: 10
  });

  game.settings.register('rnk-highlight', 'animation', {
    name: 'RNKHIGHLIGHT.settings.animation',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'tokens', {
    name: 'RNKHIGHLIGHT.settings.tokens',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'tiles', {
    name: 'RNKHIGHLIGHT.settings.tiles',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'drawings', {
    name: 'RNKHIGHLIGHT.settings.drawings',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'walls', {
    name: 'RNKHIGHLIGHT.settings.walls',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });

  game.settings.register('rnk-highlight', 'lights', {
    name: 'RNKHIGHLIGHT.settings.lights',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });
});

Hooks.on('getSceneControlButtons', (controls) => {
  if (!game.user.isGM) return;
  
  const toolId = 'rnk-highlight-open';
  const tool = {
    name: toolId,
    title: 'RNKHIGHLIGHT.settings.title',
    icon: 'fas fa-lightbulb',
    button: true,
    onClick: () => {
      new HighlightSettingsApp().render({ force: true });
    }
  };

  const control = {
    name: 'rnk-highlight',
    title: 'RNKHIGHLIGHT.settings.title',
    icon: 'fas fa-highlighter',
    order: 100,
    layer: 'lighting',
    visible: true,
    tools: Array.isArray(controls) ? [tool] : { [toolId]: tool }
  };

  if (Array.isArray(controls)) {
    controls.push(control);
  } else if (controls && typeof controls === 'object') {
    controls['rnk-highlight'] = control;
  }
});

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
  if (!game.settings.get('rnk-highlight', 'glowEnabled')) return;

  const sprite = getSprite(object);
  if (!sprite) return;

  removeGlow(object);

  try {
    const color = parseColor(game.settings.get('rnk-highlight', 'glowColor'));
    const intensity = game.settings.get('rnk-highlight', 'intensity') / 100;
    const size = game.settings.get('rnk-highlight', 'size');

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
    console.error("RNK Highlight | Failed to apply glow filter", err);
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
    console.error("RNK Highlight | Failed to remove glow filter", err);
  }
}

// Global Hook Listeners
Hooks.on('hoverToken', (token, hovered) => {
  if (game.settings.get('rnk-highlight', 'tokens')) {
    if (hovered) applyGlow(token);
    else removeGlow(token);
  }
});

Hooks.on('hoverTile', (tile, hovered) => {
  if (game.settings.get('rnk-highlight', 'tiles')) {
    if (hovered) applyGlow(tile);
    else removeGlow(tile);
  }
});

Hooks.on('hoverDrawing', (drawing, hovered) => {
  if (game.settings.get('rnk-highlight', 'drawings')) {
    if (hovered) applyGlow(drawing);
    else removeGlow(drawing);
  }
});

Hooks.on('hoverWall', (wall, hovered) => {
  if (game.settings.get('rnk-highlight', 'walls')) {
    if (hovered) applyGlow(wall);
    else removeGlow(wall);
  }
});

Hooks.on('hoverAmbientLight', (light, hovered) => {
  if (game.settings.get('rnk-highlight', 'lights')) {
    if (hovered) applyGlow(light);
    else removeGlow(light);
  }
});

// For settings change re-initialization (not needed with Hooks, but keeping API)
window.RNKHighlight = {
  reinitializeHovers: () => {
    // Hooks handle this automatically
  }
};