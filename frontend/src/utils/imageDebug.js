/**
 * Image Debug Utility
 * Helps diagnose and troubleshoot image loading issues
 * Usage: Call this in browser console during development
 */

export const imageDebug = {
  /**
   * Check image loading status
   */
  checkImageUrl: (imagePath) => {
    console.group("🔍 Image URL Debug");
    console.log("Raw path:", imagePath);

    if (!imagePath) {
      console.warn("⚠️ Image path is empty!");
      console.groupEnd();
      return;
    }

    // Check if it's a data URL
    if (imagePath.startsWith("data:")) {
      console.log("✅ Data URL (embedded image)");
      console.groupEnd();
      return;
    }

    // Check if it's a full URL
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      console.log("✅ Full URL:", imagePath);
      console.log("Domain:", new URL(imagePath).hostname);
      console.groupEnd();
      return;
    }

    // Check if it's a relative path
    if (imagePath.startsWith("/")) {
      console.log("📍 Relative path, will be converted to full URL");

      const backendUrl = import.meta.env.VITE_API_URL
        ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
        : "";

      if (backendUrl) {
        const fullUrl = `${backendUrl}${imagePath}`;
        console.log("📡 VITE_API_URL set:", backendUrl);
        console.log("✅ Full URL will be:", fullUrl);
      } else {
        console.log("📍 VITE_API_URL not set (development mode)");
        console.log("✅ Will use relative path:", imagePath);
        console.log("💡 Ensure backend serves /uploads at same domain or via proxy");
      }
    }

    console.groupEnd();
  },

  /**
   * Test if image can be loaded
   */
  testImageLoad: async (imagePath) => {
    console.group("🧪 Testing Image Load");
    console.log("Path:", imagePath);

    return new Promise((resolve) => {
      const img = new Image();

      img.onload = () => {
        console.log("✅ Image loaded successfully!");
        console.log("Size:", img.naturalWidth + "x" + img.naturalHeight);
        console.groupEnd();
        resolve(true);
      };

      img.onerror = () => {
        console.error("❌ Failed to load image");
        console.error("Tried URL:", img.src);
        console.log("💡 Possible causes:");
        console.log("  - File not found on server");
        console.log("  - CORS issues");
        console.log("  - Incorrect domain");
        console.log("  - Server not running");
        console.groupEnd();
        resolve(false);
      };

      img.src = imagePath;

      // Timeout after 5 seconds
      setTimeout(() => {
        if (img.complete) return;
        console.warn("⏱️ Image load timeout (5s)");
        console.groupEnd();
      }, 5000);
    });
  },

  /**
   * Show all environment and configuration details
   */
  showConfig: () => {
    console.group("⚙️ Configuration Details");

    // Backend URL
    const backendUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
      : "";
    console.log("VITE_API_URL:", backendUrl || "(empty - using relative paths)");

    // Frontend URL
    console.log("Frontend URL:", window.location.origin);

    // Environment
    console.log("Environment:", import.meta.env.MODE);
    console.log("DEV:", import.meta.env.DEV);
    console.log("PROD:", import.meta.env.PROD);

    // Test API health
    console.log("\n📡 Testing API connectivity...");

    const apiUrl = backendUrl ? `${backendUrl}/api/health` : "/api/health";
    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ API response:", data);
      })
      .catch((err) => {
        console.error("❌ API unreachable:", err.message);
      });

    console.groupEnd();
  },

  /**
   * List all images on page with their load status
   */
  auditPageImages: () => {
    console.group("🖼️ Page Images Audit");

    const images = document.querySelectorAll("img");
    console.log(`Found ${images.length} images on page`);

    images.forEach((img, index) => {
      const status = img.complete && img.naturalHeight !== 0 ? "✅ Loaded" : "❌ Failed";
      console.log(`[${index + 1}] ${status} - ${img.src}`);

      if (img.complete && img.naturalHeight === 0) {
        console.log("     Error:", img.alt || "(no alt text)");
      }
    });

    console.groupEnd();
  },

  /**
   * Get full image URL based on backend configuration
   */
  getFullImageUrl: (imagePath) => {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
      return imagePath;
    }
    if (imagePath.startsWith("data:")) {
      return imagePath;
    }

    const backendUrl = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
      : "";

    if (backendUrl && imagePath.startsWith("/uploads/")) {
      return `${backendUrl}${imagePath}`;
    }

    return imagePath;
  },

  /**
   * Full diagnostic report
   */
  runFullDiagnostics: async (imagePath) => {
    console.group("🔧 Full Diagnostic Report");
    console.clear();

    console.log("📊 System Information");
    console.log("Frontend:", window.location.origin);
    console.log("Backend URL:", import.meta.env.VITE_API_URL || "(not set)");
    console.log("Environment:", import.meta.env.MODE);

    console.log("\n🔍 Testing Image Path:", imagePath);
    this.checkImageUrl(imagePath);

    const fullUrl = this.getFullImageUrl(imagePath);
    console.log("\n🧪 Testing Image Load...");
    await this.testImageLoad(fullUrl);

    console.log("\n🖼️ Page Audit");
    this.auditPageImages();

    console.groupEnd();
  },
};

// Export for use in console
if (import.meta.env.DEV) {
  window.imageDebug = imageDebug;
  console.log(
    "💡 Image debug tools available in console: window.imageDebug\n" +
      "Usage:\n" +
      "  imageDebug.showConfig()           - Show all config\n" +
      "  imageDebug.checkImageUrl(path)    - Check URL conversion\n" +
      "  imageDebug.testImageLoad(path)    - Test image loading\n" +
      "  imageDebug.auditPageImages()      - Audit all images\n" +
      "  imageDebug.runFullDiagnostics()   - Full diagnostic"
  );
}

export default imageDebug;
