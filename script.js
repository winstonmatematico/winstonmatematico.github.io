document.getElementById("year").textContent = new Date().getFullYear();

/* Menu mobile */
const navToggle = document.getElementById("navToggle");
const siteNav = document.getElementById("siteNav");

navToggle.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

/* Tema claro/escuro */
const themeToggle = document.getElementById("themeToggle");
const root = document.documentElement;

function applyStoredTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      root.setAttribute("data-theme", saved);
      return;
    }
  } catch (e) {
    /* localStorage indisponível: segue com o tema do sistema */
  }
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", prefersDark ? "dark" : "light");
}

applyStoredTheme();

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme") === "dark" ? "dark" : "light";
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    /* segue sem salvar preferência */
  }
});

/* Animações ao rolar */
const revealEls = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealEls.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => observer.observe(el));

  // Rede de segurança: garante que nada fique invisível para sempre.
  window.setTimeout(() => {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }, 4000);
} else {
  revealEls.forEach((el) => el.classList.add("in-view"));
}

/* Simulador Fuzzy AHP */
const criteria = [
  { key: "Custo", inputId: "critCusto", valId: "valCusto", barId: "barCusto" },
  { key: "Segurança", inputId: "critSeguranca", valId: "valSeguranca", barId: "barSeguranca" },
  { key: "Prazo", inputId: "critPrazo", valId: "valPrazo", barId: "barPrazo" },
];

function centroid(value) {
  // Número fuzzy triangular (l, m, u) a partir do valor central, defuzzificado pelo centroide.
  const l = Math.max(1, value - 1);
  const m = value;
  const u = Math.min(9, value + 1);
  return (l + m + u) / 3;
}

function updateFuzzyDemo() {
  const defuzzified = criteria.map((c) => centroid(Number(document.getElementById(c.inputId).value)));
  const total = defuzzified.reduce((sum, v) => sum + v, 0);

  criteria.forEach((c, i) => {
    const weightPct = total > 0 ? (defuzzified[i] / total) * 100 : 0;
    document.getElementById(c.valId).textContent = document.getElementById(c.inputId).value;
    const bar = document.getElementById(c.barId);
    bar.style.width = weightPct.toFixed(1) + "%";
    bar.setAttribute("aria-label", c.key + ": " + weightPct.toFixed(0) + "% do peso");
  });
}

criteria.forEach((c) => {
  const input = document.getElementById(c.inputId);
  if (input) input.addEventListener("input", updateFuzzyDemo);
});

updateFuzzyDemo();
