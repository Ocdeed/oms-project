class AnalyticsDashboard {
  constructor() {
    this.initializeCharts();
    this.initializeMap();
    this.initializeEventListeners();
    this.startRealTimeUpdates();
  }

  initializeCharts() {
    this.initializeRevenueChart();
    this.initializeCostChart();
    this.initializeTrendChart();
  }

  initializeRevenueChart() {
    const ctx = document.getElementById("revenueChart").getContext("2d");
    this.revenueChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [
          {
            label: "Revenue",
            data: [
              185000000, 190000000, 205000000, 215000000, 235000000, 245000000,
            ],
            borderColor: "#0073e6",
            tension: 0.4,
            fill: true,
            backgroundColor: "rgba(0, 115, 230, 0.1)",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => `TZS ${this.formatNumber(context.parsed.y)}`,
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `TZS ${this.formatNumber(value)}`,
            },
          },
        },
      },
    });
  }

  initializeCostChart() {
    const ctx = document.getElementById("costChart").getContext("2d");
    this.costChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Fuel", "Maintenance", "Staff", "Other"],
        datasets: [
          {
            data: [45, 25, 20, 10],
            backgroundColor: ["#3b82f6", "#10b981", "#f59e0b", "#6b7280"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        cutout: "70%",
      },
    });
  }

  initializeTrendChart() {
    const ctx = document.getElementById("trendChart").getContext("2d");
    this.trendChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Q1", "Q2", "Q3", "Q4"],
        datasets: [
          {
            label: "Growth Rate",
            data: [12.5, 15.8, 18.3, 21.2],
            backgroundColor: "#0073e6",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => `${value}%`,
            },
          },
        },
      },
    });
  }

  initializeMap() {
    const mapOptions = {
      center: { lat: -6.776012, lng: 39.178326 },
      zoom: 10,
      styles: this.getMapStyles(),
    };

    this.map = new google.maps.Map(
      document.getElementById("routeMap"),
      mapOptions
    );

    this.addRouteLines();
    this.addPerformanceHeatmap();
  }

  addRouteLines() {
    // Sample route data
    const routes = [
      {
        path: [
          { lat: -6.776012, lng: 39.178326 }, // Dar es Salaam
          { lat: -6.165917, lng: 39.202641 }, // Zanzibar
        ],
        performance: "high",
      },
    ];

    routes.forEach((route) => {
      new google.maps.Polyline({
        path: route.path,
        geodesic: true,
        strokeColor: route.performance === "high" ? "#10b981" : "#f59e0b",
        strokeOpacity: 1.0,
        strokeWeight: 3,
        map: this.map,
      });
    });
  }

  addPerformanceHeatmap() {
    // Implement heatmap visualization for route performance
  }

  initializeEventListeners() {
    // Date range selectors
    document.querySelectorAll(".date-range button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.updateDateRange(e.target.textContent.toLowerCase());
      });
    });

    // Chart type toggles
    document.querySelectorAll(".chart-type button").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.toggleChartType(e.target.closest("button"));
      });
    });

    // Export buttons
    document.querySelectorAll('[title="Download Report"]').forEach((btn) => {
      btn.addEventListener("click", () => this.exportReport());
    });
  }

  updateDateRange(range) {
    // Update charts based on selected date range
    const ranges = {
      week: { unit: "day", count: 7 },
      month: { unit: "week", count: 4 },
      year: { unit: "month", count: 12 },
    };

    this.fetchAnalyticsData(ranges[range]).then((data) =>
      this.updateCharts(data)
    );
  }

  async fetchAnalyticsData(range) {
    // Simulate API call - replace with actual API endpoint
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          revenue: this.generateRandomData(range.count),
          costs: this.generateRandomData(range.count),
          trends: this.generateRandomData(range.count),
        });
      }, 500);
    });
  }

  updateCharts(data) {
    this.revenueChart.data.datasets[0].data = data.revenue;
    this.revenueChart.update();

    this.costChart.data.datasets[0].data = data.costs;
    this.costChart.update();

    this.trendChart.data.datasets[0].data = data.trends;
    this.trendChart.update();
  }

  toggleChartType(button) {
    const chartTypes = {
      pie: this.initializePieChart.bind(this),
      bar: this.initializeBarChart.bind(this),
    };

    document.querySelectorAll(".chart-type button").forEach((btn) => {
      btn.classList.remove("active");
    });
    button.classList.add("active");

    const type = button.getAttribute("title").toLowerCase().split(" ")[0];
    if (chartTypes[type]) {
      chartTypes[type]();
    }
  }

  startRealTimeUpdates() {
    // Update metrics every 5 minutes
    setInterval(() => {
      this.updateMetrics();
    }, 300000);

    // Update route performance every minute
    setInterval(() => {
      this.updateRoutePerformance();
    }, 60000);
  }

  updateMetrics() {
    // Simulate real-time metric updates
    const metrics = document.querySelectorAll(".metric .value");
    metrics.forEach((metric) => {
      const currentValue = parseFloat(
        metric.textContent.replace(/[^0-9.-]+/g, "")
      );
      const newValue = currentValue * (1 + (Math.random() - 0.5) * 0.1);
      metric.textContent = this.formatCurrency(newValue);
    });
  }

  updateRoutePerformance() {
    // Update route performance indicators
  }

  exportReport() {
    // Implement report export functionality
    console.log("Exporting analytics report...");
    // Add export logic here
  }

  formatNumber(number) {
    return new Intl.NumberFormat("en-US").format(Math.round(number));
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat("sw-TZ", {
      style: "currency",
      currency: "TZS",
    }).format(amount);
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

  generateRandomData(count) {
    return Array.from(
      { length: count },
      () => Math.floor(Math.random() * 100000000) + 50000000
    );
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new AnalyticsDashboard();
});
