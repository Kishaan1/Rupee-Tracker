# 💰 RUPEE TRACKER

<p align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/indian-rupee.svg" width="72" height="72" alt="Rupee Tracker Logo" />
</p>

<h3 align="center">Every rupee matters · Track it effortlessly</h3>

<p align="center">
  A high-end, minimalist personal money-entry tracker designed with a fintech aesthetic. Built for lightning-fast recording with physical keyboard auto-routing, instant Enter-to-save, optional categorization, and 100% offline persistence.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Android%20APK-10b981?style=for-the-badge&logo=android" alt="Platform" />
  <img src="https://img.shields.io/badge/Storage-100%25%20Offline%20SQLite-0ea5e9?style=for-the-badge&logo=sqlite" alt="Offline" />
  <img src="https://img.shields.io/badge/React-19.0-61dafb?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178c6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-CSS%20v4-38bdf8?style=for-the-badge&logo=tailwindcss" alt="Tailwind CSS v4" />
</p>

---

## ✨ Core Philosophy

> **Open App → Type Amount → Press Enter → Saved.**

Rupee Tracker is deliberately engineered to eliminate cognitive friction. Unlike bloated multi-step budgeting apps that demand vendor selections, account types, and complex tax splits, Rupee Tracker keeps your focus on the numbers:

1. **Zero Tap Overhead:** The amount field is focused automatically on startup.
2. **Physical Keyboard First:** Connected keyboard or numeric numpads on Android automatically route keystrokes into the amount field.
3. **Optional Context:** Add a reason only when you want to—never when you're in a hurry.

---

## 🌟 Key Features

### ⚡ Fast Amount Entry
- **Prominent Visual Center:** Elegant large numerals (`font-mono tabular-nums`) with a subtle `₹` prefix and focus transitions.
- **Instant Save:** Hitting `Enter` on any physical or virtual keyboard records the amount immediately with microsecond local timestamps.
- **Smart Math Expressions:** Type `120+45` or `500-80` directly into the input—it evaluates expressions on Enter.
- **Quick-Add Buttons:** One-tap pills for `+₹50`, `+₹100`, `+₹250`, `+₹500`, `+₹1000`, and `+₹2000` that increment the input without auto-saving.

### 🏷️ Optional Reason Bottom Sheet
- Positioned ~2 cm below the input in a subtle outlined pill design (`+ Add Reason`).
- Smooth slide-up bottom sheet with rounded corners and backdrop blur.
- One-tap quick suggestion chips:
  - 🍕 **Food**
  - 🚗 **Travel**
  - 🛍️ **Shopping**
  - 💡 **Bills**
  - 🎓 **Education**
  - 👤 **Personal**
- Custom reason text typing with dedicated `Enter` confirmation.
- Once attached, renders as an editable chip with quick remove `(X)` controls.

### 📊 Financial Overview & Analytics
- **Obsidian Balance Card:** Total recorded balance with micro-statistics:
  - **Entries Count:** Total records in your database.
  - **Average Entry:** Mean transaction amount.
  - **Highest Entry:** Peak transaction value.
- **4 Compact Period Cards:** Real-time totals for **Today**, **This Week**, **This Month**, and **All Time**.
- **Daily Information Bar:** Dynamic selected-period tally with calendar indicators (*e.g., Today's Total: ₹1,850 · 3 Entries*).
- **Interactive Analytics:**
  - 7-day and 30-day SVG spending trend bar charts with hover tooltips.
  - Category & reason distribution breakdown with percentages, counts, and emerald progress bars.

### 📅 Calendar & Date Ledger
- Monthly interactive calendar with forward/backward month navigation.
- Days with recorded entries are highlighted with emerald badges and day totals (*e.g., ₹500, ₹2k*).
- Tap any date to view that specific day's complete transaction breakdown.

### 🕒 Transaction History & Search
- Chronological timeline grouped by date with daily subtotals.
- Real-time instant search by **amount**, **reason**, **date**, or **time**.
- Quick filter chips: *All*, *Today*, *This Week*, *This Month*.
- Inline editing for amounts and reasons.
- 5-second non-blocking floating **Undo** notification for deletions.

### 🛡️ Privacy & Local Data Management
- **100% Offline & Zero Tracking:** All records reside in local storage and Room SQLite.
- **Spreadsheet Export:** Download clean CSV files for external accounting.
- **JSON Backup & Restore:** Complete offline data portability.
- **Theme System:** Dark Mode (Obsidian `#090a0f`) and Light Mode (Soft off-white `#f8fafc`) with automatic persistent storage.

---

## 📱 Navigation Structure

Rupee Tracker features an elevated, touch-friendly 5-tab bottom navigation bar:

```
┌─────────────────────────────────────────────────────────────┐
│                        RUPEE TRACKER                        │
│                                                             │
│  [ Home ]    [ History ]    [ Analytics ]   [ Calendar ]   [ Settings ]
└─────────────────────────────────────────────────────────────┘
```

| Tab | Purpose | Key Capabilities |
|:---|:---|:---|
| **🏠 Home** | Fast Entry | Instant amount input, + Add Reason, quick presets, balance card, recent preview |
| **🕒 History** | Timeline | Full chronological ledger, search by keyword/amount, inline edit, delete with undo |
| **📊 Analytics** | Insights | 7-day/30-day trend charts, category breakdown, averages, highest records |
| **📅 Calendar** | Date Browser | Month view, active transaction date highlights, day subtotal inspection |
| **⚙️ Settings** | Preferences | Theme switcher, CSV export, JSON backup/restore, privacy info, data reset |

---

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 8](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Motion (Framer Motion)](https://motion.dev/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Mobile Runtime:** [Capacitor 8](https://capacitorjs.com/) (Android APK build support)
- **Local Database:** Room SQLite / LocalStorage Offline Engine

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Bun
- npm or pnpm

### Local Development

1. Clone or download the repository:
   ```bash
   git clone https://github.com/your-username/rupee-tracker.git
   cd rupee-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

---

## 📲 Building the Android APK

Rupee Tracker is pre-configured with **Capacitor** and **GitHub Actions** for automated cloud APK builds without needing a local Android Studio setup.

### Option 1: Automated GitHub Actions Cloud Build (Phone-friendly)
1. Push the repository to your GitHub account.
2. Navigate to the **Actions** tab on GitHub (available on Android mobile browsers).
3. Select the **Build Android APK** workflow and click **Run workflow**.
4. Once completed (~2 minutes), download `RupeeTracker.apk` directly from the workflow artifacts.

### Option 2: Local Gradle Build
```bash
# Sync web build to Android assets
npm run build
npx cap sync android

# Build Debug APK using Gradle wrapper
cd android
./gradlew assembleDebug
```
The output APK is generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🔒 Privacy & Offline Assurance

- 🚫 **No Firebase**
- 🚫 **No Google Sheets**
- 🚫 **No Cloud Databases**
- 🚫 **No Third-party Analytics or Tracking**
- ✅ **100% On-Device Persistence**

Your financial records belong exclusively to you on your device.

---

## 📄 License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.

<p align="center">
  <b>Rupee Tracker</b> · Crafted with precision for effortless personal finance.
</p>
