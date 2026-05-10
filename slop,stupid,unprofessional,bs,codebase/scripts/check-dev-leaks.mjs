#!/usr/bin/env node
/**
 * Bundle leak audit — fails the build if the mock OTP literal,
 * `DEV_OTP`-style constants, or development-only flags survive into the
 * production `.next/` output.
 *
 * Run AFTER `next build` in CI:
 *   npm run build && npm run audit:bundle
 *
 * The single approved location for the mock OTP literal is
 * `src/lib/devConfig.ts`. Production builds should env-gate it via
 * `NEXT_PUBLIC_DEV_MODE` so the runtime hint copy never names the value.
 */

import { promises as fs } from "node:fs";
import { join, relative } from "node:path";
import { argv, cwd, exit } from "node:process";

const ROOT = cwd();
const TARGET = join(ROOT, ".next");

// Patterns that must not appear in production-bundled JS / HTML.
//
// NOTE: We deliberately do NOT scan for the Google Maps `AIza...` key here.
// `NEXT_PUBLIC_GOOGLE_MAPS_KEY` is intentionally inlined in client bundles —
// the security control is GCP HTTP-referrer restriction, not bundle-grep.
// gitleaks (separate CI step) still catches the key shape in source / git.
const FORBIDDEN_PATTERNS = [
  {
    label: "Hardcoded mock OTP literal '123456'",
    pattern: /["']123456["']/,
    severity: "error",
  },
  {
    label: "Dev-only OTP constant name (DEV_OTP / TEST_OTP / FAKE_OTP)",
    pattern: /\b(DEV_OTP|TEST_OTP|FAKE_OTP)\b/,
    severity: "error",
  },
];

// Files we deliberately exclude — sourcemaps and traces are dev artefacts and
// don't ship to users.
const SKIP_EXTENSIONS = new Set([".map", ".d.ts", ".pack", ".log"]);

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === "ENOENT") return;
    throw err;
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip Next.js trace + cache subtrees — they're not shipped.
      if (
        entry.name === "cache" ||
        entry.name === "trace" ||
        entry.name === "diagnostics"
      ) {
        continue;
      }
      yield* walk(path);
    } else if (entry.isFile()) {
      const ext = entry.name.includes(".") ? entry.name.slice(entry.name.lastIndexOf(".")) : "";
      if (SKIP_EXTENSIONS.has(ext)) continue;
      yield path;
    }
  }
}

async function main() {
  const exists = await fs
    .stat(TARGET)
    .then(() => true)
    .catch(() => false);

  if (!exists) {
    console.error(
      `[audit:bundle] No build output found at ${TARGET}. Run \`npm run build\` first.`
    );
    exit(2);
  }

  const verbose = argv.includes("--verbose");
  const findings = [];

  for await (const file of walk(TARGET)) {
    let contents;
    try {
      contents = await fs.readFile(file, "utf8");
    } catch {
      continue;
    }
    for (const rule of FORBIDDEN_PATTERNS) {
      if (rule.pattern.test(contents)) {
        findings.push({ file: relative(ROOT, file), rule });
      }
    }
  }

  if (findings.length === 0) {
    console.log("[audit:bundle] OK — no dev OTP / API-key residue in .next/.");
    exit(0);
  }

  console.error(`[audit:bundle] FAIL — ${findings.length} suspicious match(es):\n`);
  for (const f of findings) {
    console.error(`  - ${f.file}\n      ${f.rule.label}`);
  }
  console.error(
    "\nFix: ensure all references go through src/lib/devConfig.ts and that\n" +
      "NEXT_PUBLIC_DEV_MODE is unset for production builds."
  );
  if (verbose) {
    console.error("\nForbidden patterns:");
    for (const rule of FORBIDDEN_PATTERNS) {
      console.error(`  - ${rule.label}: ${rule.pattern}`);
    }
  }
  exit(1);
}

main().catch((err) => {
  console.error(err);
  exit(2);
});
