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
    .filter(file => file.toLowerCase().endsWith('.jpg'));

  const photosWithDates = photoFiles.map(file => {
    const filePath = path.join(photosDir, file);
    const stats = fs.statSync(filePath);

    return {
      file,
      date: stats.mtimeMs  // file modified time
    };
  });

  // Newest first
  photosWithDates.sort((a, b) => b.date - a.date);

  const sortedFiles = photosWithDates.map(p => p.file);

  fs.writeFileSync(outputFile, JSON.stringify(sortedFiles, null, 2));
  console.log('photos.json updated (sorted by file modified date)');
}



processImages();
