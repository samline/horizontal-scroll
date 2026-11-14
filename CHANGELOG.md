# Changelog

All notable changes to this package. Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/); versions follow [semver](https://semver.org/).

## Unreleased

### Changed

- The package moved from the `samline/utils` monorepo to its own repository, [samline/horizontal-scroll](https://github.com/samline/horizontal-scroll). Homepage, repository and documentation links point to the package's own site.

## [1.0.0] - 2026-11-13

### Added

- First release: `horizontalScroll` and `autoHorizontalScroll` pin a section while its track moves sideways with the vertical scroll, using `position: sticky` and a measured section height, with `top` for fixed headers, `speed`, `media` queries, reduced motion, keyboard focus that scrolls the page to off-screen items, scroll containers (`root`), a `--horizontal-scroll-progress` variable and `onProgress`. When it is not running the section is left to your CSS. ESM, CommonJS and a browser global (`window.HorizontalScroll`) that starts on its own.
