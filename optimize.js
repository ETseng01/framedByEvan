const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "raw";
const outputDir = "photos";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.readdirSync(inputDir).forEach(file => {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  sharp(inputPath)
    .resize({ width: 2000 }) // Max width
    .jpeg({ quality: 80 })   // Compression quality
    .toFile(outputPath)
    .then(() => console.log(`Optimized: ${file}`))
    .catch(err => console.error(err));
});
