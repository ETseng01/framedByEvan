const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const ExifParser = require('exif-parser');

const rawDir = path.join(__dirname, 'raw');
const photosDir = path.join(__dirname, 'photos');
const outputFile = path.join(__dirname, 'photos.json');

// Ensure photos folder exists
if (!fs.existsSync(photosDir)) {
  fs.mkdirSync(photosDir);
}

// Resize RAW images into /photos
const rawFiles = fs.readdirSync(rawDir)
  .filter(file => /\.(jpg|jpeg|png)$/i.test(file));

async function processImages() {
  for (const file of rawFiles) {
    const inputPath = path.join(rawDir, file);
    const outputPath = path.join(photosDir, file);

    // Skip if already exists
    if (fs.existsSync(outputPath)) continue;

    await sharp(inputPath)
      .rotate() // <-- THIS FIXES ORIENTATION
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

  const photosWithTime = photoFiles.map(file => {
    const stats = fs.statSync(path.join(photosDir, file));
    return {
      file,
      time: stats.mtimeMs
    };
  });

  // Newest first
  photosWithTime.sort((a, b) => b.time - a.time);

  const sortedFiles = photosWithTime.map(p => p.file);

  fs.writeFileSync(outputFile, JSON.stringify(sortedFiles, null, 2));
  console.log('photos.json updated (newest first)');
}


processImages();
