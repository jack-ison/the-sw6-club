import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const distDir = join(root, "dist");

const requiredFiles = ["index.html", "app.js", "styles.css"];
const optionalFiles = [
  "view-forum.js",
  "view-leagues.js",
  "view-predict.js",
  "view-results.js",
  "login.html",
  "login.js",
  "signup.html",
  "signup.js",
  "profile.html",
  "profile.js",
  "privacy.html",
  "favicon.png"
];
const optionalDirs = ["assets", "images"];
const htmlFiles = [...requiredFiles, ...optionalFiles].filter((file) => file.endsWith(".html"));

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

for (const file of requiredFiles) {
  await cp(join(root, file), join(distDir, file));
}

for (const file of optionalFiles) {
  const src = join(root, file);
  if (existsSync(src)) {
    await cp(src, join(distDir, file));
  }
}

for (const dir of optionalDirs) {
  const srcDir = join(root, dir);
  if (existsSync(srcDir)) {
    await cp(srcDir, join(distDir, dir), { recursive: true });
  }
}

const defaultSupabaseUrl = "https://kderojinorznwtfkizxx.supabase.co";
const defaultSupabaseAnonKey = "sb_publishable_FQAcQUAtj31Ij3s0Zll6VQ_mLcucB69";

const runtimeConfig = {
  supabaseUrl: process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || defaultSupabaseUrl,
  supabaseAnonKey:
    process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || defaultSupabaseAnonKey,
  SW6_FEATURE_CARDS: process.env.SW6_FEATURE_CARDS || process.env.NEXT_PUBLIC_SW6_FEATURE_CARDS || "true",
  features: {
    cards: ["true", "1", "yes", "on"].includes(
      String(process.env.SW6_FEATURE_CARDS || process.env.NEXT_PUBLIC_SW6_FEATURE_CARDS || "true")
        .trim()
        .toLowerCase()
    )
  }
};

const buildMeta = {
  vercelEnv: process.env.VERCEL_ENV || "unknown",
  gitSha: process.env.VERCEL_GIT_COMMIT_SHA || "unknown",
  buildTime: new Date().toISOString()
};

const assetVersion = String(buildMeta.gitSha !== "unknown" ? buildMeta.gitSha : buildMeta.buildTime)
  .replace(/[^a-z0-9]/gi, "")
  .slice(0, 12)
  .toLowerCase();

function applyAssetVersion(htmlSource) {
  return htmlSource.replace(/((?:src|href)=["'])([^"']+\.(?:css|js))(["'])/gi, (full, prefix, url, suffix) => {
    if (/^(https?:)?\/\//i.test(url) || url.includes("?")) {
      return full;
    }
    return `${prefix}${url}?v=${assetVersion}${suffix}`;
  });
}

await writeFile(
  join(distDir, "runtime-config.js"),
  `window.__SW6_CONFIG__ = ${JSON.stringify(runtimeConfig)};\n`,
  "utf8"
);

await writeFile(
  join(distDir, "build-meta.js"),
  `window.__SW6_META__ = ${JSON.stringify(buildMeta)};\n`,
  "utf8"
);

for (const htmlFile of htmlFiles) {
  const distHtmlPath = join(distDir, htmlFile);
  if (!existsSync(distHtmlPath)) {
    continue;
  }
  const htmlSource = await readFile(distHtmlPath, "utf8");
  await writeFile(distHtmlPath, applyAssetVersion(htmlSource), "utf8");
}

console.log("Build complete: dist/");
