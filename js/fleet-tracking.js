class FleetTracker {
  constructor() {
    this.map = null;
    this.markers = new Map();
    this.vehicles = [];
    this.initMap();
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById("fleet-map"), {
      zoom: 12,
      center: { lat: -6.776012, lng: 39.178326 }, // Dar es Salaam coordinates
      styles: this.getMapStyles(),
    });

    // Initialize demo vehicles
    this.initializeDemoVehicles();
    this.startTracking();
  }

  initializeDemoVehicles() {
    this.vehicles = [
      {
        id: "TK001",
        lat: -6.776012,
        lng: 39.178326,
        driver: "John Doe",
        status: "In Transit",
      },
      {
        id: "TK002",
        lat: -6.786012,
        lng: 39.188326,
        driver: "Jane Smith",
        status: "Delivering",
      },
      {
        id: "TK003",
        lat: -6.766012,
        lng: 39.168326,
        driver: "Mike Johnson",
        status: "Returning",
      },
    ];
  }

  startTracking() {
    this.vehicles.forEach((vehicle) => {
      this.addVehicleMarker(vehicle);
    });

    // Simulate vehicle movement every 3 seconds
    setInterval(() => this.updateVehiclePositions(), 3000);
  }

  addVehicleMarker(vehicle) {
    const marker = new google.maps.Marker({
      position: { lat: vehicle.lat, lng: vehicle.lng },
      map: this.map,
      title: `Vehicle ${vehicle.id}`,
      icon: {
        url: "images/truck-icon.png",
        scaledSize: new google.maps.Size(32, 32),
      },
    });

    const infoWindow = new google.maps.InfoWindow({
      content: `
                <div class="vehicle-info">
                    <h3>Vehicle ${vehicle.id}</h3>
                    <p>Driver: ${vehicle.driver}</p>
                    <p>Status: ${vehicle.status}</p>
                </div>
            `,
    });

    marker.addListener("click", () => {
      infoWindow.open(this.map, marker);
    });

    this.markers.set(vehicle.id, marker);
  }

  updateVehiclePositions() {
    this.vehicles.forEach((vehicle) => {
      // Simulate movement by adding small random changes to coordinates
      vehicle.lat += (Math.random() - 0.5) * 0.001;
      vehicle.lng += (Math.random() - 0.5) * 0.001;

      const marker = this.markers.get(vehicle.id);
      if (marker) {
        marker.setPosition({ lat: vehicle.lat, lng: vehicle.lng });
      }
    });
  }

  getMapStyles() {
    return [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#7c93a3" }],
      },
      // Add more custom styles as needed
    ];
  }
}

// Initialize fleet tracking when the page loads
window.addEventListener("load", () => {
  const fleetTracker = new FleetTracker();
});
