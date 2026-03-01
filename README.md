# RNK Highlight

Adds hover glow effects to clickable scene objects in Foundry VTT.

![Version](https://img.shields.io/badge/version-1.0.0-blue?style=flat-square)
![Foundry](https://img.shields.io/badge/foundry-11%2B-green?style=flat-square)
![License](https://img.shields.io/badge/license-RNK%20Proprietary-red?style=flat-square)
![Free](https://img.shields.io/badge/free-yes-brightgreen?style=flat-square)

---

## Quick Start

### Installation

1. Copy this manifest URL:
```
https://github.com/RNK-Enterprise/rnk-highlight/releases/latest/download/module.json
```

2. In Foundry VTT:
   - Open **Add-on Modules** → **Install Module**
   - Paste the manifest URL
   - Click **Install**
   - Enable in your world

3. Enjoy hover glow effects!

---

## What is RNK Highlight?

RNK Highlight adds elegant, customizable hover glow effects to scene objects in Foundry VTT. When game masters and players hover over tokens, tiles, drawings, walls, or lights, they see a beautiful glow effect that makes interactive objects more discoverable.

Built for performance with lightweight CSS-based rendering and optional animations.

---

## Features

Customizable Glow Effects
- Enable/disable glow effects globally
- Choose glow color with color picker
- Adjust glow intensity (0-100%)
- Adjust glow blur size (0-50px)
- Optional fade animations

Object Type Control
- Enable/disable glow for tokens
- Enable/disable glow for tiles
- Enable/disable glow for drawings
- Enable/disable glow for walls
- Enable/disable glow for lights

Performance
- Client-side only (no server load)
- CSS-based rendering
- Minimal memory footprint
- Zero impact on token performance

---

## Configuration

All settings are accessible to GMs via the Module Settings:

**Enable Glow**
- Toggle glow effects on/off globally
- Default: On

**Glow Color**
- Choose any color via color picker
- Default: Blue (#0066ff)

**Intensity**
- Opacity of glow effect (0-100%)
- Default: 70%

**Size**
- Blur radius of glow (0-50px)
- Default: 20px

**Animation**
- Enable fade transition effect on hover
- Default: On

**Object Types**
- Tokens: Enable glow for tokens
- Tiles: Enable glow for tiles
- Drawings: Enable glow for drawings
- Walls: Enable glow for walls
- Lights: Enable glow for lights

---

## License & Support

### License

RNK Highlight is protected under the RNK Proprietary License.

Free for personal use - No redistribution or modification without permission.

For full license terms, see LICENSE-RNK-PROPRIETARY.md

### Support

RNK Highlight is free for all users.

Support RNK on Patreon for exclusive early access to new modules and direct influence on development:

[Support RNK on Patreon](https://www.patreon.com/RagNaroks)

---

## Documentation & Resources

- **Report Issues** - [GitHub Issues](https://github.com/RNK-Enterprise/rnk-highlight/issues)
- **Discussions** - [GitHub Discussions](https://github.com/RNK-Enterprise/rnk-highlight/discussions)
- **Patreon** - [Direct Support](https://www.patreon.com/RagNaroks)

---

## Troubleshooting

### Glow Not Showing

**Problem:** Hover glow effects don't appear

**Solutions:**
1. Check "Enable Glow" setting is ON
2. Verify glow color is different from background
3. Reload the world (F5)
4. Check if specific object type is disabled in settings

### Performance Issues

**Problem:** Frame rate drops when hovering

**Solutions:**
1. Reduce glow "Size" value in settings
2. Disable animation if not needed
3. Disable glow for object types you don't need
4. Check browser console for errors (F12)

### Color Not Visible

**Problem:** Glow color doesn't show against background

**Solutions:**
1. Choose a brighter color via color picker
2. Increase "Intensity" value
3. Check for conflicting CSS from other modules
4. Try resetting to default color

---

## Changelog

### Version 1.0.0 (February 2026)

Initial release

Features:
- Hover glow effects for tokens, tiles, drawings, walls, lights
- GM settings hub with customization options
- Color picker for glow color selection
- Animation toggle for fade transitions
- Per-object-type enable/disable
- Client-side CSS-based rendering

Compatibility:
- Foundry VTT 11+
- Verified on v13
- Modern browsers (Chrome, Firefox, Safari, Edge)

---

## Contributing

RNK Highlight is a proprietary product. We welcome bug reports on GitHub.

---

## Contact & Community

- **Bug Reports:** [GitHub Issues](https://github.com/RNK-Enterprise/rnk-highlight/issues)
- **Feature Requests:** [Patreon Community](https://www.patreon.com/RagNaroks)
- **Discord:** [RNK Enterprise Community](https://discord.com/invite/rnk)

---

## Credits

**RNK Highlight**
- Developed by RNK Enterprise © 2026
- Built for Foundry Virtual Tabletop

---

**RNK is a registered trademark of RNK Enterprises. All rights reserved.**

*Last Updated: February 23, 2026*
*Module Version: 1.0.0*
*Foundry Compatibility: v11-13*
