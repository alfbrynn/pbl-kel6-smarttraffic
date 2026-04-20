/**
 * SMARTRAF Animation Utilities
 * Ripple, Parallax, IntersectionObserver scroll reveal
 */

// ── Ripple Effect ──────────────────────────────────────────
export function addRipple(e: MouseEvent, element: HTMLElement) {
  const existing = element.querySelector(".ripple-wave");
  if (existing) existing.remove();

  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  const ripple = document.createElement("span");
  ripple.className = "ripple-wave";
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    border-radius: 50%;
    background: rgba(255,255,255,0.25);
    transform: scale(0);
    animation: rippleAnim 0.55s ease-out forwards;
    pointer-events: none;
  `;
  element.style.position = "relative";
  element.style.overflow = "hidden";
  element.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
}

// Attach ripple to all .ripple elements
export function initRipple() {
  if (typeof window === "undefined") return;
  document.querySelectorAll<HTMLElement>(".ripple").forEach((el) => {
    el.addEventListener("click", (e) => addRipple(e as MouseEvent, el));
  });
}

// ── Parallax ──────────────────────────────────────────────
export function initParallax() {
  if (typeof window === "undefined") return;
  const hero = document.querySelector<HTMLElement>("[data-parallax]");
  if (!hero) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    const img = hero.querySelector<HTMLElement>("[data-parallax-img]");
    if (img) img.style.transform = `translateY(${scrollY * 0.35}px)`;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}

// ── Scroll Reveal (IntersectionObserver) ──────────────────
export function initScrollReveal() {
  if (typeof window === "undefined") return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

// ── Page Transition ────────────────────────────────────────
export function pageEnter(el: HTMLElement) {
  el.style.opacity = "0";
  el.style.transform = "translateY(16px) scale(0.99)";
  el.style.transition = "opacity 0.45s ease-out, transform 0.45s ease-out";
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0) scale(1)";
    });
  });
}
