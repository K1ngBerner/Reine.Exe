import { chromium, expect } from "@playwright/test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const baseURL = process.env.PREVIEW_URL || "http://127.0.0.1:4173";
const manifest = JSON.parse(await readFile(path.join(root, "src/data/assets.json"), "utf8"));
const output = path.join(root, "qa-results");
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const report = { baseURL, assets: [], views: [], fallbackTests: [], navigationCancellations: [], errors: [] };
const areas = ["home", "pokemon", "sports", "books", "collection", "games", "2doods", "about", "work"];
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function settleImages(page) {
  await page.locator("img").evaluateAll((images) => images.forEach((image) => { image.loading = "eager"; }));
  await page.waitForFunction(() => [...document.images].every((image) => image.complete && image.naturalWidth > 0));
}
async function visit(page, area) {
  if (page.url().startsWith(baseURL)) {
    await page.evaluate((area) => { location.hash = area; }, area);
    await expect(page.locator('.sidebar nav button[aria-current="page"]')).toHaveText(new RegExp({ home: "INÍCIO|HOME", pokemon: "POKÉMON", sports: "ESPORTES|SPORTS", books: "LIVROS|BOOKS", collection: "COLEÇÃO|COLLECTION", games: "JOGOS|GAMES", "2doods": "2DOODS", about: "SOBRE|ABOUT", work: "TRABALHO|WORK" }[area]));
  } else await page.goto(`${baseURL}/#${area}`);
  await page.locator(".area-transition > :first-child:not(.loading)").waitFor();
  await settleImages(page);
  await page.evaluate(() => document.fonts.ready);
}
async function seed(context, locale, theme) {
  await context.addInitScript(({ locale, theme }) => {
    localStorage.setItem("reine-started", "yes");
    localStorage.setItem("reine-locale", locale);
    localStorage.setItem("reine-theme", theme);
  }, { locale, theme });
}

try {
  const api = await browser.newContext();
  const probe = await api.newPage();
  await probe.goto(baseURL);
  // Every published URL, MIME, exact bytes AND browser decode, including lazy/NPC states.
  for (const [id, url] of Object.entries(manifest)) {
    const response = await api.request.get(`${baseURL}${url}`);
    expect(response.status(), url).toBe(200);
    const ext = path.extname(url);
    const mime = { ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".mp3": "audio/mpeg" }[ext];
    expect(response.headers()["content-type"], url).toContain(mime);
    const bytes = await response.body();
    expect(sha(bytes), url).toBe(sha(await readFile(path.join(root, "public", url.slice(1)))));
    if (ext !== ".mp3") {
      await probe.evaluate(async (url) => { const image = new Image(); image.src = url; await image.decode(); if (!image.naturalWidth) throw new Error(url); }, url);
    }
    report.assets.push({ id, url, status: response.status(), mime, bytes: bytes.length });
  }
  await api.close();

  for (const [device, viewport] of Object.entries({ desktop: { width: 1440, height: 1000 }, mobile: { width: 390, height: 844 } })) {
    for (const locale of ["pt", "en"]) for (const theme of ["night", "day"]) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      await seed(context, locale, theme);
      const page = await context.newPage();
      page.on("pageerror", (error) => report.errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") report.errors.push(message.text()); });
      page.on("response", (response) => { if (response.status() >= 400) report.errors.push(`${response.status()} ${response.url()}`); });
      page.on("requestfailed", (request) => {
        const detail = `${request.failure()?.errorText} ${request.url()}`;
        // Chromium may cancel a metadata/range audio fetch when navigating or closing.
        // The full audio response is separately validated byte-for-byte above.
        if (request.failure()?.errorText === "net::ERR_ABORTED" && new URL(request.url()).pathname === manifest.music) report.navigationCancellations.push(detail);
        else report.errors.push(detail);
      });
      for (const area of areas) {
        await visit(page, area);
        await expect(page.locator("[data-asset-fallback]")).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${device}/${area}: overflow`).toBe(true);
        expect(await page.locator("html").getAttribute("lang")).toBe(locale === "pt" ? "pt-BR" : "en");
        expect(await page.locator("html").getAttribute("data-theme")).toBe(theme);
        if (area === "sports") {
          await expect(page.locator(".sports-grid img")).toHaveCount(8);
          const boxes = await page.locator(".sport-card").evaluateAll((els) => els.map((el) => ({ x: el.getBoundingClientRect().x, y: el.getBoundingClientRect().y })));
          expect(boxes[0].y === boxes[1].y).toBe(device === "desktop");
          if (locale === "pt") await expect(page.locator(".f1-confession")).toHaveText("e eu infelizmente torço pra Ferrari.");
          for (const card of await page.locator(".sport-card").all()) {
            await card.click();
            await expect(page.locator("dialog")).toBeVisible();
            await settleImages(page);
            await page.locator("#sport-personal-tab").click();
            await expect(page.locator("#sport-panel p").first()).not.toBeEmpty();
            await page.keyboard.press("Escape");
          }
        }
        if (area === "books") {
          await expect(page.locator(".book-cover")).toHaveCount(3);
          const smallCover = await page.locator(".book-2 img").boundingBox();
          expect(smallCover.width).toBeLessThanOrEqual(225);
          expect(smallCover.height).toBeLessThanOrEqual(250);
        }
        if (area === "collection") {
          for (const id of ["consoles", "figures", "books", "manga", "tcg"]) {
            const trigger = page.locator(`#shelf-${id}`);
            await trigger.focus();
            if (await trigger.getAttribute("aria-expanded") !== "true") await page.keyboard.press("Enter");
            await expect(page.locator(`#drawer-${id}`)).toBeVisible();
            await expect(page.locator(".collection-drawer:visible")).toHaveCount(1);
            await expect(page.locator(`#drawer-${id} .drawer-story`)).not.toBeEmpty();
          }
          await expect(page.locator("#drawer-tcg")).toContainText(locale === "pt" ? "os 10 anos" : "age 10");
          expect(await page.locator(".drawer-paper:visible").evaluate((el) => getComputedStyle(el).animationName)).toBe("none");
          await page.locator("#drawer-tcg button").focus();
          await page.keyboard.press("Escape");
          await expect(page.locator("#shelf-tcg")).toBeFocused();
          await expect(page.locator("#shelf-tcg")).toHaveAttribute("aria-expanded", "false");
          await page.keyboard.press("Space");
          await expect(page.locator("#drawer-tcg")).toBeVisible();
        }
        // A representative screenshot for every area in both themes/sizes.
        if (locale === "pt" || area === "collection") {
          await page.evaluate(() => scrollTo(0, 0));
          await page.screenshot({ path: path.join(output, `${device}-${locale}-${theme}-${area}.png`), fullPage: true });
        }
        report.views.push(`${device}/${locale}/${theme}/${area}`);
      }
      await page.locator("footer button").first().click();
      await expect(page.locator(".credits-list")).toBeVisible();
      await settleImages(page);
      await page.screenshot({ path: path.join(output, `${device}-${locale}-${theme}-credits.png`), fullPage: true });
      report.views.push(`${device}/${locale}/${theme}/credits`);
      await context.close();
      console.log(`✓ ${device} / ${locale} / ${theme}: all areas + credits`);
    }
  }

  const responsive = await browser.newContext({ reducedMotion: "reduce" });
  await seed(responsive, "en", "night");
  const narrow = await responsive.newPage();
  for (const width of [320, 760, 820, 900, 1024]) {
    await narrow.setViewportSize({ width, height: 900 });
    await narrow.goto(`${baseURL}/#collection`);
    await narrow.locator(".collection-room").waitFor();
    expect(await narrow.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `collection overflow at ${width}px`).toBe(true);
    expect(await narrow.locator(".shelf-trigger,.shelf-objects").evaluateAll((els) => els.every((el) => el.scrollWidth <= el.clientWidth + 1)), `shelf overflow at ${width}px`).toBe(true);
    report.views.push(`responsive/${width}/collection`);
  }
  // Verify discoverability through all three navigation entry points.
  await narrow.goto(`${baseURL}/#home`);
  await narrow.locator(".route-index button").filter({ hasText: "COLLECTION" }).click();
  await expect(narrow.locator(".collection-room")).toBeVisible();
  await narrow.locator(".map-button").click();
  await narrow.locator(".area-menu button").filter({ hasText: "COLLECTION" }).click();
  await expect(narrow.locator(".collection-room")).toBeVisible();
  await expect(narrow.locator(".sidebar nav button.active")).toContainText("COLLECTION");
  await responsive.close();

  // Intentional failures are isolated from the healthy-production console audit.
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await seed(context, "pt", "night");
  await context.route("**/assets/**", async (route) => {
    if (/\.(png|jpg|svg)$/.test(new URL(route.request().url()).pathname)) await route.fulfill({ status: 404, contentType: "text/plain", body: "Intentional resilience test" });
    else await route.continue();
  });
  const page = await context.newPage();
  for (const area of ["home", "sports", "books", "pokemon", "games", "2doods"]) {
    await visit(page, area);
    expect(await page.locator("[data-asset-fallback]").count()).toBeGreaterThan(0);
    await expect(page.locator("img")).toHaveCount(0);
    if (area === "sports") await expect(page.locator(".sports-grid .team-mark-fallback")).toHaveCount(8);
    if (area === "books") { await expect(page.locator(".book-editorial")).toHaveCount(3); await expect(page.locator(".book-editorial").first()).toContainText("Rick Riordan"); }
    await page.screenshot({ path: path.join(output, `fallback-${area}.png`), fullPage: true });
    report.fallbackTests.push(area);
  }
  await page.locator(".npc-line button").first().click();
  await settleImages(page);
  await expect(page.locator("dialog [data-asset-fallback]")).toHaveCount(1);
  report.fallbackTests.push("dialogue");
  await context.close();
  expect(report.errors, "Production console/network errors").toEqual([]);
  console.log(`PASS: ${report.assets.length} asset URLs, ${report.views.length} views, ${report.fallbackTests.length} intentional-failure scenarios, no production errors.`);
} catch (error) {
  report.errors.push(error.stack || error.message);
  console.error(error);
  process.exitCode = 1;
} finally {
  await writeFile(path.join(output, "production-report.json"), JSON.stringify(report, null, 2));
  await browser.close();
}
