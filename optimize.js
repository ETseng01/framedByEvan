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
  .rotate() // auto-rotate based on EXIF
  .resize({ width: 2000 })
  .jpeg({ quality: 80 })
  .toFile(outputPath)
  .then(() => console.log(`Optimized: ${file}`))
  .catch(err => console.error(err));

});
