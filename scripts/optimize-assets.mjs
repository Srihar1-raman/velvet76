#!/usr/bin/env node
/**
 * Velvet Asset Optimizer
 * Converts JPG/PNG images to WebP using sharp.
 * Run: bun scripts/optimize-assets.mjs
 */
import { readdir, stat } from "fs/promises";
import { join, extname, basename } from "path";
import sharp from "sharp";

const ASSETS_DIR = "./public/assets";
const QUALITY = 85;

async function optimizeImage(inputPath, outputPath) {
  const s = await stat(inputPath);
  await sharp(inputPath).webp({ quality: QUALITY }).toFile(outputPath);
  const sOut = await stat(outputPath);
  const saving = Math.round((1 - sOut.size / s.size) * 100);
  console.log(`  ${basename(inputPath)} → WebP (${saving}% smaller)`);
}

async function run() {
  const files = await readdir(ASSETS_DIR);
  const images = files.filter((f) =>
    [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase())
  );

  console.log(`Optimizing ${images.length} images...`);
  let ok = 0;
  for (const file of images) {
    const inputPath = join(ASSETS_DIR, file);
    const outputPath = join(ASSETS_DIR, basename(file, extname(file)) + ".webp");
    try {
      await optimizeImage(inputPath, outputPath);
      ok++;
    } catch (e) {
      console.warn(`  SKIP ${file}: ${e.message}`);
    }
  }
  console.log(`Done. ${ok}/${images.length} optimized.`);
}

run().catch(console.error);
