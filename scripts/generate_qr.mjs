import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Target verified direct APK download URL for QR code encoding
const apkDownloadUrl = 'https://ais-pre-cdzx7rbbzk2a2zunjzkc45-777447338205.asia-northeast1.run.app/download/RupeeTracker.apk';
const outputPath = path.join(publicDir, 'RupeeTracker_QR.png');

async function generateQR() {
  try {
    await QRCode.toFile(outputPath, apkDownloadUrl, {
      type: 'png',
      width: 600,
      margin: 2,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    });
    console.log('Successfully generated RupeeTracker_QR.png encoded with:', apkDownloadUrl);

    // Also copy to dist if dist exists
    const distDir = path.resolve('dist');
    if (fs.existsSync(distDir)) {
      fs.copyFileSync(outputPath, path.join(distDir, 'RupeeTracker_QR.png'));
    }
  } catch (err) {
    console.error('Error generating QR code:', err);
  }
}

generateQR();
