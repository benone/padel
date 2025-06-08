const https = require('https');
const fs = require('fs');
const path = require('path');

const imageUrl = 'https://im.runware.ai/image/ws/2/ii/187eca3a-3c11-4cf0-80af-a9cc3567863d.jpg';
const outputPath = path.join(__dirname, 'test-image.jpg');

console.log('Testing download...');
console.log('URL:', imageUrl);
console.log('Output:', outputPath);

const file = fs.createWriteStream(outputPath);

const request = https.get(imageUrl, (response) => {
  console.log('Status:', response.statusCode);
  console.log('Headers:', response.headers);
  
  let downloadedBytes = 0;
  
  response.on('data', (chunk) => {
    downloadedBytes += chunk.length;
    console.log('Downloaded so far:', downloadedBytes, 'bytes');
  });
  
  response.pipe(file);
  
  file.on('finish', () => {
    file.close((err) => {
      if (err) {
        console.error('File close error:', err);
        return;
      }
      
      const finalSize = fs.statSync(outputPath).size;
      console.log('Download complete! File size:', finalSize, 'bytes');
    });
  });
  
  file.on('error', (err) => {
    console.error('File write error:', err);
  });
});

request.on('error', (err) => {
  console.error('Request error:', err);
});

request.setTimeout(30000, () => {
  console.error('Download timeout');
  request.destroy();
});