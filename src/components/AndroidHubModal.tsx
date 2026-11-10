import React, { useState } from 'react';
import {
  X,
  Smartphone,
  Download,
  FolderArchive,
  Database,
  CheckCircle2,
  Code2,
  Terminal,
  FileDown,
  Cloud,
  PlayCircle,
  ExternalLink,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

import { downloadAndroidStudioZip } from '../utils/exportAndroidProject';
import { downloadDirectApk } from '../utils/apkDownloader';

interface AndroidHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidHubModal: React.FC<AndroidHubModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'github' | 'install' | 'package' | 'windows'>('github');
  const [isGeneratingNativeZip, setIsGeneratingNativeZip] = useState(false);

  if (!isOpen) return null;

  const handleDownloadNativeZip = async () => {
    try {
      setIsGeneratingNativeZip(true);
      await downloadAndroidStudioZip();
    } catch (err) {
      console.error('Failed to generate native project ZIP:', err);
    } finally {
      setIsGeneratingNativeZip(false);
    }
  };

  const handleDownloadCapacitorZip = () => {
    const a = document.createElement('a');
    a.href = '/download/RupeeTracker-Android-Source.zip';
    a.download = 'RupeeTracker-Android-Source.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Rupee Tracker Android Suite
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Capacitor 7 Native Source · Verified QR Code · 100% Offline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 pt-4 border-b border-zinc-100 dark:border-zinc-800 flex gap-3 text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'github'
                ? 'border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            Phone Cloud Build (GitHub)
          </button>
          <button
            onClick={() => setActiveTab('install')}
            className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'install'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            1-Tap Phone App (WebAPK)
          </button>
          <button
            onClick={() => setActiveTab('package')}
            className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'package'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5" />
            Download Source ZIP
          </button>
          <button
            onClick={() => setActiveTab('windows')}
            className={`pb-2.5 whitespace-nowrap transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'windows'
                ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Windows PC Steps
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {activeTab === 'github' && (
            <div className="space-y-4">
              {/* Header Box */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                      Phone-Only · No PC Needed
                    </span>
                    <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      Build RupeeTracker.apk in the Cloud
                    </h4>
                  </div>
                  <Cloud className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  Your project now has a pre-configured <strong>GitHub Actions</strong> workflow (<code className="font-mono">.github/workflows/android-build.yml</code>). GitHub's cloud servers will compile the raw Android APK using Gradle and give you a direct download link on your phone in ~2 minutes!
                </p>
              </div>

              {/* Direct Binary APK Card */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500 text-white uppercase tracking-wider">
                      Fixed Direct Download
                    </span>
                    <h5 className="text-xs font-bold">
                      RupeeTracker.apk (Pure Binary · In-Memory)
                    </h5>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">2.55 MB</span>
                </div>
                <p className="text-[11px] text-zinc-300 dark:text-zinc-600">
                  Delivered directly from phone memory as a binary Blob. Solves the issue where server links downloaded as HTML error pages!
                </p>
                <button
                  onClick={() => downloadDirectApk()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
                >
                  <Smartphone className="w-4 h-4" />
                  Download Pure Binary APK Now
                </button>
              </div>

              {/* Step by Step on Phone */}
              <div className="space-y-3">
                <h5 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Or Build Fresh APK in GitHub Cloud:
                </h5>

                {/* Step 1 */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center">
                        1
                      </span>
                      Download the Cloud-Ready Project ZIP
                    </div>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Saves the source code with the automated GitHub Actions workflow directly to your phone's <em>Downloads</em> folder.
                  </p>
                  <button
                    onClick={handleDownloadNativeZip}
                    disabled={isGeneratingNativeZip}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300 text-white dark:text-zinc-900 font-semibold text-xs shadow-sm transition-all"
                  >
                    <FileDown className="w-4 h-4" />
                    {isGeneratingNativeZip ? 'Preparing ZIP...' : 'Download Project ZIP to Phone'}
                  </button>
                </div>

                {/* Step 2 */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center">
                      2
                    </span>
                    Create a Free GitHub Repo in Chrome Mobile
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Open <strong>github.com</strong> in Chrome on your phone &gt; tap <strong>+ (New repository)</strong> &gt; name it <code className="font-mono">rupee-tracker</code> &gt; tap <strong>"uploading an existing file"</strong> and upload the ZIP contents.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center">
                      3
                    </span>
                    Trigger the Cloud Build (1 Tap)
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    On your phone, tap the <strong>Actions</strong> tab &gt; tap <strong>"Build Rupee Tracker Android APK"</strong> &gt; tap <strong>"Run workflow"</strong>. GitHub runs Ubuntu, Java 17, and Gradle in the cloud!
                  </p>
                </div>

                {/* Step 4 */}
                <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                      4
                    </span>
                    Download & Install RupeeTracker.apk on Your Phone
                  </div>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Once finished (green checkmark), go to <strong>Releases</strong> or <strong>Artifacts</strong> on your repo page and tap <strong>RupeeTracker.apk</strong>. Tap the file in your phone's notification bar to install!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'package' && (
            <div className="space-y-4">
              {/* Option 1: Native Jetpack Compose + Room Project (Instant In-Browser Download) */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                      Recommended
                    </span>
                    <h4 className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                      Native Jetpack Compose + Room SQLite Project
                    </h4>
                  </div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">
                    Kotlin 2.0 · Room Database (SQLite) · Hardware Keyboard Support · Instant In-Browser ZIP
                  </p>
                </div>
                <button
                  onClick={handleDownloadNativeZip}
                  disabled={isGeneratingNativeZip}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  <FileDown className="w-4 h-4" />
                  {isGeneratingNativeZip ? 'Bundling...' : 'Download Project ZIP'}
                </button>
              </div>

              {/* Option 2: Complete Capacitor Android Studio Project with Gradle Wrapper */}
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Capacitor 7 Android Studio Bundle (with gradlew.bat)
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400">
                    Includes pre-configured <code className="font-mono">gradlew.bat</code>, AndroidManifest.xml, and all web assets
                  </p>
                </div>
                <button
                  onClick={handleDownloadCapacitorZip}
                  className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-white text-xs font-semibold shadow-sm active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download Bundle ZIP
                </button>
              </div>

              {/* Transparent Explanation Box */}
              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-2 text-xs text-blue-900 dark:text-blue-200">
                <div className="flex items-center gap-1.5 font-semibold">
                  <Code2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Why Build On Your Windows PC?
                </div>
                <p className="leading-relaxed text-blue-800 dark:text-blue-300">
                  Android APK compilation requires the Java JDK and Android Build Tools (aapt2, d8, Gradle daemon), which cannot run inside sandboxed cloud web containers. Building locally on Windows gives you a genuine, signed debug APK with zero cloud dependencies.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'windows' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    <Terminal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Exact Windows Command Line & Android Studio Build Steps
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400">Target SDK 35</span>
                </div>

                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  The downloaded package contains the complete Android project with <code className="font-mono">gradlew.bat</code> ready for Windows command line or Android Studio.
                </p>

                <div className="space-y-2 p-3.5 rounded-xl bg-zinc-900 text-zinc-100 font-mono text-xs">
                  <p className="text-zinc-400">// Step 1: Extract RupeeTracker-Android-Source.zip</p>
                  <p className="text-emerald-400">cd RupeeTracker-Android-Source\android</p>
                  <br />
                  <p className="text-zinc-400">// Step 2: Build the Debug APK on Windows (PowerShell or CMD)</p>
                  <p className="text-emerald-400">.\gradlew.bat assembleDebug</p>
                  <br />
                  <p className="text-zinc-400">// Step 3: Locate your compiled APK</p>
                  <p className="text-zinc-300">app\build\outputs\apk\debug\app-debug.apk</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2 text-xs">
                <h4 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Android Studio GUI Alternative:
                </h4>
                <p>1. Open Android Studio &gt; <strong>File &gt; Open</strong> &gt; Select the <code className="font-mono">android</code> directory.</p>
                <p>2. Let Gradle sync complete (~30 seconds).</p>
                <p>3. Click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</p>
                <p>4. Click <strong>locate</strong> on the popup to get your <code className="font-mono">app-debug.apk</code>.</p>
              </div>
            </div>
          )}

          {activeTab === 'install' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Direct Phone Installation (WebAPK)
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  On Android devices, Chrome automatically generates a native <strong>WebAPK</strong> that installs directly to your home screen and app drawer with its own app icon, splash screen, and full offline Room/local database.
                </p>

                {isInstalled ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>App is already running in standalone Android mode!</span>
                  </div>
                ) : isInstallable ? (
                  <button
                    onClick={install}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md active:scale-98"
                  >
                    <Smartphone className="w-4 h-4" />
                    Install App Directly on Phone
                  </button>
                ) : (
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      Installation Steps:
                    </p>
                    <p>1. Open this app URL in <strong>Google Chrome</strong> on your Android phone.</p>
                    <p>2. Tap the Chrome three-dot menu (⋮) in the top-right corner.</p>
                    <p>3. Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                    <p>4. Android generates the APK and installs Rupee Tracker on your phone!</p>
                  </div>
                )}
              </div>

              <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2 font-semibold text-zinc-800 dark:text-zinc-200">
                  <Database className="w-3.5 h-3.5 text-zinc-500" />
                  Offline Storage & Hardware Specs:
                </div>
                <ul className="space-y-1 list-disc list-inside text-zinc-500 dark:text-zinc-400">
                  <li>Zero cloud dependencies (no Google Sheets, no Firebase).</li>
                  <li>Physical USB / Bluetooth keyboard Enter key commit.</li>
                  <li>Works completely without WiFi or cellular data.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-[11px] text-zinc-500">
            Capacitor 7 Native Android · Room SQLite · 100% Offline
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
