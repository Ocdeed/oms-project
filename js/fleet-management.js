class FleetManagement {
  constructor() {
    this.initializeMap();
    this.initializeCharts();
    this.initializeEventListeners();
    this.initializeVehicleTracking();
  }

  initializeEventListeners() {
    // Add Vehicle Button
    const addVehicleBtn = document.getElementById("addVehicleBtn");
    if (addVehicleBtn) {
      addVehicleBtn.addEventListener("click", () => this.showAddVehicleModal());
    }

    // Action Buttons
    document.querySelectorAll(".action-buttons .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("title").toLowerCase();
        const vehicleId = e.currentTarget
          .closest("tr")
          .querySelector("td").textContent;
        this.handleVehicleAction(action, vehicleId);
      });
    });

    // Filter Button
    const filterBtn = document.querySelector('[title="Filter List"]');
    if (filterBtn) {
      filterBtn.addEventListener("click", () => this.showFilterOptions());
    }

    // Analytics Date Range
    document
      .querySelectorAll(".analytics .date-range .btn-text")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          this.updateAnalytics(e.target.textContent.toLowerCase());
        });
      });

    // Map Controls
    document.querySelectorAll(".map-controls .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("title").toLowerCase();
        this.handleMapControl(action);
      });
    });
  }

  showAddVehicleModal() {
    const modal = document.getElementById("addVehicleModal");
    modal.classList.add("show");

    const closeBtn = document.getElementById("closeModal");
    closeBtn.addEventListener("click", () => {
      modal.classList.remove("show");
    });

    // Close modal when clicking outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("show");
      }
    });
  }

  handleVehicleAction(action, vehicleId) {
    switch (action) {
      case "track":
        this.centerMapOnVehicle(vehicleId);
        break;
      case "edit":
        this.showEditVehicleModal(vehicleId);
        break;
      case "more":
        this.showMoreOptions(vehicleId);
        break;
    }
  }

  initializeMap() {
    // Initialize Google Maps
    const mapOptions = {
      center: { lat: -6.776012, lng: 39.178326 }, // Dar es Salaam
      zoom: 12,
    };

    this.map = new google.maps.Map(
      document.getElementById("fleet-map"),
      mapOptions
    );

    // Add vehicles to map
    this.vehicles = new Map();
    this.addVehicleMarkers();
  }

  addVehicleMarkers() {
    // Sample vehicle data
    const vehicles = [
      { id: "TZ-FL-001", lat: -6.776012, lng: 39.178326, status: "active" },
      {
        id: "TZ-FL-002",
        lat: -6.786012,
        lng: 39.188326,
        status: "maintenance",
      },
      // Add more vehicles
    ];

    vehicles.forEach((vehicle) => {
      const marker = new google.maps.Marker({
        position: { lat: vehicle.lat, lng: vehicle.lng },
        map: this.map,
        title: vehicle.id,
        icon: this.getVehicleIcon(vehicle.status),
      });

      this.vehicles.set(vehicle.id, marker);
    });
  }

  getVehicleIcon(status) {
    // Return different icons based on vehicle status
    const icons = {
      active: "images/truck-active.png",
      maintenance: "images/truck-maintenance.png",
      inactive: "images/truck-inactive.png",
    };
    return icons[status] || icons.active;
  }

  centerMapOnVehicle(vehicleId) {
    const marker = this.vehicles.get(vehicleId);
    if (marker) {
      this.map.setCenter(marker.getPosition());
      this.map.setZoom(15);
    }
  }

  initializeCharts() {
    const ctx = document.getElementById("fleetAnalyticsChart").getContext("2d");
    this.analyticsChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Distance Covered (km)",
            data: [250, 320, 280, 400, 350, 300, 270],
            borderColor: "#0073e6",
            tension: 0.4,
            fill: false,
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
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              drawBorder: false,
            },
          },
        },
      },
    });
  }

  updateAnalytics(range) {
    // Update active button
    document
      .querySelectorAll(".analytics .date-range .btn-text")
      .forEach((btn) => {
        btn.classList.toggle("active", btn.textContent.toLowerCase() === range);
      });

    // Sample data for different ranges
    const data = {
      week: [250, 320, 280, 400, 350, 300, 270],
      month: [1200, 1400, 1100, 1300],
      year: [14000, 16000, 15000, 17000],
    };

    this.analyticsChart.data.datasets[0].data = data[range];
    this.analyticsChart.data.labels = this.getLabelsForRange(range);
    this.analyticsChart.update();
  }

  getLabelsForRange(range) {
    switch (range) {
      case "week":
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      case "month":
        return ["Week 1", "Week 2", "Week 3", "Week 4"];
      case "year":
        return ["Q1", "Q2", "Q3", "Q4"];
      default:
        return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    }
  }

  initializeVehicleTracking() {
    // Simulate real-time updates
    setInterval(() => {
      this.updateVehicleLocations();
    }, 5000);
  }

  updateVehicleLocations() {
    // Simulate vehicle movement
    this.vehicles.forEach((marker, vehicleId) => {
      const currentPosition = marker.getPosition();
      const lat = currentPosition.lat() + (Math.random() - 0.5) * 0.001;
      const lng = currentPosition.lng() + (Math.random() - 0.5) * 0.001;
      marker.setPosition({ lat, lng });
    });
  }

  handleMapControl(action) {
    switch (action) {
      case "refresh":
        this.refreshMap();
        break;
      case "full screen":
        this.toggleFullScreen();
        break;
    }
  }

  refreshMap() {
    // Refresh vehicle locations
    this.updateVehicleLocations();
    // Show loading indicator
    const refreshBtn = document.querySelector('[title="Refresh"] i');
    refreshBtn.classList.add("fa-spin");
    setTimeout(() => refreshBtn.classList.remove("fa-spin"), 1000);
  }

  toggleFullScreen() {
    const mapElement = document.querySelector(".map-view");
    if (!document.fullscreenElement) {
      mapElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new FleetManagement();
});
