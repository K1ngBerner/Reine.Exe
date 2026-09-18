import { readFile, writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const target = process.argv[2];
if (!target) throw new Error("Usage: npm run assets:audit-deploy -- https://your-site.netlify.app");
const base = new URL(target);
if (!/^https?:$/.test(base.protocol)) throw new Error("HTTP(S) URL required");
const manifest = JSON.parse(await readFile(path.join(root, "src/data/assets.json"), "utf8"));
const report = { checkedAt: new Date().toISOString(), origin: base.origin, assets: [] };
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const [id, asset] of Object.entries(manifest)) {
  try {
    const url = new URL(asset, base.origin);
    const response = await fetch(url, { signal: AbortSignal.timeout(20000), cache: "no-store" });
    const bytes = Buffer.from(await response.arrayBuffer());
    const local = await readFile(path.join(root, "public", asset.slice(1)));
    const result = { id, path: asset, status: response.status, contentType: response.headers.get("content-type"), bytes: bytes.length, matchesLocal: bytes.equals(local), sha256: hash(bytes), localSha256: hash(local) };
    report.assets.push(result);
    console.log(`${response.ok && result.matchesLocal ? "✓" : "✗"} ${asset}: HTTP ${result.status}, ${result.contentType}, ${result.matchesLocal ? "identical" : "missing/different"}`);
  } catch (error) {
    report.assets.push({ id, path: asset, error: error.message });
    console.error(`✗ ${asset}: ${error.message}`);
  }
}
await mkdir(path.join(root, "qa-results"), { recursive: true });
await writeFile(path.join(root, "qa-results/deployed-assets.json"), JSON.stringify(report, null, 2));
if (report.assets.some((asset) => asset.status !== 200 || !asset.matchesLocal)) process.exitCode = 1;
