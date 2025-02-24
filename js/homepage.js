document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".main-header");
  const mobileToggle = document.querySelector(".mobile-toggle");
  let lastScroll = 0;

  // Header scroll effect
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 200) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Mobile menu toggle
  if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
      mobileToggle.classList.toggle("active");
      document.querySelector(".main-nav").classList.toggle("active");
    });
  }

  // Add hover effect for navigation items
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)";
    });

    link.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });

  // Initialize search functionality
  const searchToggle = document.getElementById("searchToggle");
  if (searchToggle) {
    const searchPopup = document.querySelector(".search-popup");

    searchToggle.addEventListener("click", () => {
      searchPopup.classList.toggle("active");
      if (searchPopup.classList.contains("active")) {
        searchPopup.querySelector("input").focus();
      }
    });

    // Close search on escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && searchPopup.classList.contains("active")) {
        searchPopup.classList.remove("active");
      }
    });
  }

  initializeSearch();
  initializeSolutions();

  // Initialize blog slider
  new BlogSlider();

  // Initialize testimonials slider
  new TestimonialsSlider();
});

// Enhanced Search Functionality
function initializeSearch() {
  const searchInput = document.getElementById("searchInput");
  const searchPopup = document.querySelector(".search-popup");
  const searchToggle = document.getElementById("searchToggle");
  let selectedIndex = -1;

  // Toggle search popup
  searchToggle.addEventListener("click", () => {
    searchPopup.classList.toggle("active");
    if (searchPopup.classList.contains("active")) {
      searchInput.focus();
    }
  });

  // Close search on outside click
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".search-trigger") &&
      searchPopup.classList.contains("active")
    ) {
      searchPopup.classList.remove("active");
      selectedIndex = -1;
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Command/Ctrl + K to open search
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      searchPopup.classList.add("active");
      searchInput.focus();
    }

    // Escape to close search
    if (e.key === "Escape" && searchPopup.classList.contains("active")) {
      searchPopup.classList.remove("active");
      selectedIndex = -1;
    }

    // Arrow keys for navigation
    if (searchPopup.classList.contains("active")) {
      const results = document.querySelectorAll(".result-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, results.length - 1);
        updateSelection(results);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, 0);
        updateSelection(results);
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        results[selectedIndex].click();
      }
    }
  });

  // Live search functionality
  searchInput.addEventListener("input", debounce(handleSearch, 300));
}

function updateSelection(results) {
  results.forEach((result, index) => {
    result.classList.toggle("selected", index === selectedIndex);
    if (index === selectedIndex) {
      result.scrollIntoView({ block: "nearest" });
    }
  });
}

function handleSearch(e) {
  const query = e.target.value.toLowerCase();
  // Implement your search logic here
  console.log("Searching for:", query);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Blog Slider Functionality
class BlogSlider {
  constructor() {
    this.slider = document.querySelector(".slider-track");
    this.cards = document.querySelectorAll(".blog-card");
    this.prevBtn = document.querySelector(".slider-arrow.prev");
    this.nextBtn = document.querySelector(".slider-arrow.next");
    this.progressBar = document.querySelector(".progress-bar");

    this.cardWidth = this.cards[0].offsetWidth + 30; // Including gap
    this.currentIndex = 0;
    this.maxIndex =
      this.cards.length - Math.floor(this.slider.offsetWidth / this.cardWidth);

    this.initializeSlider();
    this.startAutoPlay();
  }

  initializeSlider() {
    // Event listeners for controls
    this.prevBtn?.addEventListener("click", () => this.slide("prev"));
    this.nextBtn?.addEventListener("click", () => this.slide("next"));

    // Touch events for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    this.slider.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    this.slider.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) this.slide("next");
      if (touchStartX - touchEndX < -50) this.slide("prev");
    });

    // Update progress bar initially
    this.updateProgress();
  }

  slide(direction) {
    if (direction === "next" && this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else if (direction === "prev" && this.currentIndex > 0) {
      this.currentIndex--;
    }

    const translateX = -this.currentIndex * this.cardWidth;
    this.slider.style.transform = `translateX(${translateX}px)`;
    this.updateProgress();
  }

  updateProgress() {
    if (this.progressBar) {
      const progress = (this.currentIndex / this.maxIndex) * 100;
      this.progressBar.style.width = `${progress}%`;
    }
  }

  startAutoPlay() {
    setInterval(() => {
      if (this.currentIndex >= this.maxIndex) {
        this.currentIndex = -1;
      }
      this.slide("next");
    }, 5000); // Slide every 5 seconds
  }
}

// Testimonials Slider
class TestimonialsSlider {
  constructor() {
    this.track = document.querySelector(".testimonials-track");
    this.cards = document.querySelectorAll(".testimonial-card");
    this.currentIndex = 0;
    this.progressDots = document.querySelector(".progress-dots");

    this.init();
  }

  init() {
    // Create progress dots
    this.cards.forEach((_, index) => {
      const dot = document.createElement("div");
      dot.className = `dot ${index === 0 ? "active" : ""}`;
      dot.addEventListener("click", () => this.goToSlide(index));
      this.progressDots.appendChild(dot);
    });

    // Clone cards for infinite scroll
    const clonedCards = Array.from(this.cards).map((card) =>
      card.cloneNode(true)
    );
    clonedCards.forEach((card) => this.track.appendChild(card));

    // Start auto-play
    this.startAutoPlay();

    // Add touch support
    this.addTouchSupport();
  }

  goToSlide(index) {
    this.currentIndex = index;
    const offset = -this.currentIndex * (this.cards[0].offsetWidth + 30);
    this.track.style.transform = `translateX(${offset}px)`;

    // Update dots
    document.querySelectorAll(".dot").forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });
  }

  startAutoPlay() {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.cards.length;
      this.goToSlide(this.currentIndex);
    }, 5000);
  }

  addTouchSupport() {
    let startX = 0;
    let currentTranslate = 0;

    this.track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      this.track.style.transition = "none";
    });

    this.track.addEventListener("touchmove", (e) => {
      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      const cardWidth = this.cards[0].offsetWidth + 30;
      currentTranslate = -this.currentIndex * cardWidth + diff;
      this.track.style.transform = `translateX(${currentTranslate}px)`;
    });

    this.track.addEventListener("touchend", (e) => {
      this.track.style.transition =
        "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
      const cardWidth = this.cards[0].offsetWidth + 30;
      const movedBy = e.changedTouches[0].clientX - startX;

      if (Math.abs(movedBy) > cardWidth / 3) {
        if (movedBy > 0 && this.currentIndex > 0) {
          this.currentIndex--;
        } else if (movedBy < 0 && this.currentIndex < this.cards.length - 1) {
          this.currentIndex++;
        }
      }

      this.goToSlide(this.currentIndex);
    });
  }
}

// Solutions Section Interactivity
function initializeSolutions() {
  const industryButtons = document.querySelectorAll(".industry-btn");
  const solutionCards = document.querySelectorAll(".solution-card");

  // Industry selector functionality
  industryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Update active state
      industryButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Animate solutions based on industry
      const industry = btn.dataset.industry;
      animateSolutions(industry);
    });
  });

  // Animate solutions based on selected industry
  function animateSolutions(industry) {
    solutionCards.forEach((card, index) => {
      // Add stagger effect
      setTimeout(() => {
        card.style.transform = "scale(0.95)";
        card.style.opacity = "0.5";

        setTimeout(() => {
          card.style.transform = "scale(1)";
          card.style.opacity = "1";
        }, 200);
      }, index * 100);
    });
  }

  // Add parallax effect to solution cards
  document.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    solutionCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const moveX = (clientX - cardCenterX) * 0.01;
      const moveY = (clientY - cardCenterY) * 0.01;

      card.style.transform = `perspective(1000px) rotateY(${moveX}deg) rotateX(${-moveY}deg)`;
    });
  });
}
