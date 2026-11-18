// DOM-free part of horizontal-scroll: types, constants and pure helpers. The DOM
// controller lives in src/vanilla/horizontal-scroll.ts.
import { type AutoInitController, type ElementTarget } from '@samline/internal'

export type { AutoInitController, ElementTarget }

export interface HorizontalScrollProgress {
  /** From 0 (start) to 1 (end of the track). */
  progress: number
  /** Current horizontal shift of the track, in pixels (0 or negative). */
  x: number
  /** How far the track moves in total, in pixels. */
  distance: number
}

export interface HorizontalScrollOptions {
  /**
   * The row that moves sideways: a selector inside the section or an element.
   * Defaults to `[data-horizontal-scroll-track]`, or the first child.
   */
  track?: string | Element
  /**
   * Where the track pins, from the top of the viewport (or `root`): pixels
   * (`64`) or a percentage of its height (`'10%'`). Use it to clear a fixed
   * header. Defaults to `0`.
   */
  top?: number | string
  /**
   * Scroll container holding the section, when it is not the page. Defaults
   * to the viewport.
   */
  root?: Element | null
  /**
   * Horizontal pixels moved per vertical pixel scrolled. `2` crosses the
   * track in half the scrolling. Defaults to `1`.
   */
  speed?: number
  /**
   * Media query that turns the effect on, for example `'(min-width: 768px)'`.
   * Outside it the section is left to your CSS. Defaults to always.
   */
  media?: string
  /**
   * Turn the effect off when the visitor prefers reduced motion. Defaults to `true`.
   */
  respectReducedMotion?: boolean
  /**
   * Scroll the page so a focused element inside the track is visible.
   * Defaults to `true`.
   */
  followFocus?: boolean
  /** Called whenever the progress changes. */
  onProgress?: (state: HorizontalScrollProgress) => void
}

export interface AutoHorizontalScrollOptions extends HorizontalScrollOptions {
  /** Sections to set up. Defaults to `'[data-horizontal-scroll]'`. */
  selector?: string
  /** Where to look for them. Defaults to `document`. */
  scope?: ParentNode
  /** Also set up matching sections added later. Defaults to `true`. */
  observe?: boolean
}

export interface HorizontalScroll {
  /** True while the section is pinned and moving sideways. */
  readonly active: boolean
  /** From 0 to 1. */
  readonly progress: number
  /** Measure again, for example after changing the content. */
  refresh: () => void
  /** Stop and restore every style it set. */
  destroy: () => void
}

export const ATTRIBUTE = 'data-horizontal-scroll'
export const TRACK_ATTRIBUTE = 'data-horizontal-scroll-track'
export const STATE_ATTRIBUTE = 'data-horizontal-scroll-state'
export const PROGRESS_PROPERTY = '--horizontal-scroll-progress'

export const noop = () => {}
export const inert: HorizontalScroll = { active: false, progress: 0, refresh: noop, destroy: noop }

/** `64` → 64 px; `'10%'` → a tenth of `height`; `'64px'` or `'64'` → 64 px. */
export const resolveLength = (value: number | string, height: number) => {
  if (typeof value === 'number') return value
  const number = parseFloat(value)
  if (!Number.isFinite(number)) return 0
  return value.trim().endsWith('%') ? (height * number) / 100 : number
}

export const clamp = (value: number) => Math.min(1, Math.max(0, value))
