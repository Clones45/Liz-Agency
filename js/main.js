/* ==========================================================================
   Elite Integrity Marketing Solutions — site interactions
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("is-ready");

  initNav();
  initMobileMenu();
  initCursor();
  initMagnetic();
  initReveals();
  initCounters();
  initMarquee();
  initHeroParallax();
  initPortfolioFilter();
  initContactForm();
});

/* -------------------------------------------------------------------------
   Sticky nav background on scroll
   ------------------------------------------------------------------------- */
function initNav() {
  const nav = document.querySelector(".nav");
  if (!nav) return;

  const setState = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  setState();
  window.addEventListener("scroll", setState, { passive: true });
}

/* -------------------------------------------------------------------------
   Mobile menu
   ------------------------------------------------------------------------- */
function initMobileMenu() {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".mobile-menu");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
    menu.classList.toggle("is-open");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      menu.classList.remove("is-open");
    });
  });
}

/* -------------------------------------------------------------------------
   Custom cursor (dot + trailing ring), grows over interactive elements
   ------------------------------------------------------------------------- */
function initCursor() {
  if (window.matchMedia("(hover: none)").matches) return;

  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  document.body.append(dot, ring);

  const hasGsap = typeof gsap !== "undefined";
  const moveDot = hasGsap
    ? gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3" })
    : (x) => (dot.style.left = `${x}px`);
  const moveDotY = hasGsap ? gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3" }) : null;
  const moveRing = hasGsap
    ? gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" })
    : (x) => (ring.style.left = `${x}px`);
  const moveRingY = hasGsap ? gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" }) : null;

  window.addEventListener("mousemove", (e) => {
    if (hasGsap) {
      moveDot(e.clientX);
      moveDotY(e.clientY);
      moveRing(e.clientX);
      moveRingY(e.clientY);
    } else {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      ring.style.left = `${e.clientX}px`;
      ring.style.top = `${e.clientY}px`;
    }
  });

  const targets = "a, button, .card, .filter-btn, input, textarea, select";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(targets)) ring.classList.add("is-active");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(targets)) ring.classList.remove("is-active");
  });
}

/* -------------------------------------------------------------------------
   Magnetic buttons — nudge toward the cursor within a radius
   ------------------------------------------------------------------------- */
function initMagnetic() {
  if (typeof gsap === "undefined" || window.matchMedia("(hover: none)").matches) return;

  document.querySelectorAll(".btn-primary, .btn-ghost").forEach((btn) => {
    const strength = 22;

    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const relX = e.clientX - rect.left - rect.width / 2;
      const relY = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: (relX / rect.width) * strength,
        y: (relY / rect.height) * strength,
        duration: 0.3,
        ease: "power3",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/* -------------------------------------------------------------------------
   Scroll reveals via GSAP ScrollTrigger (falls back to IntersectionObserver)
   ------------------------------------------------------------------------- */
function initReveals() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    items.forEach((el, i) => {
      const delay = Number(el.dataset.revealDelay || (i % 3) * 0.08);
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay,
            ease: "power3.out",
          });
          el.classList.add("is-visible");
        },
      });
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
   Animated counters for stat numbers ([data-count-to])
   ------------------------------------------------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseFloat(el.dataset.countTo);
    const suffix = el.dataset.countSuffix || "";
    const decimals = el.dataset.countTo.includes(".") ? 1 : 0;
    const obj = { val: 0 };

    if (typeof gsap !== "undefined") {
      gsap.to(obj, {
        val: target,
        duration: 1.8,
        ease: "power2.out",
        onUpdate: () => (el.textContent = obj.val.toFixed(decimals) + suffix),
      });
    } else {
      el.textContent = target.toFixed(decimals) + suffix;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* -------------------------------------------------------------------------
   Duplicate marquee content for seamless infinite scroll
   ------------------------------------------------------------------------- */
function initMarquee() {
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });
}

/* -------------------------------------------------------------------------
   Hero blob subtle parallax on mouse move
   ------------------------------------------------------------------------- */
function initHeroParallax() {
  const hero = document.querySelector(".hero");
  const blobs = document.querySelectorAll(".hero-blob");
  if (!hero || !blobs.length || typeof gsap === "undefined") return;

  hero.addEventListener("mousemove", (e) => {
    const { innerWidth, innerHeight } = window;
    const relX = (e.clientX / innerWidth - 0.5) * 2;
    const relY = (e.clientY / innerHeight - 0.5) * 2;

    blobs.forEach((blob, i) => {
      const factor = i === 0 ? 26 : 16;
      gsap.to(blob, {
        x: relX * factor,
        y: relY * factor,
        duration: 1.2,
        ease: "power3.out",
      });
    });
  });
}

/* -------------------------------------------------------------------------
   Portfolio filter buttons
   ------------------------------------------------------------------------- */
function initPortfolioFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll("[data-category]");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;

      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        if (typeof gsap !== "undefined") {
          gsap.to(card, {
            opacity: show ? 1 : 0,
            scale: show ? 1 : 0.94,
            duration: 0.3,
            onStart: () => {
              if (show) card.style.display = "";
            },
            onComplete: () => {
              if (!show) card.style.display = "none";
            },
          });
        } else {
          card.style.display = show ? "" : "none";
        }
      });
    });
  });
}

/* -------------------------------------------------------------------------
   Contact form — client-side validation + placeholder submit
   NOTE: no backend is wired yet. Replace the block marked below with a real
   submit (e.g. fetch() to a Formspree/backend endpoint) when one exists.
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = form.querySelector(".form-status");

  const validators = {
    name: (v) => v.trim().length > 1,
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
    message: (v) => v.trim().length > 9,
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    form.querySelectorAll("[data-validate]").forEach((input) => {
      const field = input.closest(".field");
      const rule = validators[input.dataset.validate];
      const ok = rule ? rule(input.value) : input.value.trim().length > 0;
      field.classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });

    if (!valid) {
      status.textContent = "";
      status.classList.remove("is-visible");
      return;
    }

    /* -----------------------------------------------------------------
       TODO: connect a real endpoint here, e.g.:
       fetch("https://formspree.io/f/YOUR_FORM_ID", {
         method: "POST",
         headers: { Accept: "application/json" },
         body: new FormData(form),
       });
       ----------------------------------------------------------------- */

    status.textContent = "Thanks — your message is in. We'll reply within one business day.";
    status.classList.add("is-visible");
    form.reset();
  });

  form.querySelectorAll("[data-validate]").forEach((input) => {
    input.addEventListener("input", () => {
      input.closest(".field").classList.remove("has-error");
    });
  });
}
