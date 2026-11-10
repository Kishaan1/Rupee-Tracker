# How to Generate RupeeTracker.apk Using Only Your Android Phone

This guide requires **NO laptop or desktop computer**. You will build the Android APK entirely in the cloud using GitHub Actions and download it directly to your phone.

---

## 5-Minute Phone Setup Guide

### Step 1: Create a New GitHub Repository on Your Phone
1. Open Chrome on your Android phone and go to [github.com](https://github.com).
2. Log in (or sign up for free).
3. Tap the **+** (plus icon) in the top right and select **New repository**.
4. Name it `rupee-tracker` and keep it **Public**.
5. Tap **Create repository**.

---

### Step 2: Upload Project Files from Your Phone
1. In the Rupee Tracker web app, tap the **Android** button in the header.
2. Tap **"Download Bundle ZIP"** or **"Download Project ZIP"** to save `RupeeTracker-Android-Source.zip` directly to your phone's *Downloads* folder.
3. Open your phone's file manager (Files by Google, Samsung My Files, or ZArchiver) and extract the ZIP.
4. On your GitHub repo page in Chrome, tap **"uploading an existing file"**.
5. Select and upload the extracted files (including the `.github` folder containing `android-build.yml`).
6. Tap **Commit changes**.

---

### Step 3: Trigger the Cloud APK Build
1. In your GitHub repository on your phone, tap the **Actions** tab.
2. Tap **"Build Rupee Tracker Android APK"** on the left.
3. Tap the **"Run workflow"** button and confirm.
4. GitHub's cloud server will automatically:
   - Install Java JDK 17 & Node.js 22.
   - Run Gradle `assembleDebug`.
   - Package `RupeeTracker.apk`.
   *(Takes approximately 2 to 3 minutes)*.

---

### Step 4: Download & Install on Your Android Phone
Once the build completes with a green checkmark (✓):
1. **Direct Release Download (Instant):**
   - Go to your repository homepage.
   - Under **Releases** on the right side, tap **Rupee Tracker Android APK v1.0.0**.
   - Tap **RupeeTracker.apk** (approx. 4 MB) to download directly to your phone.
2. **Alternative (Actions Artifacts):**
   - Tap the completed workflow run in the **Actions** tab.
   - Scroll down to **Artifacts** and tap **RupeeTracker-APK**.
3. Open the downloaded APK on your phone and tap **Install**!

---

## Direct WebAPK Alternative (No GitHub Required)
If you want to use the app right now on your phone without waiting for GitHub:
1. Open the Rupee Tracker app in **Google Chrome** on your phone.
2. Tap the Chrome three-dot menu (**⋮**) in the top right.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Android will generate an official WebAPK with a native icon, full offline SQLite local storage, and physical keyboard support!
