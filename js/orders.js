class OrdersManagement {
  constructor() {
    this.initializeEventListeners();
    this.initializeOrderCharts();
    this.initializeOrderForm();
  }

  initializeEventListeners() {
    // New Order Button
    const newOrderBtn = document.getElementById("newOrderBtn");
    if (newOrderBtn) {
      newOrderBtn.addEventListener("click", () => this.showNewOrderModal());
    }

    // Search functionality
    const searchInput = document.querySelector(".search-orders input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) =>
        this.searchOrders(e.target.value)
      );
    }

    // Date filter
    const dateFilter = document.querySelector(".date-filter select");
    if (dateFilter) {
      dateFilter.addEventListener("change", (e) =>
        this.filterByDate(e.target.value)
      );
    }

    // Select all checkbox
    const selectAll = document.querySelector(".select-all");
    if (selectAll) {
      selectAll.addEventListener("change", (e) =>
        this.toggleSelectAll(e.target.checked)
      );
    }

    // Action buttons
    document.querySelectorAll(".action-buttons .btn-icon").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const action = e.currentTarget.getAttribute("title").toLowerCase();
        const orderId = this.getOrderIdFromRow(e.currentTarget.closest("tr"));
        this.handleOrderAction(action, orderId);
      });
    });

    // Export button
    const exportBtn = document.querySelector('[title="Export"]');
    if (exportBtn) {
      exportBtn.addEventListener("click", () => this.exportOrders());
    }
  }

  showNewOrderModal() {
    const modal = document.getElementById("newOrderModal");
    if (!modal) return;

    modal.classList.add("show");

    // Close button handlers
    const closeBtn = document.getElementById("closeModal");
    const cancelBtn = document.getElementById("cancelOrder");

    [closeBtn, cancelBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => modal.classList.remove("show"));
      }
    });
  }

  initializeOrderForm() {
    const addItemBtn = document.getElementById("addItemBtn");
    if (addItemBtn) {
      addItemBtn.addEventListener("click", () => this.addOrderItem());
    }

    // Form submission
    const form = document.querySelector(".order-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleOrderSubmission(form);
      });
    }
  }

  addOrderItem() {
    const itemsContainer = document.querySelector(".order-items");
    const newItem = document.createElement("div");
    newItem.className = "order-item";
    newItem.innerHTML = `
            <div class="item-details">
                <select class="item-select" required>
                    <option value="">Select Item</option>
                    ${this.getItemOptions()}
                </select>
                <input type="number" min="1" value="1" required>
                <span class="item-price">TZS 0.00</span>
            </div>
            <button type="button" class="btn-icon remove-item">
                <i class="fas fa-trash"></i>
            </button>
        `;

    itemsContainer.appendChild(newItem);

    // Add event listeners to new item
    this.initializeItemListeners(newItem);
  }

  initializeItemListeners(item) {
    const select = item.querySelector(".item-select");
    const quantity = item.querySelector('input[type="number"]');
    const removeBtn = item.querySelector(".remove-item");

    select.addEventListener("change", () => this.updateOrderSummary());
    quantity.addEventListener("input", () => this.updateOrderSummary());
    removeBtn.addEventListener("click", () => {
      item.remove();
      this.updateOrderSummary();
    });
  }

  getItemOptions() {
    // Sample items - replace with actual data
    const items = [
      { id: 1, name: "Standard Delivery", price: 25000 },
      { id: 2, name: "Express Delivery", price: 45000 },
      { id: 3, name: "Premium Delivery", price: 65000 },
    ];

    return items
      .map(
        (item) =>
          `<option value="${item.id}" data-price="${item.price}">
                ${item.name} - TZS ${item.price.toLocaleString()}
            </option>`
      )
      .join("");
  }

  updateOrderSummary() {
    let subtotal = 0;
    const deliveryFee = 15000; // Base delivery fee

    document.querySelectorAll(".order-item").forEach((item) => {
      const select = item.querySelector(".item-select");
      const quantity =
        parseInt(item.querySelector('input[type="number"]').value) || 0;
      const price = select.selectedOptions[0]?.dataset.price || 0;

      const itemTotal = quantity * price;
      item.querySelector(
        ".item-price"
      ).textContent = `TZS ${itemTotal.toLocaleString()}`;
      subtotal += itemTotal;
    });

    const total = subtotal + deliveryFee;

    document.querySelector(
      ".subtotal"
    ).textContent = `TZS ${subtotal.toLocaleString()}`;
    document.querySelector(
      ".delivery-fee"
    ).textContent = `TZS ${deliveryFee.toLocaleString()}`;
    document.querySelector(
      ".total-amount"
    ).textContent = `TZS ${total.toLocaleString()}`;
  }

  initializeOrderCharts() {
    const ctx = document.getElementById("orderAnalyticsChart").getContext("2d");
    this.orderChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Orders",
            data: [25, 32, 28, 35, 40, 38, 42],
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

  handleOrderSubmission(form) {
    const formData = new FormData(form);
    const orderData = {
      customer: {
        name: formData.get("customerName"),
        phone: formData.get("phone"),
        address: formData.get("address"),
      },
      items: Array.from(document.querySelectorAll(".order-item")).map(
        (item) => ({
          itemId: item.querySelector(".item-select").value,
          quantity: item.querySelector('input[type="number"]').value,
        })
      ),
    };

    // Submit order to backend
    console.log("Submitting order:", orderData);
    // Add API call here

    // Close modal and show success message
    document.getElementById("newOrderModal").classList.remove("show");
    this.showNotification("Order created successfully", "success");
  }

  handleOrderAction(action, orderId) {
    switch (action) {
      case "view":
        this.viewOrderDetails(orderId);
        break;
      case "edit":
        this.editOrder(orderId);
        break;
      case "more":
        this.showMoreOptions(orderId);
        break;
    }
  }

  showNotification(message, type = "success") {
    // Implement notification system
    alert(message); // Temporary implementation
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new OrdersManagement();
});
