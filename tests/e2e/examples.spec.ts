// The website shows each example twice: a live preview and copyable files
// (site/examples.ts) that load the browser bundle. These tests run the copyable
// files against the built bundle, so the code people copy keeps working.
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import { expect, test } from '@playwright/test'

import horizontalScrollExamples from '../../site/examples'

const bundle = (pkg: string) =>
  fileURLToPath(new URL(`../../dist/browser/${pkg}.global.js`, import.meta.url))

type Example = { id: string; files: { html: string; css?: string; js: string } }

const open = async (page: import('@playwright/test').Page, pkg: string, example: Example) => {
  await page.setContent(
    `<!doctype html><html><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main></body></html>`
  )
  await page.addScriptTag({ path: bundle(pkg) })
  await page.addScriptTag({ content: example.files.js })
}

const find = <T extends Example>(list: readonly T[], id: string) =>
  list.find(item => item.id === id)!

test.describe('horizontal-scroll copyable examples', () => {
  type Page = import('@playwright/test').Page
  const openDocument = async (page: Page, example: Example) => {
    const script = readFileSync(bundle('horizontal-scroll'), 'utf8')
    await page.setViewportSize({ width: 1000, height: 700 })
    await page.setContent(
      `<!doctype html><html lang="en"><head><style>${example.files.css ?? ''}</style></head><body><main>${example.files.html}</main><script>${script}</script><script>${example.files.js}</script></body></html>`
    )
  }
  /** Scroll the page to `fraction` of the way through the pinned section. */
  const through = (page: Page, fraction: number) =>
    page.evaluate(
      fraction =>
        new Promise<{ x: number; top: number }>(resolve => {
          const section = document.querySelector<HTMLElement>('[data-horizontal-scroll]')!
          const track = section.querySelector<HTMLElement>('[data-horizontal-scroll-track]')!
          const pin = parseFloat(track.style.top) || 0
          const start = section.getBoundingClientRect().top + scrollY - pin
          const length = section.offsetHeight - track.offsetHeight
          window.scrollTo({ top: start + length * fraction, behavior: 'instant' })
          requestAnimationFrame(() =>
            requestAnimationFrame(() =>
              resolve({
                x: Math.round(parseFloat(track.style.translate) || 0),
                top: Math.round(track.getBoundingClientRect().top),
              })
            )
          )
        }),
      fraction
    )
  const distance = (page: Page) =>
    page
      .locator('[data-horizontal-scroll-track]')
      .evaluate(track => track.scrollWidth - track.clientWidth)

  test('the gallery pins and crosses its row, then lets the page carry on', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'gallery'))
    await expect(page.locator('[data-horizontal-scroll]')).toHaveAttribute(
      'data-horizontal-scroll-state',
      'active'
    )
    const travel = await distance(page)
    expect(travel).toBeGreaterThan(1000)
    expect(await through(page, 0.5)).toEqual({ x: -Math.round(travel / 2), top: 0 })
    expect((await through(page, 1)).x).toBe(-travel)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(1000)
  })

  test('the timeline pins under the header and fills its progress bar', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'progress'))
    const state = await through(page, 0.5)
    expect(state.top).toBe(64)
    const progress = () =>
      page
        .locator('.progress')
        .evaluate(bar => Number(getComputedStyle(bar).getPropertyValue('--progress')))
    await expect.poll(progress).toBeCloseTo(0.5, 1)
    await through(page, 1)
    await expect.poll(progress).toBe(1)
  })

  test('the carousel only pins on wide screens', async ({ page }) => {
    await openDocument(page, find(horizontalScrollExamples, 'responsive'))
    const section = page.locator('[data-horizontal-scroll]')
    await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'active')
    await page.setViewportSize({ width: 600, height: 700 })
    await expect(section).toHaveAttribute('data-horizontal-scroll-state', 'inactive')
    expect(
      await section.evaluate(el => [
        getComputedStyle(el).scrollSnapType,
        el.scrollWidth > el.clientWidth,
      ])
    ).toEqual(['x mandatory', true])
  })
})
