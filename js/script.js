// script.js
(() => {
  "use strict";

  // ----------------------------
  // Config
  // ----------------------------
  const SKILLS = [
    "Python", "C/C++", "Embedded C", "ROS", "MATLAB/Simulink",
    "Control Systems", "Robotics", "CAD (Fusion 360)", "Git/GitHub",
    "Machine Learning", "Linux", "Technical Writing"
  ];

  const THEME_STORAGE_KEY = "cv_theme"; // "light" | "dark"

  // ----------------------------
  // Helpers
  // ----------------------------
  const qs = (sel, root = document) => root.querySelector(sel);

  function setTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");

    const btn = qs("#themeToggle");
    if (btn) {
      btn.setAttribute("aria-pressed", String(isDark));
      btn.textContent = isDark ? "Light mode" : "Dark mode";
    }
  }

  function loadTheme() {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light") return saved;

    // Default: follow system preference
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  // ----------------------------
  // Skills rendering
  // ----------------------------
  function renderSkills() {
    // Support either an id or a class container
    const container = qs("#skills-container") || qs(".skills-container");
    if (!container) return; // page section might not exist

    // Avoid duplicating skills if script runs twice
    const alreadyHasSkills = container.querySelector(".skill");
    if (alreadyHasSkills) return;

    const frag = document.createDocumentFragment();
    SKILLS.forEach((skill) => {
      const el = document.createElement("div");
      el.className = "skill";
      el.textContent = skill;
      frag.appendChild(el);
    });
    container.appendChild(frag);
  }

  // ----------------------------
  // Theme toggle button (no inline styles)
  // ----------------------------
  function ensureThemeToggle() {
    // If you already have a button in HTML, reuse it
    let btn = qs("#themeToggle");

    if (!btn) {
      btn = document.createElement("button");
      btn.id = "themeToggle";
      btn.type = "button";
      btn.className = "theme-toggle"; // define styling in CSS
      btn.setAttribute("aria-label", "Toggle theme");
      btn.setAttribute("aria-pressed", "false");
      document.body.appendChild(btn);
    }

    btn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-theme");
      setTheme(isDark ? "light" : "dark");
    });

    // Apply initial theme and label
    setTheme(loadTheme());
  }

  // ----------------------------
  // Contact form handler (FormSubmit)
  // ----------------------------
  function setupContactForm() {
    const form = qs("#emailForm");
    if (!form) return;

    const submitBtn = form.querySelector(".submit-btn");
    const statusNode = (() => {
      // Reuse existing status node if present
      let node = qs("#formStatus");
      if (!node) {
        node = document.createElement("div");
        node.id = "formStatus";
        node.className = "form-confirmation";
        node.setAttribute("role", "status");
        node.setAttribute("aria-live", "polite");
        node.style.display = "none"; // CSS can override if you prefer
        form.insertAdjacentElement("afterend", node);
      }
      return node;
    })();

    async function handleSubmit(e) {
      e.preventDefault();

      if (!submitBtn) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Hide previous status
      statusNode.style.display = "none";
      statusNode.classList.remove("success", "error");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" } // helps some services respond cleanly
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        form.reset();
        statusNode.classList.add("success");
        statusNode.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully. I will reply soon.';
        statusNode.style.display = "block";

        // auto-hide
        window.setTimeout(() => {
          statusNode.style.display = "none";
        }, 5000);
      } catch (err) {
        console.error("Form error:", err);
        statusNode.classList.add("error");
        statusNode.innerHTML = '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
        statusNode.style.display = "block";
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    }

    form.addEventListener("submit", handleSubmit);
  }

  // ----------------------------
  // Init
  // ----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderSkills();
    ensureThemeToggle();
    setupContactForm();
  });
})();
