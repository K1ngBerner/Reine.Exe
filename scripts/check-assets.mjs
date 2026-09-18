import { readFile, readdir } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { readAsset } from "./asset-integrity.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const manifest = JSON.parse(await readFile(path.join(root, "src/data/assets.json"), "utf8"));
const urls = Object.values(manifest);
const dist = process.argv.includes("--dist");
let failures = 0;
let gitAvailable = false;
try {
  gitAvailable = execFileSync("git", ["rev-parse", "--show-toplevel"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim().replaceAll("\\", "/").toLowerCase() === root.replaceAll("\\", "/").replace(/\/$/, "").toLowerCase();
} catch { /* Deploy archives can omit .git; source integrity is still mandatory. */ }
if (!gitAvailable) console.warn("! Git metadata unavailable; file checks remain active. Verify Git before publishing.");
if (new Set(urls).size !== urls.length) throw new Error("Duplicate URLs in asset manifest");

for (const [id, url] of Object.entries(manifest)) {
  try {
    const bytes = await readAsset(path.join(root, "public"), url);
    if (gitAvailable) {
      const indexed = execFileSync("git", ["show", `:public${url}`], { cwd: root, maxBuffer: 32 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
      if (!bytes.equals(indexed)) throw new Error("working copy differs from Git index; stage the updated asset");
    }
    if (dist) {
      const output = await readAsset(path.join(root, "dist"), url);
      if (!bytes.equals(output)) throw new Error("production bytes differ from public source");
    }
    console.log(`✓ ${id} ${url} (${bytes.length} bytes)`);
  } catch (error) {
    failures++;
    console.error(`✗ ${id}: ${error.message.includes("git show") ? "not present in Git index: git add public" : error.message}`);
  }
}

// Prevent new unregistered visual files and bypasses of the resilient component.
for (const file of await readdir(path.join(root, "public"), { recursive: true })) {
  if (/\.(svg|png|jpe?g|webp|gif|avif|mp3)$/i.test(file) && !urls.includes(`/${file.replaceAll("\\", "/")}`)) {
    failures++;
    console.error(`✗ Unregistered public asset: ${file}`);
  }
}
for (const file of await readdir(path.join(root, "src"), { recursive: true })) {
  if (!/\.(ts|tsx|css)$/.test(file)) continue;
  const source = await readFile(path.join(root, "src", file), "utf8");
  if ((/<img\b/.test(source) && path.basename(file) !== "SafeImage.tsx") || /["'`]\/?(?:public\/)?(?:assets|audio)\//.test(source)) {
    failures++;
    console.error(`✗ ${file}: use assets.json and SafeImage, not raw image paths/elements`);
  }
}
console.log(`${failures ? "FAILED" : "PASS"}: ${urls.length} assets; exact case, signatures${gitAvailable ? ", Git index" : ""}${dist ? ", production copies" : ""}.`);
if (failures) process.exitCode = 1;
