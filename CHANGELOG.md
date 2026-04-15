# Changelog

## [Unreleased]

## [1.0.2] - 2026-04-15

### Release Alignment

- Updated compatibility to Foundry VTT v13-14.
- Added stable v14 compatibility notes to documentation.
- Removed stale module ZIP artifacts ahead of release.

## [1.0.1] - 2026-03-31

- Cleaned module metadata for release-based manifest and download URLs
- Corrected compatibility values to numeric Foundry manifest fields
- Added explicit `protected: false` for the free module manifest
- Removed the unused animation setting from code, template, localization, and documentation
- Fixed live range value updates in the settings window
- Added a working close button to the settings window
- Applied immediate hover refresh when settings change
- Added local validation through `npm test`
- Updated README for current installation and usage details

## [1.0.0] - 2026-02-23

- Initial release
- Added hover glow effects for tokens, tiles, drawings, walls, and lights
- Added a Game Master settings window with color, intensity, size, and object type controls
- Added client-side hover filters for lightweight highlighting
- Verified support for Foundry VTT 11 through 13