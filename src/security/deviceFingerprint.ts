/**
 * Vocariox Device Identification System (v4.0.1)
 * Generates a stable, hashed device identifier.
 */

export class DeviceFingerprint {
  private static STORAGE_KEY = 'vocariox_device_id';

  /**
   * Gets or generates the device ID
   */
  static async getDeviceId(): Promise<string> {
    let deviceId = localStorage.getItem(this.STORAGE_KEY);
    
    if (!deviceId) {
      deviceId = await this.generateFingerprint();
      localStorage.setItem(this.STORAGE_KEY, deviceId);
    }
    
    return deviceId;
  }

  /**
   * Collects entropy and generates a unique hash
   */
  private static async generateFingerprint(): Promise<string> {
    const data = {
      ua: navigator.userAgent,
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      res: `${window.screen.width}x${window.screen.height}`,
      plat: navigator.platform,
      mem: (navigator as any).deviceMemory || 'unknown',
      cores: navigator.hardwareConcurrency || 'unknown',
      rand: Math.random().toString(36).substring(2) + Date.now().toString(36)
    };

    const str = JSON.stringify(data);
    return this.sha256(str);
  }

  /**
   * SHA-256 Hashing helper
   */
  private static async sha256(message: string): Promise<string> {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Helper to get a human-readable device name
   */
  static getDeviceName(): string {
    const ua = navigator.userAgent;
    let name = "Unknown Device";
    
    if (ua.includes("Chrome")) name = "Chrome";
    else if (ua.includes("Safari")) name = "Safari";
    else if (ua.includes("Firefox")) name = "Firefox";
    else if (ua.includes("Edg")) name = "Edge";
    
    if (ua.includes("Windows")) name += " - Windows";
    else if (ua.includes("Macintosh")) name += " - macOS";
    else if (ua.includes("Android")) name += " - Android";
    else if (ua.includes("iPhone")) name += " - iPhone";
    
    return name;
  }
}
