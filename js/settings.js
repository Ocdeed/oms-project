class SettingsManager {
  constructor() {
    this.currentSection = "profile";
    this.initializeEventListeners();
    this.initializeImageUpload();
    this.initializeToggles();
    this.initializeThemePreview();
    this.loadUserPreferences();
  }

  initializeEventListeners() {
    // Navigation
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        this.switchSection(e.currentTarget.getAttribute("href").slice(1));
      });
    });

    // Form submissions
    document.querySelectorAll(".settings-form").forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleFormSubmission(e.target);
      });
    });

    // Real-time validation
    document
      .querySelectorAll(".settings-form input, .settings-form textarea")
      .forEach((input) => {
        input.addEventListener("input", (e) => this.validateInput(e.target));
      });

    // Quick settings toggles
    document
      .querySelectorAll('.quick-settings-item input[type="checkbox"]')
      .forEach((toggle) => {
        toggle.addEventListener("change", (e) => {
          this.handleQuickSetting(
            e.target.closest(".quick-settings-item").dataset.setting,
            e.target.checked
          );
        });
      });
  }

  switchSection(sectionId) {
    // Update navigation
    document.querySelectorAll(".settings-nav-item").forEach((item) => {
      item.classList.toggle(
        "active",
        item.getAttribute("href") === `#${sectionId}`
      );
    });

    // Update content
    document.querySelectorAll(".settings-section").forEach((section) => {
      section.classList.toggle("active", section.id === sectionId);
    });

    this.currentSection = sectionId;
    this.updateURL();
  }

  initializeImageUpload() {
    const uploadBtn = document.querySelector(".upload-actions .btn-outline");
    const removeBtn = document.querySelector(".upload-actions .btn-icon");
    const preview = document.getElementById("profilePreview");

    if (uploadBtn) {
      uploadBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = (e) => this.handleImageUpload(e.target.files[0]);
        input.click();
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        this.handleImageRemoval();
      });
    }
  }

  async handleImageUpload(file) {
    if (!file || !file.type.startsWith("image/")) return;

    try {
      const preview = document.getElementById("profilePreview");
      const reader = new FileReader();

      reader.onload = (e) => {
        preview.src = e.target.result;
        this.showNotification("Profile photo updated successfully", "success");
      };

      reader.readAsDataURL(file);

      // Simulate API upload
      await this.uploadImageToServer(file);
    } catch (error) {
      this.showNotification(
        "Failed to upload image. Please try again.",
        "error"
      );
    }
  }

  async uploadImageToServer(file) {
    // Simulate API call - replace with actual endpoint
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }

  initializeToggles() {
    // Two-Factor Authentication
    const twoFactorToggle = document.querySelector("#security .toggle input");
    if (twoFactorToggle) {
      twoFactorToggle.addEventListener("change", (e) => {
        this.handle2FAToggle(e.target.checked);
      });
    }

    // Theme toggle
    const themeToggle = document.querySelector(
      "#appearance .theme-toggle input"
    );
    if (themeToggle) {
      themeToggle.addEventListener("change", (e) => {
        this.handleThemeChange(e.target.checked ? "dark" : "light");
      });
    }
  }

  async handle2FAToggle(enabled) {
    try {
      if (enabled) {
        const confirmed = await this.show2FASetupModal();
        if (!confirmed) {
          document.querySelector("#security .toggle input").checked = false;
          return;
        }
      }

      // Update 2FA status
      await this.update2FAStatus(enabled);
      this.showNotification(
        enabled ? "2FA has been enabled" : "2FA has been disabled",
        "success"
      );
    } catch (error) {
      this.showNotification("Failed to update 2FA settings", "error");
    }
  }

  initializeThemePreview() {
    const themeCards = document.querySelectorAll(".theme-card");
    themeCards.forEach((card) => {
      card.addEventListener("click", () => {
        themeCards.forEach((c) => c.classList.remove("active"));
        card.classList.add("active");
        this.handleThemeChange(card.dataset.theme);
      });
    });
  }

  async handleThemeChange(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    await this.saveUserPreference("theme", theme);
    this.showNotification("Theme updated successfully", "success");
  }

  async handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    try {
      // Show loading state
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));

      this.showNotification("Settings saved successfully", "success");
      this.updateLastSaved();
    } catch (error) {
      this.showNotification(
        "Failed to save settings. Please try again.",
        "error"
      );
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  }

  validateInput(input) {
    const isValid = input.checkValidity();
    const errorElement = input.parentElement.querySelector(".error-message");

    if (!isValid && input.value) {
      if (!errorElement) {
        const error = document.createElement("span");
        error.className = "error-message";
        error.textContent = input.validationMessage;
        input.parentElement.appendChild(error);
      }
    } else if (errorElement) {
      errorElement.remove();
    }
  }

  async saveUserPreference(key, value) {
    try {
      // Simulate API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem(`preference_${key}`, value);
    } catch (error) {
      console.error("Failed to save preference:", error);
    }
  }

  loadUserPreferences() {
    // Load saved theme
    const savedTheme = localStorage.getItem("preference_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);

    // Load other preferences
    const savedSettings = Object.keys(localStorage)
      .filter((key) => key.startsWith("preference_"))
      .reduce((acc, key) => {
        acc[key.replace("preference_", "")] = localStorage.getItem(key);
        return acc;
      }, {});

    this.applyLoadedPreferences(savedSettings);
  }

  showNotification(message, type = "success") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;

    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  updateURL() {
    history.pushState(
      { section: this.currentSection },
      "",
      `#${this.currentSection}`
    );
  }

  updateLastSaved() {
    const timestamp = document.querySelector(".last-saved");
    if (timestamp) {
      timestamp.textContent = `Last saved: ${new Date().toLocaleTimeString()}`;
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.settingsManager = new SettingsManager();
});
