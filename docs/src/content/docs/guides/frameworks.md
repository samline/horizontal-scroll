---
title: 'Framework integrations'
titleAccent: 'integrations'
description: Use @samline/horizontal-scroll in React, Vue, Svelte, Astro, Shopify and WordPress, and keep it working with client-side navigation and page swaps.
locale: en
sidebar:
  group: guides
  order: 4
---

`horizontalScroll` returns an object with `destroy()`, so it fits every framework's mount and unmount hooks. Changes in size are picked up on their own; call `refresh()` after replacing the track element.

## React

```jsx
import { horizontalScroll } from '@samline/horizontal-scroll'
import { useEffect, useRef } from 'react'

export function Gallery({ items }) {
  const section = useRef(null)

  useEffect(() => {
    const scroller = horizontalScroll(section.current, { top: 64 })
    return () => scroller.destroy()
  }, [])

  return (
    <section ref={section} className="gallery">
      <div data-horizontal-scroll-track className="row">
        {items.map(item => (
          <article key={item.id} className="card" tabIndex={0}>
            {item.title}
          </article>
        ))}
      </div>
    </section>
  )
}
```

## Vue

```vue
<script setup>
import { horizontalScroll } from '@samline/horizontal-scroll'
import { onBeforeUnmount, onMounted, ref } from 'vue'

const section = ref(null)
let scroller

onMounted(() => (scroller = horizontalScroll(section.value)))
onBeforeUnmount(() => scroller?.destroy())
</script>

<template>
  <section ref="section">
    <div data-horizontal-scroll-track class="row"><slot /></div>
  </section>
</template>
```

## Svelte

```svelte
<script>
  import { horizontalScroll } from '@samline/horizontal-scroll'

  const pin = node => {
    const scroller = horizontalScroll(node)
    return { destroy: scroller.destroy }
  }
</script>

<section use:pin>
  <div data-horizontal-scroll-track class="row"><slot /></div>
</section>
```

## Astro

```astro
<section data-horizontal-scroll>
  <div data-horizontal-scroll-track class="row">
    <slot />
  </div>
</section>

<script>
  import { autoHorizontalScroll } from '@samline/horizontal-scroll'

  autoHorizontalScroll()
</script>
```

`autoHorizontalScroll` watches the page, so sections added or removed by client-side navigation (Astro view transitions, swup, Turbo or htmx) are set up and cleaned up on their own. With view transitions that replace the whole body, start it once from a module script; it keeps watching the new body.

## Shopify

Load the pinned classic script once from theme assets. Copy `dist/browser/horizontal-scroll.global.js` from the matching published release to `assets/horizontal-scroll.global.js` (the package ships no stylesheet; keep your section CSS in the theme) and include it once in `layout/theme.liquid`, not in every section.

```liquid
<script src="{{ 'horizontal-scroll.global.js' | asset_url }}" defer></script>
```

Mark up the section with the same attributes as everywhere else.

```liquid
<section data-horizontal-scroll aria-label="{{ section.settings.title | escape }}">
  <div data-horizontal-scroll-track class="row">
    {% for block in section.blocks %}
      <article class="card" tabindex="0" {{ block.shopify_attributes }}>{{ block.settings.title }}</article>
    {% endfor %}
  </div>
</section>
```

The script sets up every `[data-horizontal-scroll]` section and keeps watching the page, so a section the theme editor adds, re-renders on `shopify:section:load` or removes on `shopify:section:unload` is set up or cleaned up without extra code. Call `HorizontalScroll.controller.refresh()` only if your own code replaces a track element. See [Shopify's section events](https://shopify.dev/docs/storefronts/themes/best-practices/editor/integrate-sections-and-blocks).

## WordPress

Copy the same pinned `horizontal-scroll.global.js` into your theme or plugin and enqueue it in `wp_enqueue_scripts`. The script starts when the DOM is ready, so a deferred load is enough (WordPress 6.3+).

```php
add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script(
    'samline-horizontal-scroll',
    get_theme_file_uri('assets/horizontal-scroll.global.js'),
    [],
    '1.0.1',
    ['strategy' => 'defer', 'in_footer' => true]
  );
});
```

Add the `data-horizontal-scroll` section and its `data-horizontal-scroll-track` child in a Custom HTML block or a template; the script finds them on its own. See [wp_enqueue_script](https://developer.wordpress.org/reference/functions/wp_enqueue_script/).
