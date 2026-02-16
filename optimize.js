const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rawDir = path.join(__dirname, 'raw');
const photosDir = path.join(__dirname, 'photos');
const outputFile = path.join(__dirname, 'photos.json');

// Ensure photos folder exists
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Only allow jpg/jpeg
const rawFiles = fs.readdirSync(rawDir)
  .filter(file => /\.(jpe?g)$/i.test(file));

async function processImages() {
  for (const file of rawFiles) {
    const inputPath = path.join(rawDir, file);
    const outputPath = path.join(photosDir, file);

    if (fs.existsSync(outputPath)) continue;

    await sharp(inputPath)
      .rotate()
      .resize({ width: 1800 })
      .jpeg({ quality: 80 })
      .toFile(outputPath);

    console.log(`Optimized: ${file}`);
  }

  generateJSON();
}

function generateJSON() {
  const photoFiles = fs.readdirSync(photosDir)
    .filter(file => /\.(jpe?g)$/i.test(file));

  // SORT BY FILENAME DESCENDING (NEWEST FIRST)
  photoFiles.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

  fs.writeFileSync(outputFile, JSON.stringify(photoFiles, null, 2));
  console.log('photos.json updated (sorted by filename)');
}

processImages();
