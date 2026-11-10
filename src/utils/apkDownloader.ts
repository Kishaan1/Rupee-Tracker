import { APK_BASE64 } from './embeddedApk';

/**
 * Downloads the real binary RupeeTracker.apk directly from client-side memory.
 * This completely avoids server 404s, reverse proxy redirects, and HTML error pages.
 */
export function downloadDirectApk(): void {
  try {
    const binaryString = atob(APK_BASE64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Verify ZIP magic header PK\x03\x04
    if (bytes[0] !== 0x50 || bytes[1] !== 0x4B) {
      throw new Error('APK binary corrupt or not a zip package');
    }

    const blob = new Blob([bytes], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'RupeeTracker.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
  } catch (err) {
    console.error('Failed to download APK from memory:', err);
    // Fallback to direct path if memory fails
    window.location.href = '/download/RupeeTracker.apk';
  }
}
