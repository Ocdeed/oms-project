class LoginManager {
  constructor() {
    this.initializeEventListeners();
    this.checkAuthStatus();
  }

  initializeEventListeners() {
    // Password visibility toggle
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.querySelector("#password");

    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        const type =
          passwordInput.getAttribute("type") === "password"
            ? "text"
            : "password";
        passwordInput.setAttribute("type", type);
        togglePassword.querySelector("i").classList.toggle("fa-eye");
        togglePassword.querySelector("i").classList.toggle("fa-eye-slash");
      });
    }

    // Form submission
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (e) => this.handleLogin(e));
    }

    // Remember me checkbox
    const rememberMe = document.querySelector('input[name="remember"]');
    if (rememberMe) {
      rememberMe.checked = localStorage.getItem("rememberMe") === "true";
    }
  }

  async handleLogin(e) {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    const rememberMe = document.querySelector('input[name="remember"]').checked;

    if (!this.validateInputs(username, password)) {
      return;
    }

    this.setLoadingState(true);

    try {
      const success = await this.authenticateUser(username, password);
      if (success) {
        this.handleSuccessfulLogin(username, rememberMe);
      } else {
        this.showError("Invalid username or password");
      }
    } catch (error) {
      this.showError("An error occurred. Please try again.");
    } finally {
      this.setLoadingState(false);
    }
  }

  validateInputs(username, password) {
    if (!username.trim() || !password.trim()) {
      this.showError("Please fill in all fields");
      return false;
    }
    return true;
  }

  setLoadingState(isLoading) {
    const submitBtn = document.querySelector(".btn-login");
    if (!submitBtn) return;

    if (isLoading) {
      submitBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Signing in...';
      submitBtn.disabled = true;
    } else {
      submitBtn.innerHTML =
        '<span>Sign In</span><i class="fas fa-arrow-right"></i>';
      submitBtn.disabled = false;
    }
  }

  async authenticateUser(username, password) {
    // For demo purposes, using hardcoded credentials
    // In production, replace with actual API call
    const validCredentials = {
      admin: "admin123",
      user: "user123",
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return validCredentials[username] === password;
  }

  handleSuccessfulLogin(username, rememberMe) {
    // Save auth state
    const authData = {
      username: username,
      token: this.generateToken(),
      timestamp: new Date().getTime(),
    };

    if (rememberMe) {
      localStorage.setItem("authData", JSON.stringify(authData));
      localStorage.setItem("rememberMe", "true");
    } else {
      sessionStorage.setItem("authData", JSON.stringify(authData));
      localStorage.removeItem("rememberMe");
    }

    // Show success message
    this.showSuccess("Login successful! Redirecting...");

    // Redirect to dashboard
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 1000);
  }

  checkAuthStatus() {
    const authData = JSON.parse(
      localStorage.getItem("authData") ||
        sessionStorage.getItem("authData") ||
        "{}"
    );

    if (authData.token && this.isTokenValid(authData)) {
      window.location.href = "dashboard.html";
    }
  }

  isTokenValid(authData) {
    const tokenAge = new Date().getTime() - authData.timestamp;
    const tokenValidityDuration = 24 * 60 * 60 * 1000; // 24 hours
    return tokenAge < tokenValidityDuration;
  }

  generateToken() {
    // Simple token generation for demo
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  showError(message) {
    const notification = this.createNotification(message, "error");
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  showSuccess(message) {
    const notification = this.createNotification(message, "success");
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  }

  createNotification(message, type) {
    const notification = document.createElement("div");
    notification.className = `login-notification ${type}`;
    notification.innerHTML = `
            <i class="fas fa-${
              type === "success" ? "check-circle" : "exclamation-circle"
            }"></i>
            <span>${message}</span>
        `;
    return notification;
  }
}

// Initialize login manager
document.addEventListener("DOMContentLoaded", () => {
  new LoginManager();
});
