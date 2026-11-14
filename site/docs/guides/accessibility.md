---
title: 'Accessibility and motion'
titleAccent: 'motion'
description: How @samline/horizontal-scroll handles reduced motion, keyboard focus and the native fallback, and what your markup still provides.
locale: en
sidebar:
  group: guides
  order: 3
  label: Accessibility
---

## Responsibilities

Horizontal Scroll moves a row with the vertical page scroll. It never captures the wheel, touch or keys: scrolling stays native, and only the row's position follows it. It does not change the order, roles or labels of your content. Your markup provides a labelled section (`aria-label` or a heading), focusable cards where they are interactive, and a usable layout when the effect is off.

## Motion and state

- With `prefers-reduced-motion: reduce` nothing is pinned or moved and the section is left to your CSS. The preference is followed live. `respectReducedMotion: false` opts out; only do it when the motion is essential.
- The same fallback applies without JavaScript and outside `media`. Give the section `overflow-x: auto` so the row still scrolls sideways natively, or stack it vertically with `[data-horizontal-scroll-state='inactive']`.
- Progress bars driven by `--horizontal-scroll-progress` are decorative; keep the content understandable without them.

## Keyboard and focus

Tab moves through the cards in document order. When focus lands on a card that is off to the side, the page scrolls at once until the card is fully in view (`followFocus`, on by default; `data-horizontal-scroll-focus="false"` turns it off). Keep a visible focus style on the cards. Content that is not interactive needs no `tabindex`.

## Layout and contrast

Check the pinned section from 320 to 1440 pixels wide and with enlarged text: cards must not be cut off vertically, because the pinned row cannot scroll up and down. Use `media` to keep the effect for wide screens when the cards are tall. Colors and contrast are your own.
