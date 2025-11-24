const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

const gifFiles = [
  'EtherWorld-gif.gif',
  'ESP-gif.gif',
  'Gitcoin-gif.gif',
  'ECH-gif.gif'
];

console.log('🎨 Static Image Generation Guide');
console.log('='.repeat(50));
console.log('\nGIF files found in public directory:');

gifFiles.forEach(file => {
  const filePath = path.join(publicDir, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    const sizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`✓ ${file} (${sizeInMB} MB)`);
    
    // Suggest the output name
    const staticName = file.replace('-gif.gif', '-static.png');
    console.log(`  → Suggested static: ${staticName}`);
  } else {
    console.log(`✗ ${file} - NOT FOUND`);
  }
});

console.log('\n📝 To generate static images, use one of these methods:');
console.log('\n1. ImageMagick (recommended):');
gifFiles.forEach(file => {
  const output = file.replace('-gif.gif', '-static.png');
  console.log(`   convert public/${file}[0] public/${output}`);
});

console.log('\n2. FFmpeg:');
gifFiles.forEach(file => {
  const output = file.replace('-gif.gif', '-static.png');
  console.log(`   ffmpeg -i public/${file} -vframes 1 public/${output}`);
});

console.log('\n3. Online Tool: https://ezgif.com/split (extract first frame)');
console.log('\n' + '='.repeat(50));
