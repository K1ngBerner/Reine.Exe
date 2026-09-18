
import {
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Edit this list when a team asset needs to be replaced. Runtime code never
// reads source; it only reads the files written to public/assets/sports/teams.
const teams = [
  {
    id: "flamengo",
    name: "Flamengo",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/9/96/Clube_de_Regatas_do_Flamengo_logo.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Clube_de_Regatas_do_Flamengo_logo.svg",
    output: "flamengo.svg",
  },
  {
    id: "bayern-munich",
    name: "Bayern München",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg",
    output: "bayern-munich.svg",
  },
  {
    id: "chicago-bulls",
    name: "Chicago Bulls",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/6/67/Chicago_Bulls_logo.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Chicago_Bulls_logo.svg",
    output: "chicago-bulls.svg",
  },
  {
    id: "chicago-cubs",
    name: "Chicago Cubs",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/8/80/Chicago_Cubs_logo.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Chicago_Cubs_logo.svg",
    output: "chicago-cubs.svg",
  },
  {
    id: "los-angeles-dodgers",
    name: "Los Angeles Dodgers",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/0/0e/Los_Angeles_Dodgers_Logo.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Los_Angeles_Dodgers_Logo.svg",
    output: "los-angeles-dodgers.svg",
  },
  {
    id: "doosan-bears",
    name: "Doosan Bears",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/a/a2/Doosan_Bears_insignia.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Doosan_Bears_insignia.svg",
    output: "doosan-bears.svg",
  },
  {
    id: "yomiuri-giants",
    name: "Yomiuri Giants",
    source:
      "https://upload.wikimedia.org/wikipedia/commons/f/f5/Yomiuri_Giants_logo.svg",
    sourcePage:
      "https://commons.wikimedia.org/wiki/File:Yomiuri_Giants_logo.svg",
    output: "yomiuri-giants.svg",
  },
  {
    id: "ferrari",
    name: "Scuderia Ferrari",
    source:
      "https://media.formula1.com/image/upload/v1740000001/common/f1/2025/ferrari/2025ferrarilogolight.svg",
    sourcePage:
      "https://www.formula1.com/en/teams/ferrari",
    output: "ferrari.svg",
  },
];

const outputDirectory = fileURLToPath(new URL("../public/assets/sports/teams/", import.meta.url));
const forceDownload = process.argv.includes("--force");
const only = process.argv.find((arg) => arg.startsWith("--only="))?.slice(7);
const requestHeaders = {
  Accept: "image/svg+xml,image/png;q=0.9,*/*;q=0.1",
  "User-Agent": "reine-exe-sports-assets/1.0 (local maintenance script)",
};
const mimeByExtension = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
const retryDelays = [0, 1500, 4000];

function normalizeOutputName(output) {
  const extension = path.extname(output).toLowerCase();
  const stem = path
    .basename(output, path.extname(output))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${stem}${extension}`;
}

function validateTeamList() {
  const ids = new Set();
  const outputs = new Set();

  for (const team of teams) {
    const output = normalizeOutputName(team.output);
    const extension = path.extname(output);
    if (output !== team.output || !mimeByExtension[extension]) {
      throw new Error(
        `${team.id}: output must be lowercase kebab-case with .svg or .png: ${team.output}`,
      );
    }
    if (ids.has(team.id) || outputs.has(output)) {
      throw new Error(`${team.id}: duplicate id or output`);
    }
    ids.add(team.id);
    outputs.add(output);
    new URL(team.source);
  }
}

function hasSvgRoot(bytes) {
  const sample = String.fromCharCode(...bytes.slice(0, 1024));
  return /<svg(?:\s|>)/i.test(sample);
}

function hasPngSignature(bytes) {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

function validateBytes(bytes, extension, contentType) {
  const expectedMime = mimeByExtension[extension];
  if (!contentType.startsWith(expectedMime)) {
    throw new Error(`content-type ${contentType || "missing"} does not match ${extension}`);
  }
  if (bytes.length === 0) {
    throw new Error("downloaded file is empty");
  }
  if (extension === ".svg" && !hasSvgRoot(bytes)) {
    throw new Error("downloaded SVG has no <svg> root");
  }
  if (extension === ".png" && !hasPngSignature(bytes)) {
    throw new Error("downloaded PNG has an invalid signature");
  }
}

async function existingAssetIsValid(outputPath, extension) {
  try {
    const file = await readFile(outputPath);
    if (file.length === 0) return false;
    if (extension === ".svg") return hasSvgRoot(file);
    if (extension === ".png") return hasPngSignature(file);
    return false;
  } catch {
    return false;
  }
}

async function fetchAsset(team) {
  let lastError;
  for (const delay of retryDelays) {
    if (delay > 0) await new Promise((resolve) => setTimeout(resolve, delay));
    try {
      const response = await fetch(team.source, {
        signal: AbortSignal.timeout(20000),
        headers: requestHeaders,
        redirect: "follow",
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const contentType = (response.headers.get("content-type") || "")
        .split(";", 1)[0]
        .trim()
        .toLowerCase();
      const bytes = new Uint8Array(await response.arrayBuffer());
      validateBytes(bytes, path.extname(team.output), contentType);
      return { bytes, contentType, status: response.status };
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

async function writeAsset(team, bytes) {
  const outputPath = path.join(outputDirectory, team.output);
  const temporaryPath = `${outputPath}.tmp-${process.pid}`;
  await writeFile(temporaryPath, bytes);
  try {
    await rename(temporaryPath, outputPath);
  } catch (error) {
    await rm(temporaryPath, { force: true });
    throw error;
  }
}

async function main() {
  validateTeamList();
  if (only && !teams.some((team) => team.id === only)) throw new Error(`Unknown team: ${only}`);
  await mkdir(outputDirectory, { recursive: true });

  let failures = 0;
  for (const team of teams) {
    if (only && team.id !== only) continue;
    const outputPath = path.join(outputDirectory, team.output);
    const extension = path.extname(team.output);
    if (!forceDownload && (await existingAssetIsValid(outputPath, extension))) {
      const size = (await stat(outputPath)).size;
      console.log(`✓ ${team.name} — local (${size} bytes)`);
      continue;
    }

    try {
      const { bytes, contentType, status } = await fetchAsset(team);
      await writeAsset(team, bytes);
      console.log(`✓ ${team.name} — HTTP ${status}, ${contentType}, ${bytes.length} bytes`);
    } catch (error) {
      failures += 1;
      console.error(`✗ ${team.name} — ${error.message}`);
    }
  }

  if (failures > 0) {
    process.exitCode = 1;
  }
}

await main();
