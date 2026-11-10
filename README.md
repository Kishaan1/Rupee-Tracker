# 💰 RUPEE TRACKER

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/indian-rupee.svg" width="80" height="80" alt="Rupee Tracker Logo" />
</p>

<h2 align="center">RUPEE TRACKER</h2>

<p align="center">
  <b>Every rupee matters · Track it effortlessly</b>
</p>

<p align="center">
  A world-class, minimalist personal money tracker designed with a banking-grade fintech aesthetic. Engineered for lightning-fast entries with physical keyboard auto-routing, instant Enter-to-save, optional categorization, and 100% offline persistence.
</p>

<p align="center">
  <!-- Prominent Primary Download CTA -->
  <a href="https://github.com/Kishaan1/Rupee-Tracker/releases/latest/download/RupeeTracker.apk">
    <img src="https://img.shields.io/badge/%E2%AC07%20DOWNLOAD%20FOR%20ANDROID%20(APK)-RupeeTracker.apk-10b981?style=for-the-badge&logo=android&logoColor=white&labelColor=064e3b" height="46" alt="Download for Android APK" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/Kishaan1/Rupee-Tracker/releases/latest">
    <img src="https://img.shields.io/github/v/release/Kishaan1/Rupee-Tracker?color=10b981&label=Latest%20Release&style=flat-square" alt="Latest Release" />
  </a>
  <img src="https://img.shields.io/badge/APK%20Size-2.55%20MB-0ea5e9?style=flat-square&logo=android" alt="APK Size" />
  <img src="https://img.shields.io/badge/Storage-100%25%20Offline%20SQLite-10b981?style=flat-square&logo=sqlite" alt="Offline SQLite" />
  <img src="https://img.shields.io/badge/Android-7.0%20to%2015-38bdf8?style=flat-square&logo=android" alt="Android Versions" />
  <img src="https://img.shields.io/badge/License-Apache--2.0-gray?style=flat-square" alt="License" />
</p>

---

## 📥 Quick Download Links

| Method | Target Link | Description |
|:---|:---|:---|
| **Primary (GitHub Release)** | [**⬇ Download RupeeTracker.apk**](https://github.com/Kishaan1/Rupee-Tracker/releases/latest/download/RupeeTracker.apk) | Direct APK download from the latest tagged cloud build release |
| **Direct APK Mirror** | [**⬇ Download via App Server**](https://ais-pre-cdzx7rbbzk2a2zunjzkc45-777447338205.asia-northeast1.run.app/download/RupeeTracker.apk) | Instant binary download directly to your mobile browser |
| **All Releases** | [**View Release Assets & Changelog**](https://github.com/Kishaan1/Rupee-Tracker/releases) | Release tags, build checksums, and workflow artifacts |

> *Note: If downloading a new release before the first GitHub Action run finishes, trigger the workflow once in the Actions tab or use the Direct APK Mirror link above.*

---

## ⚡ 1. Project Overview

Rupee Tracker is deliberately engineered to eliminate cognitive friction in personal money tracking. Unlike bloated budgeting apps that force you through endless dropdowns, complex vendor lists, and account authorizations, Rupee Tracker keeps your focus strictly on what matters: **the numbers**.

### Core Philosophy
```
┌─────────────────────────────────────────────────────────────┐
│  Open App  ──►  Type Amount  ──►  Press Enter  ──►  Saved   │
└─────────────────────────────────────────────────────────────┘
```

1. **Zero Tap Overhead:** The amount field receives input focus automatically upon app launch.
2. **Physical Keyboard First:** Connected USB-C/Bluetooth keyboards or numeric numpads on Android auto-route keystrokes directly to the amount field.
3. **Optional Context:** Add a reason only when you want to—never when you're in a hurry.

---

## ✨ 2. Key Features

### ⚡ Fast Amount Entry
- **Visual Center:** Prominent, high-contrast typography (`text-5xl` to `text-7xl font-mono`) with a subtle `₹` symbol prefix and focus underline.
- **Instant Save:** Hitting `Enter` on any physical or virtual keyboard records the amount immediately with microsecond local timestamps.
- **Smart Math Expressions:** Type `120+45` or `500-80` directly into the input—it evaluates math on `Enter`.
- **Quick-Add Pills:** Non-submitting buttons (`+₹50`, `+₹100`, `+₹250`, `+₹500`, `+₹1000`, `+₹2000`) that increment the input without auto-saving, letting you continue typing or press `Enter`.

### 🏷️ Optional Reason System
- Positioned ~2 cm below the input in a subtle outlined pill design (`+ Add Reason`).
- Smooth slide-up bottom sheet with rounded corners and soft backdrop blur.
- One-tap quick suggestion chips:
  - 🍕 **Food**
  - 🚗 **Travel**
  - 🛍️ **Shopping**
  - 💡 **Bills**
  - 🎓 **Education**
  - 👤 **Personal**
- Custom text input with auto-focus and dedicated `Enter` confirmation.
- Renders as an attached editable chip (`Reason: Food`) with inline edit and remove `(X)` controls.

### 💳 Black Balance Summary Card
- **TOTAL RECORDED BALANCE** with a live emerald status indicator.
- Large white amount display in Indian formatting (`₹XX,XXX`).
- Micro-metrics computed live from actual records:
  - **Total Entries Count:** Overall number of logged transactions.
  - **Average Recorded Entry:** Mean transaction amount.
  - **Highest Recorded Entry:** Peak single transaction value.

### 📅 Period Summaries & Daily Information Bar
- Four compact cards: **Today**, **This Week**, **This Month**, and **All Time** with emerald active-state borders.
- Daily Total Information Bar:
  > *Today's Total: ₹1,850 · 3 Entries*

### 🕒 Transaction History & Search
- Chronological timeline grouped by date with daily subtotals.
- Real-time search by **amount**, **reason**, **date**, or **time**.
- Quick filter chips: *All*, *Today*, *This Week*, *This Month*.
- Inline editing for amounts and reasons.
- 5-second non-blocking floating **Undo** notification for deletions.

### 📊 Interactive Analytics
- 7-day and 30-day interactive SVG daily spending trend bar charts with hover tooltips.
- Period comparisons: **Today vs Yesterday**, **This Week vs Prior Week**, **This Month vs Prior Month**.
- Category and reason breakdown with percentage shares, counts, and emerald progress bars (*Food*, *Travel*, *Shopping*, *Bills*, *Education*, *Personal*, *Unspecified*).

### 🗓️ Monthly Calendar View
- Full interactive monthly calendar with forward/backward month navigation.
- Days with logged transactions are highlighted with emerald badges and day totals (*e.g., ₹500, ₹2k*).
- Tap any date to view that specific day's complete transaction breakdown.

---

## 🎨 3. Premium UI & Design System

The application is styled with a commercial-grade fintech aesthetic:

* **Dark Theme:** Deep obsidian background (`#090a0f`), elevated dark surfaces (`#111318`), hairline borders (`border-white/[0.08]`), and crisp typography.
* **Light Theme:** Soft off-white backdrop (`#f8fafc`), pure white card surfaces (`#ffffff`), dark charcoal headings, and subtle borders.
* **Accent Color:** Tailored emerald green (`#10b981`) representing financial balance and growth.
* **Typography:** `Outfit` for geometric UI display hierarchy and `JetBrains Mono` for tabular numerals (`tabular-nums`), currency amounts, and timestamps.
* **Theme Persistence:** Immediate synchronization with `localStorage` and `document.documentElement` across app restarts.

---

## 📱 4. How to Download & Install on Android

### Method 1: Direct APK Download on Your Phone (Recommended)
1. Tap the [**⬇ DOWNLOAD FOR ANDROID (APK)**](https://github.com/Kishaan1/Rupee-Tracker/releases/latest/download/RupeeTracker.apk) button at the top of this page.
2. If Chrome shows *"File might be harmful"*, tap **Download anyway** (standard warning for direct APK downloads outside Google Play).
3. Swipe down your notification shade and tap `RupeeTracker.apk` (or open it from your phone's **Files** / **Downloads** app).
4. If prompted *"For your security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** $\rightarrow$ toggle **Allow from this source** on $\rightarrow$ tap Back.
5. Tap **Install** $\rightarrow$ **Open**. You're ready to track!

---

## 📖 5. How to Use the Application

### 1. Recording an Amount (Fast-Entry)
1. Open the app — the amount input is automatically focused.
2. Type your amount (e.g. `250`).
3. Press **Enter** on your keyboard (or tap the corner return button).
4. The amount is saved instantly with a timestamp, the input clears, and focus remains ready for the next entry.

### 2. Adding an Optional Reason
1. Type your amount (e.g. `500`).
2. Tap **+ Add Reason** directly below the amount.
3. Tap a suggestion (*Food*, *Travel*, *Shopping*, etc.) or type a custom note.
4. Tap **Save Reason** (or press Enter in the reason sheet).
5. Press **Enter** in the amount field to commit both amount and reason together.

### 3. Reviewing & Editing History
1. Tap the **History** tab in the bottom navigation.
2. Search by amount (e.g. `1500`) or keyword (e.g. `Lunch`).
3. Double-tap any transaction or tap the pencil icon to edit the amount or reason inline.
4. Tap the trash icon to delete (with a 5-second Undo toast if deleted by mistake).

---

## 🛠️ 6. Technology Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Frontend Framework** | [React 19](https://react.dev/) | Component architecture, hooks, high-performance UI rendering |
| **Language** | [TypeScript Strict](https://www.typescriptlang.org/) | Type-safe models, interfaces, strict compiler checks |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first styling with `@custom-variant dark` |
| **Animations** | [Motion (Framer Motion)](https://motion.dev/) | Smooth 150-250ms transitions, bottom sheet slides, bar charts |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent fintech outline iconography |
| **Mobile Runtime** | [Capacitor 8](https://capacitorjs.com/) | Native Android APK bridge, hardware keyboard listeners |
| **CI/CD Cloud Build** | [GitHub Actions](https://github.com/features/actions) | Automated cloud APK compilation via Gradle wrapper |
| **Storage Engine** | Room SQLite / LocalStorage | 100% offline, persistent on-device transactional ledger |

---

## 🔒 7. Offline Functionality & Privacy

- 🚫 **No Firebase**
- 🚫 **No Google Sheets**
- 🚫 **No Cloud Databases or External Servers**
- 🚫 **No Telemetry, Analytics Trackers, or Ads**
- ✅ **100% On-Device Persistence:** All data is stored locally in Room SQLite / device storage.
- ✅ **Offline Guaranteed:** The app works without an internet connection after installation.

---

## 💾 8. Backup & Data Portability

Navigate to the **Settings** tab (or tap the download icon in the header) to manage your data:

* **Download CSV Spreadsheet:** Export all transactions into a standard `.csv` file compatible with Microsoft Excel, Google Sheets, or Apple Numbers.
* **Download JSON Backup:** Export complete structured JSON backups containing IDs, amounts, reasons, timestamps, and edit metadata.
* **Restore from JSON Backup:** Upload a previously saved backup file to restore records with confirmation prompts.
* **Reset Data:** Secure, double-confirmed database reset option.

---

## 🚀 9. GitHub Actions Workflow (Cloud APK Builds)

The repository includes an automated workflow at [`.github/workflows/android-build.yml`](.github/workflows/android-build.yml):

```yaml
name: Build Rupee Tracker Android APK
on:
  push:
    branches: [ main, master ]
  workflow_dispatch:
```

### What it does:
1. Sets up Node.js 22 and builds production web assets (`npm run build`).
2. Syncs web assets to the native Android directory (`npx cap sync android`).
3. Sets up Temurin JDK 17 and Gradle build cache.
4. Executes `./gradlew assembleDebug` to package `RupeeTracker.apk`.
5. Uploads the build artifact as `RupeeTracker-APK`.
6. Publishes a GitHub Release tagged `v1.0.0` with `RupeeTracker.apk` attached for direct one-click downloading.

---

## 🗺️ 10. Future Roadmap

- [x] Fast amount input with physical keyboard auto-routing
- [x] Optional reason bottom sheet with suggested categories
- [x] 4-period summary cards (Today, Week, Month, All Time)
- [x] 5-tab bottom navigation with Analytics and Calendar views
- [x] Dark and Light fintech themes with persistence
- [x] CSV export and JSON backup/restore
- [ ] Multiple currency selection (USD, EUR, GBP)
- [ ] Biometric fingerprint / Face unlock option
- [ ] Recurring expense reminders

---

## 📄 11. License

This project is open-source and licensed under the [Apache-2.0 License](LICENSE).

---

<p align="center">
  <b>Rupee Tracker</b> · Built for speed, privacy, and financial clarity.
</p>
