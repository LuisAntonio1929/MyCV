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
    if (!container) return;

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
    let btn = qs("#themeToggle");

    if (!btn) {
      btn = document.createElement("button");
      btn.id = "themeToggle";
      btn.type = "button";
      btn.className = "theme-toggle";
      btn.setAttribute("aria-label", "Toggle theme");
      btn.setAttribute("aria-pressed", "false");
      document.body.appendChild(btn);
    }

    btn.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark-theme");
      setTheme(isDark ? "light" : "dark");
    });

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
      let node = qs("#formStatus");
      if (!node) {
        node = document.createElement("div");
        node.id = "formStatus";
        node.className = "form-confirmation";
        node.setAttribute("role", "status");
        node.setAttribute("aria-live", "polite");
        node.style.display = "none";
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

      statusNode.style.display = "none";
      statusNode.classList.remove("success", "error");

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { "Accept": "application/json" }
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        form.reset();
        statusNode.classList.add("success");
        statusNode.innerHTML =
          '<i class="fas fa-check-circle"></i> Message sent successfully. I will reply soon.';
        statusNode.style.display = "block";

        window.setTimeout(() => {
          statusNode.style.display = "none";
        }, 5000);
      } catch (err) {
        console.error("Form error:", err);
        statusNode.classList.add("error");
        statusNode.innerHTML =
          '<i class="fas fa-exclamation-circle"></i> Something went wrong. Please try again.';
        statusNode.style.display = "block";
      } finally {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
      }
    }

    form.addEventListener("submit", handleSubmit);
  }

  // ----------------------------
  // Achievements horizontal slider (prev/next + friendly behavior)
  // Requires:
  //  - track: #achievementsTrack
  //  - buttons: .achievements-nav.prev / .achievements-nav.next
  // ----------------------------
  function setupAchievementsSlider() {
    const track = qs("#achievementsTrack");
    if (!track) return;

    const prevBtn = qs(".achievements-nav.prev");
    const nextBtn = qs(".achievements-nav.next");

    function getScrollStep() {
      const card = track.querySelector(".achievement-item");
      if (!card) return 320;
      const gap = 18; // keep in sync with CSS gap
      return card.getBoundingClientRect().width + gap;
    }

    function updateNavVisibility() {
      const epsilon = 2;
      const maxScrollLeft = track.scrollWidth - track.clientWidth;

      const atStart = track.scrollLeft <= epsilon;
      const atEnd = track.scrollLeft >= (maxScrollLeft - epsilon);

      if (prevBtn) prevBtn.style.visibility = atStart ? "hidden" : "visible";
      if (nextBtn) nextBtn.style.visibility = atEnd ? "hidden" : "visible";
    }

    function scrollByCard(direction) {
      track.scrollBy({ left: direction * getScrollStep(), behavior: "smooth" });
    }

    prevBtn?.addEventListener("click", () => scrollByCard(-1));
    nextBtn?.addEventListener("click", () => scrollByCard(1));

    track.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateNavVisibility);
    });
    window.addEventListener("resize", updateNavVisibility);

    updateNavVisibility();
  }

  // ----------------------------
  // Experience vertical slider (up/down + snap-friendly behavior)
  // Requires:
  //  - track: #experienceTrack
  //  - buttons: .experience-nav.up / .experience-nav.down
  // ----------------------------
  function setupExperienceSlider() {
    const track = qs("#experienceTrack");
    if (!track) return;

    const upBtn = qs(".experience-nav.up");
    const downBtn = qs(".experience-nav.down");

    function getScrollStep() {
      const card = track.querySelector(".experience-item");
      if (!card) return 260;
      const gap = 18; // keep in sync with CSS gap
      return card.getBoundingClientRect().height + gap;
    }

    function updateNavVisibility() {
      const epsilon = 2;
      const maxScrollTop = track.scrollHeight - track.clientHeight;

      const atTop = track.scrollTop <= epsilon;
      const atBottom = track.scrollTop >= (maxScrollTop - epsilon);

      if (upBtn) upBtn.style.visibility = atTop ? "hidden" : "visible";
      if (downBtn) downBtn.style.visibility = atBottom ? "hidden" : "visible";
    }

    function scrollByCard(direction) {
      track.scrollBy({ top: direction * getScrollStep(), behavior: "smooth" });
    }

    upBtn?.addEventListener("click", () => scrollByCard(-1));
    downBtn?.addEventListener("click", () => scrollByCard(1));

    // Keyboard support when focused (tabindex="0" on the track)
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        scrollByCard(-1);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        scrollByCard(1);
      }
    });

    track.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateNavVisibility);
    });
    window.addEventListener("resize", updateNavVisibility);

    updateNavVisibility();
  }

  // ----------------------------
  // Init
  // ----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderSkills();
    ensureThemeToggle();
    setupContactForm();
    setupAchievementsSlider();
    setupExperienceSlider(); // ✅ added
  });
})();


