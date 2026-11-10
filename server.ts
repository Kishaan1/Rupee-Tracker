import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production' || process.env.BUILD_ENV === 'production';

// Helper to find file in public or dist directory
function getFilePath(filename: string): string | null {
  const candidates = [
    path.join(__dirname, 'dist', filename),
    path.join(__dirname, 'public', filename),
    path.join(__dirname, filename),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return null;
}

// 1. Dedicated APK Download Endpoints
app.get(['/download/RupeeTracker.apk', '/RupeeTracker.apk'], (req, res) => {
  const apkPath = getFilePath('RupeeTracker.apk');
  if (apkPath) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="RupeeTracker.apk"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(apkPath);
  }
  res.status(404).send('RupeeTracker.apk not found. Please compile or package the APK.');
});

// 2. Dedicated QR Code Image Endpoints
app.get(['/download/RupeeTracker_QR.png', '/RupeeTracker_QR.png'], (req, res) => {
  const qrPath = getFilePath('RupeeTracker_QR.png');
  if (qrPath) {
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename="RupeeTracker_QR.png"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(qrPath);
  }
  res.status(404).send('RupeeTracker_QR.png not found.');
});

// 3. Android Source Code ZIP Endpoints
app.get(['/download/RupeeTracker-Android-Source.zip', '/RupeeTracker-Android-Source.zip'], (req, res) => {
  const zipPath = getFilePath('RupeeTracker-Android-Source.zip');
  if (zipPath) {
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="RupeeTracker-Android-Source.zip"');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.sendFile(zipPath);
  }
  res.status(404).send('RupeeTracker-Android-Source.zip not found.');
});

// Serve public static folder
app.use(express.static(path.join(__dirname, 'public')));

async function startServer() {
  if (!isProd && process.env.VITE_DEV !== 'false') {
    // Mount Vite middleware in development mode
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production built assets from dist
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      const indexHtml = path.join(__dirname, 'dist', 'index.html');
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.status(404).send('Application not built. Run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT} (Production: ${isProd})`);
  });
}

startServer();
