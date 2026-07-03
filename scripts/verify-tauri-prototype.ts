import fs from "node:fs";
import path from "node:path";

type PackageShape = {
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
};

type TauriConfigShape = {
  productName?: string;
  identifier?: string;
  build?: {
    devUrl?: string;
    beforeDevCommand?: string;
    beforeBuildCommand?: string;
    frontendDist?: string;
  };
  bundle?: Record<string, unknown>;
  plugins?: Record<string, unknown>;
};

type CapabilityShape = {
  description?: string;
  permissions?: unknown[];
};

type CheckResult = {
  name: string;
  passed: boolean;
  detail: string;
};

const projectRoot = process.cwd();

const requiredFiles = [
  "src-tauri/tauri.conf.json",
  "src-tauri/Cargo.toml",
  "src-tauri/src/main.rs",
];

const optionalFiles = [
  "src-tauri/capabilities/default.json",
  "docs/phase-7d-tauri-packaging-prototype-scope-lock.md",
];

const implementationScanRoots = [
  "app",
  "components",
  "lib",
  "scripts",
  "src-tauri",
];

const prototypeReadFiles = [
  "src-tauri/tauri.conf.json",
  "src-tauri/Cargo.toml",
  "src-tauri/src/main.rs",
  "src-tauri/capabilities/default.json",
  "scripts/local-launcher.ts",
  "scripts/verify-local-launcher.ts",
  "lib/local-launcher/local-launcher-config.ts",
  "lib/local-launcher/local-launcher-status.ts",
  "lib/local-launcher/local-launcher-types.ts",
];

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function readText(relativePath: string): string {
  return fs.readFileSync(path.join(projectRoot, relativePath), "utf8");
}

function readJson<T>(relativePath: string): T {
  return JSON.parse(readText(relativePath)) as T;
}

function fileExists(relativePath: string): boolean {
  return fs.existsSync(path.join(projectRoot, relativePath));
}

function walkTextFiles(relativeRoot: string): string[] {
  const absoluteRoot = path.join(projectRoot, relativeRoot);
  if (!fs.existsSync(absoluteRoot)) {
    return [];
  }

  const results: string[] = [];
  const entries = fs.readdirSync(absoluteRoot, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = path.join(absoluteRoot, entry.name);
    const relativePath = path.relative(projectRoot, absolutePath);

    if (entry.isDirectory()) {
      if ([".next", "node_modules", "target", "dist", "out"].includes(entry.name)) {
        continue;
      }
      results.push(...walkTextFiles(relativePath));
      continue;
    }

    if (entry.isFile() && /\.(cjs|css|json|md|mjs|rs|toml|ts|tsx)$/.test(entry.name)) {
      results.push(relativePath);
    }
  }

  return results;
}

function dependencyNames(packageJson: PackageShape): string[] {
  return [
    ...Object.keys(packageJson.dependencies ?? {}),
    ...Object.keys(packageJson.devDependencies ?? {}),
    ...Object.keys(packageJson.optionalDependencies ?? {}),
  ];
}

function scriptEntries(packageJson: PackageShape): Array<[string, string]> {
  return Object.entries(packageJson.scripts ?? {});
}

function isLocalUrl(value: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  return url.protocol === "http:" && ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
}

function findMatches(files: string[], pattern: RegExp): string[] {
  const matches: string[] = [];

  for (const file of files) {
    if (!fileExists(file)) {
      continue;
    }

    const text = readText(file);
    if (pattern.test(text)) {
      matches.push(file);
    }
  }

  return matches;
}

function findUnsafeTerminalSurfaceMatches(files: string[]): string[] {
  const matches: string[] = [];
  const unsafePattern = /terminal emulator|command text box|free-form shell|arbitrary command input|generic shell runner/i;
  const boundaryPattern = /\b(no|not|without|must not|does not|is not|disabled|forbidden|blocked|reject|rejects|absent)\b/i;

  for (const file of files) {
    if (!fileExists(file) || /verify-|docs?\/|scope-lock|closeout|plan|PRD/i.test(file)) {
      continue;
    }

    const unsafeLines = readText(file)
      .split(/\r?\n/)
      .filter((line) => unsafePattern.test(line) && !boundaryPattern.test(line));

    if (unsafeLines.length > 0) {
      matches.push(file);
    }
  }

  return matches;
}

function findSensitiveReadMatches(files: string[], sensitivePattern: RegExp): string[] {
  const matches: string[] = [];
  const fileReadPattern = /readFile(?:Sync)?|createReadStream|openSync|fs\.promises\.readFile/i;

  for (const file of files) {
    if (!fileExists(file)) {
      continue;
    }

    const lines = readText(file).split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const nearbyText = lines.slice(index, Math.min(index + 4, lines.length)).join(" ");

      if (fileReadPattern.test(nearbyText) && sensitivePattern.test(nearbyText)) {
        matches.push(`${file}:${index + 1}`);
        break;
      }
    }
  }

  return matches;
}

function hasPrototypeMarker(files: string[], tauriConfig: TauriConfigShape): boolean {
  const metadata = [
    tauriConfig.productName,
    tauriConfig.identifier,
  ].filter(Boolean).join("\n");

  if (/prototype/i.test(metadata)) {
    return true;
  }

  return files.some((file) => fileExists(file) && /prototype-only|prototype packaging|Tauri Packaging Prototype/i.test(readText(file)));
}

function pushCheck(checks: CheckResult[], name: string, passed: boolean, detail: string): void {
  checks.push({ name, passed, detail });
}

async function main(): Promise<void> {
  const checks: CheckResult[] = [];
  const packageJson = readJson<PackageShape>("package.json");
  const tauriConfig = readJson<TauriConfigShape>("src-tauri/tauri.conf.json");
  const cargoToml = readText("src-tauri/Cargo.toml");
  const mainRs = readText("src-tauri/src/main.rs");
  const capabilityPath = "src-tauri/capabilities/default.json";
  const capability = fileExists(capabilityPath) ? readJson<CapabilityShape>(capabilityPath) : undefined;
  const deps = dependencyNames(packageJson);
  const scripts = scriptEntries(packageJson);
  const allImplementationFiles = implementationScanRoots.flatMap(walkTextFiles);

  for (const requiredFile of requiredFiles) {
    pushCheck(checks, `required file: ${requiredFile}`, fileExists(requiredFile), "Tauri prototype config file exists");
  }

  pushCheck(
    checks,
    "optional capability file",
    !fileExists(capabilityPath) || Boolean(capability),
    fileExists(capabilityPath) ? "default capability file is present and parseable" : "default capability file is absent",
  );

  pushCheck(
    checks,
    "prototype-only marker",
    hasPrototypeMarker([...requiredFiles, ...optionalFiles], tauriConfig),
    "prototype-only boundary is declared in config metadata or scope docs",
  );

  pushCheck(
    checks,
    "local Tauri dev URL",
    typeof tauriConfig.build?.devUrl === "string" && isLocalUrl(tauriConfig.build.devUrl),
    `devUrl=${tauriConfig.build?.devUrl ?? "missing"}`,
  );

  pushCheck(
    checks,
    "empty Tauri pre-build commands",
    (tauriConfig.build?.beforeDevCommand ?? "") === "" && (tauriConfig.build?.beforeBuildCommand ?? "") === "",
    "beforeDevCommand and beforeBuildCommand are empty",
  );

  pushCheck(
    checks,
    "no Electron dependency",
    deps.every((name) => !/electron/i.test(name)),
    "package dependencies do not include Electron",
  );

  pushCheck(
    checks,
    "no auto updater dependency or config",
    deps.every((name) => !/updater|auto-update|autoupdate/i.test(name)) &&
      !/updater|auto[-_ ]?update/i.test(JSON.stringify(tauriConfig)) &&
      !/tauri-plugin-updater|updater/i.test(cargoToml),
    "no updater dependency, plugin, or config detected",
  );

  pushCheck(
    checks,
    "no production installer script",
    scripts.every(([name, command]) => !/(^|:)install(er)?($|:)|package|bundle|dist|release|make|publish/i.test(name) && !/tauri\s+build|electron-builder|electron-forge|notarytool|notar/i.test(command)),
    "package scripts do not define installer/package/release commands",
  );

  pushCheck(
    checks,
    "no signing or notarization config",
    !/signing|notar|certificate|identity|entitlements|provisioning|notarytool|developerId/i.test(JSON.stringify(tauriConfig)) &&
      !/signing|notar|certificate|identity|entitlements|provisioning|notarytool|developerId/i.test(cargoToml),
    "Tauri and Cargo config do not include signing/notarization settings",
  );

  const capabilityPermissions = capability?.permissions ?? [];
  pushCheck(
    checks,
    "no broad filesystem capability",
    capabilityPermissions.every((permission) => !/fs|filesystem|path|scope/i.test(String(permission))),
    `permissions=${JSON.stringify(capabilityPermissions)}`,
  );

  pushCheck(
    checks,
    "no shell plugin or arbitrary shell",
    deps.every((name) => !/tauri-plugin-shell|node-pty/i.test(name)) &&
      !/tauri-plugin-shell|shell:\s*true|Command::new|std::process|process\.Command|open\(|exec\(|spawn\(/i.test(cargoToml + "\n" + mainRs + "\n" + JSON.stringify(capabilityPermissions)),
    "Tauri prototype has no shell plugin, shell:true, process command, or arbitrary shell hooks",
  );

  pushCheck(
    checks,
    "no node-pty",
    deps.every((name) => !/node-pty/i.test(name)) && !/node-pty/i.test(cargoToml + "\n" + mainRs),
    "node-pty is absent from dependencies and Tauri files",
  );

  const terminalSurfaceMatches = findUnsafeTerminalSurfaceMatches(allImplementationFiles);
  pushCheck(
    checks,
    "no terminal emulator or command text box implementation",
    terminalSurfaceMatches.length === 0,
    terminalSurfaceMatches.length === 0 ? "no unsafe terminal emulator/command text box implementation references found" : terminalSurfaceMatches.join(", "),
  );

  pushCheck(
    checks,
    "no daemon cron or startup service script",
    scripts.every(([name, command]) => !/daemon|cron|launchd|launchctl|LaunchAgent|startup|service/i.test(`${name} ${command}`)) &&
      findMatches(["src-tauri/tauri.conf.json", "src-tauri/Cargo.toml", "src-tauri/src/main.rs"], /daemon|cron|launchd|launchctl|LaunchAgent|startup service/i).length === 0,
    "no daemon, cron, LaunchAgent, startup service, or background service config detected",
  );

  pushCheck(
    checks,
    "no cloud sync dependency or script",
    deps.every((name) => !/aws|azure|gcp|firebase|supabase|s3|sync/i.test(name)) &&
      scripts.every(([name, command]) => !/cloud|sync|firebase|supabase|s3|upload/i.test(`${name} ${command}`)),
    "no cloud sync dependency or package script detected",
  );

  pushCheck(
    checks,
    "no GitHub Vercel Supabase integration dependency or script",
    deps.every((name) => !/github|octokit|vercel|supabase/i.test(name)) &&
      scripts.every(([name, command]) => !/github|octokit|vercel|supabase/i.test(`${name} ${command}`)),
    "no GitHub, Vercel, or Supabase integration dependency/script detected",
  );

  pushCheck(
    checks,
    "no auth payment MCP OpenAI dependency or script",
    deps.every((name) => !/auth|clerk|next-auth|stripe|payment|billing|mcp|openai/i.test(name)) &&
      scripts.every(([name, command]) => !/auth|clerk|next-auth|stripe|payment|billing|mcp|openai/i.test(`${name} ${command}`)),
    "no auth, payment, MCP, or OpenAI dependency/script detected",
  );

  const authReadMatches = findSensitiveReadMatches(
    allImplementationFiles,
    /~\/\.codex\/auth\.json|\.codex\/auth\.json|\.codex|auth\.json|["']auth["']\s*,\s*["']json["']/i,
  );
  pushCheck(
    checks,
    "no codex auth file read",
    authReadMatches.length === 0,
    authReadMatches.length === 0 ? "no ~/.codex/auth.json read detected" : authReadMatches.join(", "),
  );

  const envReadMatches = findSensitiveReadMatches(
    prototypeReadFiles,
    /\.env(?:\.local)?|["']\.env["']|["']\.env\.local["']|dotenv/i,
  );
  pushCheck(
    checks,
    "no env file read in Tauri launcher prototype files",
    envReadMatches.length === 0,
    envReadMatches.length === 0 ? "no .env/.env.local file read detected in prototype files" : envReadMatches.join(", "),
  );

  const packageScripts = packageJson.scripts ?? {};
  pushCheck(
    checks,
    "browser-only launcher scripts remain",
    packageScripts["local:launcher"] === "tsx scripts/local-launcher.ts" &&
      packageScripts["local:launcher:open"] === "tsx scripts/local-launcher.ts --open" &&
      packageScripts["local:launcher:verify"] === "tsx scripts/verify-local-launcher.ts",
    "local:launcher, local:launcher:open, and local:launcher:verify are present",
  );

  assert(checks.every((check) => check.passed), checks.filter((check) => !check.passed).map((check) => `${check.name}: ${check.detail}`).join("\n"));

  console.log("Tauri prototype safety verification passed");
  console.log(JSON.stringify({
    checkedFiles: [...requiredFiles, ...optionalFiles.filter(fileExists)],
    tauriDevUrl: tauriConfig.build?.devUrl,
    capabilityPermissions,
    launcherFallbackScripts: {
      "local:launcher": packageScripts["local:launcher"],
      "local:launcher:open": packageScripts["local:launcher:open"],
      "local:launcher:verify": packageScripts["local:launcher:verify"],
    },
    prohibitedExecutionAttempted: false,
    checks,
  }, null, 2));
}

main().catch((error: unknown) => {
  console.error("Tauri prototype safety verification failed");
  console.error(error);
  process.exit(1);
});
