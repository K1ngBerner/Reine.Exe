import test from "node:test";
import assert from "node:assert/strict";
import { Buffer } from "node:buffer";
import { fileURLToPath } from "node:url";
import { readAsset, validateSignature } from "./asset-integrity.mjs";

const publicRoot = fileURLToPath(new URL("../public/", import.meta.url));
test("rejects empty files, HTML masquerading as SVG, wrong extensions and external dependencies", () => {
  assert.throws(() => validateSignature(Buffer.alloc(0), ".png"), /empty/);
  assert.throws(() => validateSignature(Buffer.from("<html>404</html>"), ".svg"), /signature/);
  assert.throws(() => validateSignature(Buffer.from("<svg></svg>"), ".png"), /signature/);
  assert.throws(() => validateSignature(Buffer.from('<svg><image href="https://example.com/logo.png" /></svg>'), ".svg"), /external/);
  assert.throws(() => validateSignature(Buffer.from("<svg><script>alert(1)</script></svg>"), ".svg"), /active/);
});
test("rejects unsafe URLs and case mismatches even on Windows", async () => {
  for (const url of ["assets/ui/idle.png", "/public/assets/ui/idle.png", "https://example.com/a.png", "C:/a.png", "/../a.png", "/assets/UI/idle.png", "/assets/ui/Idle.png", "/assets/ui/missing.png"]) {
    await assert.rejects(readAsset(publicRoot, url));
  }
  assert.ok((await readAsset(publicRoot, "/assets/ui/idle.png")).length > 0);
});
