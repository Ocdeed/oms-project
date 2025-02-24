class DriversManagement {
  constructor() {
    this.initializeMap();
    this.initializeCharts();
    this.initializeEventListeners();
    this.initializeRealTimeUpdates();
  }

  initializeEventListeners() {
    // Add Driver Button
    const addDriverBtn = document.getElementById("addDriverBtn");
    if (addDriverBtn) {
      addDriverBtn.addEventListener("click", () => this.showAddDriverModal());
    }

    // Status Filter
    const statusFilter = document.querySelector(".status-filter");
    if (statusFilter) {
      statusFilter.addEventListener("change", (e) =>
        this.filterDrivers(e.target.value)
      );
    }

    // Export Button
    const exportBtn = document.querySelector('[title="Export List"]');
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportDriversList());
    }

    // Driver Actions
    document.querySelectorAll(".action-buttons .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("title").toLowerCase();
        const driverId = e.currentTarget
          .closest("tr")
          .querySelector(".driver-info span").textContent;
        this.handleDriverAction(action, driverId);
      });
    });
  }

  showAddDriverModal() {
    const modal = document.getElementById("addDriverModal");
    modal.classList.add("show");

    // Close button handler
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelAdd");

    [closeBtn, cancelBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          modal.classList.remove("show");
        });
      }
    });

    // Handle form submission
    const form = modal.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleAddDriver(form);
      });
    }

    // Photo upload preview
    const photoInput = document.getElementById("driverPhoto");
    if (photoInput) {
      photoInput.addEventListener("change", (e) => this.handlePhotoUpload(e));
    }
  }

  handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const uploadArea = document.querySelector(".upload-area");
        uploadArea.innerHTML = `
                    <img src="${e.target.result}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                `;
      };
      reader.readAsDataURL(file);
    }
  }

  handleDriverAction(action, driverId) {
    switch (action) {
      case "track":
        this.centerMapOnDriver(driverId);
        break;
      case "contact":
        this.contactDriver(driverId);
        break;
      case "more":
        this.showDriverOptions(driverId);
        break;
    }
  }

  centerMapOnDriver(driverId) {
    const marker = this.driverMarkers.get(driverId);
    if (marker) {
      this.map.setCenter(marker.getPosition());
      this.map.setZoom(15);
      marker.info.open(this.map, marker);
    }
  }

  contactDriver(driverId) {
    // Simulate contact action
    const driver = this.drivers.find((d) => d.id === driverId);
    if (driver) {
      alert(`Contacting ${driver.name}...\nPhone: ${driver.phone}`);
    }
  }

  showDriverOptions(driverId) {
    const options = [
      "View Profile",
      "Edit Details",
      "View Schedule",
      "Performance History",
      "Documents",
    ];

    const menu = document.createElement("div");
    menu.className = "context-menu";
    menu.innerHTML = options
      .map((option) => `<div class="context-menu-item">${option}</div>`)
      .join("");

    // Position and show menu
    document.body.appendChild(menu);
    // Add click handlers
    // Remove menu when clicking outside
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: -6.776012, lng: 39.178326 },
      zoom: 12,
      styles: this.getMapStyles(),
    };

    this.map = new google.maps.Map(
      document.getElementById("drivers-map"),
      mapOptions
    );

    this.driverMarkers = new Map();
    this.initializeDriverLocations();
  }

  initializeDriverLocations() {
    // Sample driver data
    this.drivers = [
      {
        id: "DRV-001",
        name: "John Makonde",
        lat: -6.776012,
        lng: 39.178326,
        status: "active",
        phone: "+255 123 456 789",
      },
      {
        id: "DRV-002",
        name: "Michael Juma",
        lat: -6.786012,
        lng: 39.188326,
        status: "break",
        phone: "+255 987 654 321",
      },
    ];

    this.drivers.forEach((driver) => this.addDriverMarker(driver));
  }

  addDriverMarker(driver) {
    const marker = new google.maps.Marker({
      position: { lat: driver.lat, lng: driver.lng },
      map: this.map,
      title: driver.name,
      icon: this.getDriverIcon(driver.status),
    });

    const info = new google.maps.InfoWindow({
      content: this.createDriverInfoWindow(driver),
    });

    marker.addListener("click", () => {
      info.open(this.map, marker);
    });

    this.driverMarkers.set(driver.id, { marker, info });
  }

  createDriverInfoWindow(driver) {
    return `
            <div class="driver-info-window">
                <h3>${driver.name}</h3>
                <p>Status: ${driver.status}</p>
                <p>ID: ${driver.id}</p>
                <div class="info-window-actions">
                    <button onclick="driversManager.contactDriver('${driver.id}')">
                        <i class="fas fa-phone"></i> Contact
                    </button>
                    <button onclick="driversManager.showDriverProfile('${driver.id}')">
                        <i class="fas fa-user"></i> Profile
                    </button>
                </div>
            </div>
        `;
  }

  initializeCharts() {
    const ctx = document.getElementById("performanceChart").getContext("2d");
    this.performanceChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "Speed",
          "Safety",
          "Punctuality",
          "Customer Rating",
          "Fuel Efficiency",
        ],
        datasets: [
          {
            label: "Performance Metrics",
            data: [92, 88, 95, 89, 87],
            backgroundColor: "#0073e6",
            borderRadius: 8,
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
            max: 100,
          },
        },
      },
    });
  }

  initializeRealTimeUpdates() {
    // Update driver locations
    setInterval(() => {
      this.updateDriverLocations();
    }, 5000);

    // Update performance metrics
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 30000);
  }

  updateDriverLocations() {
    this.driverMarkers.forEach((data, driverId) => {
      const currentPos = data.marker.getPosition();
      const newPos = {
        lat: currentPos.lat() + (Math.random() - 0.5) * 0.001,
        lng: currentPos.lng() + (Math.random() - 0.5) * 0.001,
      };
      data.marker.setPosition(newPos);
    });
  }

  updatePerformanceMetrics() {
    const newData = this.performanceChart.data.datasets[0].data.map((value) => {
      return value + (Math.random() - 0.5) * 5;
    });
    this.performanceChart.data.datasets[0].data = newData;
    this.performanceChart.update();
  }

  getMapStyles() {
    // Custom map styles for better visualization
    return [
      {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ visibility: "simplified" }],
      },
      // Add more custom styles as needed
    ];
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.driversManager = new DriversManagement();
});
