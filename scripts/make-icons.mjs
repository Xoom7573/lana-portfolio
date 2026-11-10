// Draws the browser-tab icons from app/icon.svg. Re-run after changing that file:
//   bun scripts/make-icons.mjs
// Modern browsers use icon.svg directly. favicon.ico is for older browsers; apple-icon.png is
// the iOS home-screen icon, square because iOS rounds the corners itself.
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const src = (...p) => path.join(root, ...p);

const iconSvg = fs.readFileSync(src("app/icon.svg"), "utf8");
const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map((size) => sharp(Buffer.from(iconSvg), { density: 72 * (size / 64) * 4 }).resize(size, size).png().toBuffer()),
);

// An .ico file is a small header and directory followed by the PNG images.
const icoHeader = Buffer.alloc(6 + 16 * icoImages.length);
icoHeader.writeUInt16LE(1, 2);
icoHeader.writeUInt16LE(icoImages.length, 4);
let icoOffset = icoHeader.length;
icoImages.forEach((png, i) => {
  const entry = 6 + 16 * i;
  icoHeader.writeUInt8(icoSizes[i], entry);
  icoHeader.writeUInt8(icoSizes[i], entry + 1);
  icoHeader.writeUInt16LE(1, entry + 4);
  icoHeader.writeUInt16LE(32, entry + 6);
  icoHeader.writeUInt32LE(png.length, entry + 8);
  icoHeader.writeUInt32LE(icoOffset, entry + 12);
  icoOffset += png.length;
});
fs.writeFileSync(src("app/favicon.ico"), Buffer.concat([icoHeader, ...icoImages]));

await sharp(Buffer.from(iconSvg.replace(/rx="\d+"/, 'rx="0"')), { density: 72 * (180 / 64) * 2 })
  .resize(180, 180)
  .png()
  .toFile(src("app/apple-icon.png"));

console.log("Wrote app/favicon.ico and app/apple-icon.png.");
