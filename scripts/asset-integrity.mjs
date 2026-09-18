import { readFile, readdir, lstat } from "node:fs/promises";
import path from "node:path";

export function validateSignature(bytes, extension) {
  if (!bytes.length) throw new Error("empty file");
  const matches = {
    ".png": () => bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a",
    ".jpg": () => bytes.subarray(0, 3).toString("hex") === "ffd8ff",
    ".webp": () => bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP",
    ".svg": () => /<svg(?:\s|>)/i.test(bytes.toString("utf8", 0, 2048)) && /<\/svg>\s*$/i.test(bytes.toString("utf8").trim()),
    ".mp3": () => bytes.toString("ascii", 0, 3) === "ID3" || (bytes[0] === 255 && (bytes[1] & 224) === 224),
  };
  if (!matches[extension]?.()) throw new Error(`signature does not match ${extension}`);
  if (extension === ".svg" && /<(?:script|foreignObject)\b|<(?:image|use)\b[^>]*(?:href|xlink:href)=["'](?:https?:|\/\/)/i.test(bytes.toString())) {
    throw new Error("SVG contains active content or an external image dependency");
  }
}

/** Walk actual directory names so case mistakes also fail on Windows. */
export async function readAsset(root, url) {
  if (!/^\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(svg|png|jpg|webp|mp3)$/.test(url)) {
    throw new Error(`not a normalized, root-local URL: ${url}`);
  }
  let current = root;
  for (const segment of url.slice(1).split("/")) {
    const names = await readdir(current);
    if (!names.includes(segment)) throw new Error(`missing or wrong case: ${url} (${segment})`);
    current = path.join(current, segment);
    if ((await lstat(current)).isSymbolicLink()) throw new Error(`symlink not allowed: ${url}`);
  }
  const bytes = await readFile(current);
  validateSignature(bytes, path.extname(url));
  return bytes;
}
