import JSZip from 'jszip';
import fs from 'fs';
import path from 'path';

const zip = new JSZip();

function addDirectoryToZip(dirPath, zipFolder, excludeDirs = []) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    if (excludeDirs.includes(item)) continue;

    const fullPath = path.join(dirPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const subFolder = zipFolder.folder(item);
      addDirectoryToZip(fullPath, subFolder, excludeDirs);
    } else {
      const fileData = fs.readFileSync(fullPath);
      zipFolder.file(item, fileData);
    }
  }
}

console.log('Packaging complete Capacitor Android source project...');

// Root files
const rootFiles = [
  'capacitor.config.json',
  'package.json',
  'tsconfig.json',
  'vite.config.ts',
  'index.html',
  'metadata.json'
];

for (const file of rootFiles) {
  if (fs.existsSync(file)) {
    zip.file(file, fs.readFileSync(file));
  }
}

// Add folders
if (fs.existsSync('src')) {
  addDirectoryToZip('src', zip.folder('src'), []);
}
if (fs.existsSync('dist')) {
  addDirectoryToZip('dist', zip.folder('dist'), []);
}
if (fs.existsSync('android')) {
  addDirectoryToZip('android', zip.folder('android'), ['.gradle', 'build', '.idea']);
}

// Add comprehensive build instructions
const buildInstructions = `# Rupee Tracker — Capacitor Android Source Code & APK Build Guide

This package contains the complete, production-ready Android source code for **Rupee Tracker** powered by **Capacitor 7** and **React 19 / Vite**.

## App Details
- **Application ID**: com.rupeetracker.app
- **App Name**: Rupee Tracker
- **Target SDK**: 35 (Android 15)
- **Minimum SDK**: 22 (Android 5.1+)
- **Architecture**: 100% Offline, Local SQLite/IndexedDB Storage, Physical Keyboard Support (Enter-to-save, NumPad routing).

---

## Method 1: Build Debug APK in Android Studio (Recommended — 2 Minutes)

1. **Extract this ZIP file**.
2. Open **Android Studio** (Hedgehog, Iguana, or Koala).
3. Click **File > Open** and select the \`android\` directory inside the extracted folder.
4. Android Studio will open the project and automatically run a Gradle sync (~30-60 seconds).
5. From the top menu, select:
   **Build > Build Bundle(s) / APK(s) > Build APK(s)**
6. Once compilation completes, Android Studio will display a popup:
   **"APK(s) generated successfully for 1 module"**
7. Click **locate** to open the folder containing \`app-debug.apk\`.
8. Copy \`app-debug.apk\` to your Android phone (via USB, WhatsApp, Google Drive, or Bluetooth) and install!

---

## Method 2: Build APK via Terminal / Command Line

If you have Java (JDK 17 or 21) and the Android SDK installed:

\`\`\`bash
# 1. Navigate to the android folder
cd android

# 2. Build the debug APK
# On macOS / Linux:
./gradlew assembleDebug

# On Windows:
gradlew.bat assembleDebug
\`\`\`

The generated APK file will be located at:
\`android/app/build/outputs/apk/debug/app-debug.apk\`

---

## Method 3: Generate a Signed Release APK for Production

1. In Android Studio, open the \`android\` project.
2. In the top menu, click **Build > Generate Signed Bundle / APK...**
3. Select **APK** and click **Next**.
4. Choose **Create new...** to create a keystore (or select your existing keystore).
5. Set your keystore password, key alias, and validity.
6. Select the destination folder, choose **release** build variant, and check both **V1 (Jar Signature)** and **V2 (Full APK Signature)**.
7. Click **Finish**. Your signed \`app-release.apk\` will be generated!

---

## Hardware Keyboard Features Verified
- **Auto-focus**: Input focuses automatically on app launch.
- **Number routing**: Number keys (0-9, NumPad 0-9, .) route directly into the amount input.
- **Enter key commit**: Pressing Enter on physical USB-C/Bluetooth keyboards immediately logs the entry with timestamp.
- **Continuous logging**: Focus returns within 1 frame for back-to-back entries.
- **Offline Invariant**: All transactions persist in the device's local database without network requirements.
`;

zip.file('BUILD_APK_INSTRUCTIONS.md', buildInstructions);

// Generate ZIP
const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const outputPath = path.join(publicDir, 'RupeeTracker-Android-Source.zip');

zip
  .generateNodeStream({ type: 'nodebuffer', streamFiles: true, compression: 'DEFLATE' })
  .pipe(fs.createWriteStream(outputPath))
  .on('finish', () => {
    const stats = fs.statSync(outputPath);
    console.log(`Successfully generated ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  });
