// Refreshes the product preview images used on the homepage and /products.
//
// The previews are the only bitmaps on the site. They are captured from the
// live product sites, so re-run this whenever those sites change.
//
// Setup (nothing here is committed; tools/node_modules is gitignored):
//   cd tools
//   npm install --no-save playwright sharp
//   npx playwright install chromium
//
// Run from the repo root:
//   node tools/capture-previews.mjs            (all products)
//   node tools/capture-previews.mjs capstone   (just one)
//
// Output: assets/img/products/<name>-<desktop|mobile>-<width>.<avif|webp>
// Each file is kept under MAX_BYTES by stepping the quality down.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../assets/img/products');
const MAX_BYTES = 250 * 1024;
const MAX_CSS_HEIGHT = 4000; // crop full-page desktop shots to this many CSS px

const SITES = [
  { name: 'capstone', url: 'https://capstoneops.co.uk' },
  { name: 'atlas', url: 'https://flyatlas.app' },
];

const SHOTS = [
  { kind: 'desktop', viewport: { width: 1440, height: 900 }, widths: [800, 1600], isMobile: false, maxHeight: MAX_CSS_HEIGHT },
  // Mobile frames only ever show the top of the page, so a shorter crop keeps the file sharp and small.
  { kind: 'mobile', viewport: { width: 390, height: 844 }, widths: [800], isMobile: true, maxHeight: 1600 },
];

const COOKIE_BUTTONS = /^(accept( all)?( cookies)?|allow( all)?( cookies)?|agree|i agree|got it|ok(ay)?|reject( all)?|decline|dismiss|close)$/i;

async function dismissCookies(page) {
  for (const role of ['button', 'link']) {
    const candidates = page.getByRole(role, { name: COOKIE_BUTTONS });
    const n = await candidates.count().catch(() => 0);
    for (let i = 0; i < n; i++) {
      const el = candidates.nth(i);
      if (await el.isVisible().catch(() => false)) {
        // Only click things that sit inside something that looks like a banner.
        const inBanner = await el.evaluate((node) => {
          const hit = node.closest('[class*="cookie" i],[id*="cookie" i],[class*="consent" i],[id*="consent" i],[aria-label*="cookie" i],[role="dialog"]');
          return !!hit;
        }).catch(() => false);
        if (inBanner) { await el.click({ timeout: 2000 }).catch(() => {}); await page.waitForTimeout(400); return true; }
      }
    }
  }
  return false;
}

async function encode(buf, width, format) {
  const resized = sharp(buf).resize({ width, withoutEnlargement: true });
  for (let q = format === 'avif' ? 55 : 78; q >= 20; q -= 6) {
    const out = await resized.clone()[format](format === 'avif' ? { quality: q, effort: 5 } : { quality: q, effort: 5 }).toBuffer();
    if (out.length <= MAX_BYTES || q - 6 < 20) return { out, q };
  }
}

async function capture(browser, site) {
  for (const shot of SHOTS) {
    const context = await browser.newContext({
      viewport: shot.viewport,
      deviceScaleFactor: 2,
      isMobile: shot.isMobile,
      hasTouch: shot.isMobile,
      reducedMotion: 'reduce',
      locale: 'en-GB',
    });
    const page = await context.newPage();
    await page.goto(site.url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.evaluate(() => document.fonts.ready);
    await dismissCookies(page);

    // Scroll through the page once so lazy images and scroll reveals resolve.
    await page.evaluate(async (maxH) => {
      const h = Math.min(document.documentElement.scrollHeight, maxH);
      for (let y = 0; y < h; y += 400) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
      window.scrollTo(0, 0);
    }, shot.maxHeight);
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(600);

    const full = await page.screenshot({ fullPage: true, type: 'png' });
    await context.close();

    const meta = await sharp(full).metadata();
    const cropH = Math.min(meta.height, shot.maxHeight * 2);
    const cropped = await sharp(full).extract({ left: 0, top: 0, width: meta.width, height: cropH }).png().toBuffer();

    for (const width of shot.widths) {
      for (const format of ['avif', 'webp']) {
        const { out, q } = await encode(cropped, width, format);
        const file = `${site.name}-${shot.kind}-${width}.${format}`;
        await writeFile(path.join(OUT, file), out);
        const m = await sharp(out).metadata();
        console.log(`${file}  ${m.width}x${m.height}  ${(out.length / 1024).toFixed(0)}KB  q${q}`);
      }
    }
  }
}

const only = process.argv[2];
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
let failed = false;
for (const site of SITES.filter((s) => !only || s.name === only)) {
  try {
    await capture(browser, site);
  } catch (err) {
    failed = true;
    console.error(`FAILED ${site.name} (${site.url}): ${err.message}`);
  }
}
await browser.close();
process.exit(failed ? 1 : 0);
