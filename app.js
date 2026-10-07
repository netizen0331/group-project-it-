// Pairify homepage skeleton
// - Hash routing is ONLY for navigation between sections (SPA feel)
// - No login hashing/auth logic

const ROUTES = new Set(["home", "activity", "server", "friends", "login"]);

function getRouteFromHash() {
  const raw = window.location.hash || "#/home";
  const m = raw.match(/^#\/([a-z]+)$/i);
  const route = m ? m[1].toLowerCase() : "home";
  return ROUTES.has(route) ? route : "home";
}

function render(route) {
  // show/hide views
  document.querySelectorAll(".view").forEach(v => {
    const name = v.getAttribute("data-view");
    v.hidden = name !== route;
  });

  // nav active
  document.querySelectorAll(".nav-link").forEach(a => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === `#/${route}`);
  });

  // status route
  const routeText = document.getElementById("routeText");
  if (routeText) routeText.textContent = `#/${route}`;
}

function go(toHash) {
  window.location.hash = toHash;
}

// Placeholder state
let mockServerState = "Not connected";

function updateBadges() {
  const server = document.getElementById("serverState");
  if (server) server.textContent = mockServerState;
}

function wireEvents() {
  // Click delegation for links + buttons
  document.addEventListener("click", (e) => {
    const link = e.target.closest("[data-link]");
    if (link) {
      e.preventDefault();
      go(link.getAttribute("data-link"));
      return;
    }

    const actionEl = e.target.closest("[data-action]");
    if (!actionEl) return;

    const action = actionEl.getAttribute("data-action");

    if (action === "go") {
      const to = actionEl.getAttribute("data-to");
      if (to) go(to);
      return;
    }

    if (action === "setServer") {
      mockServerState = actionEl.getAttribute("data-value") || "Connected (mock)";
      updateBadges();
      return;
    }

    if (action === "noop") {
      // placeholder for modules
      console.log("[Pairify] Stub action clicked:", actionEl);
      return;
    }
  });

  // Keyboard support on brand
  const brand = document.querySelector(".brand");
  if (brand) {
    brand.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go("#/home");
      }
    });
  }

  window.addEventListener("hashchange", () => render(getRouteFromHash()));
}

function init() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  wireEvents();
  updateBadges();

  if (!window.location.hash) window.location.hash = "#/home";
  render(getRouteFromHash());
}

init();
