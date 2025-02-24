"use strict";
const menubtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".dashboard-sidebar");
const contentContainer = document.querySelector(".dashboard-content-container");
const menuIcons = document.getElementsByClassName("menuText");
const menuList = document.querySelector(".dashboard-menu-list");

var sideBarisOpen = true;

menubtn.addEventListener("click", (e) => {
  e.preventDefault();

  if (sideBarisOpen) {
    sidebar.style.width = "10%";
    sidebar.style.transition = ".3s all";
    contentContainer.style.width = "90%";

    for (var i = 0; i < menuIcons.length; i++) {
      menuIcons[i].style.display = "none";
    }

    menuList.style.textAlign = "center";
    sideBarisOpen = false;
  } else {
    sidebar.style.width = "20%";
    contentContainer.style.width = "80%";

    for (var i = 0; i < menuIcons.length; i++) {
      menuIcons[i].style.display = "inline-block";
    }

    menuList.style.textAlign = "normal";
    sideBarisOpen = true;
  }
});

class DashboardController {
  constructor() {
    this.sidebar = document.querySelector(".sidebar");
    this.mainContent = document.querySelector(".main-content");
    this.toggleBtn = document.getElementById("sidebar-toggle");
    this.menuItems = document.querySelectorAll(".sidebar-nav li a");
    this.currentPage = "dashboard";
    this.pageContents = {
      dashboard: "/dashboard-content.html",
      fleet: "/fleet-management.html",
    };
    this.init();
  }

  init() {
    // Initialize sidebar state
    this.checkScreenSize();
    this.bindEvents();
    this.setupMenuTooltips();
    this.initializeNavigation();
  }

  bindEvents() {
    // Toggle button click handler
    this.toggleBtn.addEventListener("click", () => this.toggleSidebar());

    // Window resize handler
    window.addEventListener("resize", () => this.checkScreenSize());

    // Menu item click handler
    this.menuItems.forEach((item) => {
      item.addEventListener("click", (e) => this.handleMenuClick(e));
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        if (
          !e.target.closest(".sidebar") &&
          !e.target.closest("#sidebar-toggle")
        ) {
          this.sidebar.classList.add("collapsed");
          this.mainContent.classList.add("expanded");
        }
      }
    });
  }

  toggleSidebar() {
    this.sidebar.classList.toggle("collapsed");
    this.mainContent.classList.toggle("expanded");

    // Add animation class
    this.sidebar.classList.add("animating");
    setTimeout(() => this.sidebar.classList.remove("animating"), 300);
  }

  checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.sidebar.classList.add("collapsed");
      this.mainContent.classList.add("expanded");
    } else {
      // Only expand if it wasn't manually collapsed
      if (!localStorage.getItem("sidebarCollapsed")) {
        this.sidebar.classList.remove("collapsed");
        this.mainContent.classList.remove("expanded");
      }
    }
  }

  handleMenuClick(e) {
    // Remove active class from all items
    this.menuItems.forEach((item) =>
      item.parentElement.classList.remove("active")
    );

    // Add active class to clicked item
    e.currentTarget.parentElement.classList.add("active");

    // On mobile, collapse sidebar after selection
    if (window.innerWidth <= 768) {
      this.sidebar.classList.add("collapsed");
      this.mainContent.classList.add("expanded");
    }
  }

  setupMenuTooltips() {
    this.menuItems.forEach((item) => {
      const text = item.querySelector("span").textContent;
      item.setAttribute("data-title", text);
    });
  }

  initializeNavigation() {
    this.menuItems.forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const page = e.currentTarget.dataset.page;
        if (page && page !== this.currentPage) {
          this.loadPage(page);
        }
        this.handleMenuClick(e);
      });
    });
  }

  async loadPage(page) {
    try {
      const response = await fetch(this.pageContents[page]);
      const content = await response.text();
      document.querySelector(".dashboard-content").innerHTML = content;
      this.currentPage = page;

      // Initialize page-specific features
      if (page === "fleet") {
        this.initializeFleetFeatures();
      }
    } catch (error) {
      console.error("Error loading page:", error);
    }
  }

  initializeFleetFeatures() {
    // Initialize fleet-specific features
    const addVehicleBtn = document.querySelector(".btn-primary");
    if (addVehicleBtn) {
      addVehicleBtn.addEventListener("click", () => {
        // Implement add vehicle functionality
        alert("Add vehicle modal will open here");
      });
    }

    // Initialize action buttons
    document.querySelectorAll(".action-buttons .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.title.toLowerCase();
        const vehicleId = e.currentTarget
          .closest("tr")
          .querySelector("td").textContent;
        this.handleFleetAction(action, vehicleId);
      });
    });
  }

  handleFleetAction(action, vehicleId) {
    switch (action) {
      case "track":
        // Implement tracking functionality
        alert(`Tracking vehicle ${vehicleId}`);
        break;
      case "edit":
        // Implement edit functionality
        alert(`Editing vehicle ${vehicleId}`);
        break;
    }
  }
}

class HeaderController {
  constructor() {
    this.initializeHeader();
  }

  initializeHeader() {
    // Notifications Toggle
    const notificationBtn = document.getElementById("notificationToggle");
    const notificationsPanel = document.getElementById("notificationsPanel");

    notificationBtn.addEventListener("click", () => {
      notificationsPanel.classList.toggle("show");
      // Close profile dropdown if open
      document.getElementById("profileDropdown").classList.remove("show");
    });

    // Profile Toggle
    const profileBtn = document.getElementById("profileToggle");
    const profileDropdown = document.getElementById("profileDropdown");

    profileBtn.addEventListener("click", () => {
      profileDropdown.classList.toggle("show");
      // Close notifications if open
      notificationsPanel.classList.remove("show");
    });

    // Close dropdowns when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest(".notifications-wrapper") &&
        !e.target.closest(".profile-wrapper")
      ) {
        notificationsPanel.classList.remove("show");
        profileDropdown.classList.remove("show");
      }
    });

    // Stats Ticker Animation
    this.initializeStatsTicker();
  }

  initializeStatsTicker() {
    const ticker = document.querySelector(".stats-ticker");
    setInterval(() => {
      // Update stats with new data
      this.updateStats();
    }, 5000);
  }

  updateStats() {
    // Simulate real-time stats updates
    const deliveryChange = (Math.random() * 20 - 10).toFixed(1);
    const delayedShipments = Math.floor(Math.random() * 5);

    document.querySelector(
      ".ticker-item.positive span"
    ).textContent = `Deliveries: ${
      deliveryChange > 0 ? "+" : ""
    }${deliveryChange}%`;

    document.querySelector(
      ".ticker-item.warning span"
    ).textContent = `${delayedShipments} Delayed Shipments`;
  }
}

class DashboardContent {
  constructor() {
    this.initializeCharts();
    this.initializeDataUpdates();
    this.initializeRevenueButtons();
  }

  formatNumber(num) {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(num * 2500); // Converting USD to approximate TZS rate
  }

  initializeCharts() {
    const ctx = document.getElementById("revenueChart").getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(0,115,230,0.2)");
    gradient.addColorStop(1, "rgba(0,115,230,0)");

    this.revenueChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Revenue (TZS)",
            data: [
              32000000, 45000000, 39000000, 54000000, 48000000, 60000000,
              58000000,
            ],
            borderColor: "#0073e6",
            backgroundColor: gradient,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                return (
                  "Revenue: " +
                  new Intl.NumberFormat("sw-TZ", {
                    style: "currency",
                    currency: "TZS",
                    maximumFractionDigits: 0,
                  }).format(context.parsed.y)
                );
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              display: true,
              drawBorder: false,
            },
          },
          x: {
            grid: {
              display: false,
            },
          },
        },
      },
    });
  }

  initializeDataUpdates() {
    // Update card values periodically
    setInterval(() => {
      this.updateCardValues();
    }, 5000);

    // Add animation to progress bars
    document.querySelectorAll(".progress-bar").forEach((bar) => {
      this.animateProgressBar(bar);
    });
  }

  updateCardValues() {
    document.querySelectorAll(".card").forEach((card) => {
      const value = card.querySelector("h2");
      const trend = card.querySelector(".trend");
      if (value && trend) {
        // Simulate value changes
        const currentValue = parseFloat(
          value.textContent.replace(/[^0-9.-]+/g, "")
        );
        const change = Math.random() * 10 - 5;
        const newValue = currentValue + currentValue * (change / 100);

        value.textContent = this.formatNumber(newValue);
        trend.className = `trend ${change >= 0 ? "positive" : "negative"}`;
        trend.querySelector("span").textContent = `${Math.abs(change).toFixed(
          1
        )}%`;
      }
    });
  }

  animateProgressBar(bar) {
    const target = parseInt(bar.style.width);
    let current = 0;
    const increment = target / 100;
    const duration = 1500;
    const steps = 60;
    const stepDuration = duration / steps;

    const animation = setInterval(() => {
      current += increment;
      bar.style.width = `${current}%`;
      if (current >= target) {
        clearInterval(animation);
      }
    }, stepDuration);
  }

  initializeRevenueButtons() {
    const dateRangeButtons = document.querySelectorAll(".date-range .btn-text");
    dateRangeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        // Remove active class from all buttons
        dateRangeButtons.forEach((btn) => btn.classList.remove("active"));
        // Add active class to clicked button
        e.target.classList.add("active");

        // Update chart data based on selected range
        this.updateChartData(e.target.dataset.range);
      });
    });

    // Download button functionality
    const downloadBtn = document.querySelector(
      '.btn-icon[title="Download Report"]'
    );
    downloadBtn.addEventListener("click", () => this.downloadReport());
  }

  updateChartData(range) {
    // Sample data for different ranges
    const data = {
      weekly: [
        32000000, 45000000, 39000000, 54000000, 48000000, 60000000, 58000000,
      ],
      monthly: [280000000, 320000000, 350000000, 410000000],
      yearly: [3200000000, 3800000000, 4200000000, 4500000000],
    };

    // Update chart with new data
    this.revenueChart.data.datasets[0].data = data[range];
    this.revenueChart.data.labels = this.getLabels(range);
    this.revenueChart.update();

    // Update subtitle
    const subtitle = document.querySelector(".header-left .subtitle");
    const total = data[range].reduce((a, b) => a + b, 0);
    subtitle.textContent = `Total revenue for this ${range}: ${this.formatNumber(
      total
    )}`;
  }

  getLabels(range) {
    switch (range) {
      case "weekly":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "monthly":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];
      case "yearly":
        return ["Q1", "Q2", "Q3", "Q4"];
      default:
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
  }

  downloadReport() {
    // Simulate download with loading state
    const btn = document.querySelector('.btn-icon[title="Download Report"]');
    btn.classList.add("loading");
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

    setTimeout(() => {
      btn.classList.remove("loading");
      btn.innerHTML = '<i class="fas fa-download"></i>';

      // In real application, trigger actual report download here
      alert("Report downloaded successfully!");
    }, 1500);
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new DashboardController();
  new HeaderController();
  new DashboardContent();
});
