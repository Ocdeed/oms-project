document.addEventListener("DOMContentLoaded", () => {
  const mobileToggle = document.querySelector(".mobile-toggle");
  const navList = document.querySelector(".nav-list");
  const header = document.querySelector(".main-header");
  let lastScroll = 0;

  // Mobile menu toggle
  mobileToggle?.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    navList.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-list") && !e.target.closest(".mobile-toggle")) {
      mobileToggle?.classList.remove("active");
      navList?.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Header scroll behavior
  window.addEventListener("scroll", () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    header.classList.toggle("scrolled", currentScroll > 50);

    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });

  // Handle dropdown menus on mobile
  const dropdownLinks = document.querySelectorAll(".nav-link.has-dropdown");

  dropdownLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        const dropdown = link.nextElementSibling;
        dropdown.style.display =
          dropdown.style.display === "block" ? "none" : "block";
      }
    });
  });

  // Resize handler
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      navList?.classList.remove("active");
      mobileToggle?.classList.remove("active");
      document.body.classList.remove("menu-open");

      // Reset dropdown styles
      document.querySelectorAll(".dropdown-menu").forEach((dropdown) => {
        dropdown.style.display = "";
      });
    }
  });
});
