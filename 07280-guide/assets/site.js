/* ===========================================================
   07-280 Study Guide — shared shell, nav, math, widgets
   Every page only writes <main>; this file builds the rest.
   =========================================================== */

const CHAPTERS = [
  { group: "Start here" },
  { slug: "index",               n: "",    title: "Home & roadmap" },
  { slug: "how-to-study",        n: "",    title: "How to use this guide" },

  { group: "Part I — Search" },
  { slug: "search-foundations",  n: "1",   title: "Search problems, BFS/DFS/UCS" },
  { slug: "informed-search",     n: "2",   title: "Heuristics, Greedy & A*" },
  { slug: "adversarial-search",  n: "3",   title: "Minimax, α-β, Expectimax" },
  { slug: "csps",                n: "4",   title: "Constraint Satisfaction" },

  { group: "Part II — Machine Learning" },
  { slug: "ml-formulation",      n: "5",   title: "ML problem formulation" },
  { slug: "decision-trees",      n: "6",   title: "Decision trees" },
  { slug: "information-theory",  n: "7",   title: "Entropy & mutual information" },
  { slug: "linear-regression",   n: "8",   title: "Linear regression" },
  { slug: "optimization",        n: "9",   title: "Optimization: GD & SGD" },
  { slug: "feature-engineering", n: "10",  title: "Feature engineering" },
  { slug: "logistic-regression", n: "11",  title: "Logistic regression" },

  { group: "Reference" },
  { slug: "practice",            n: "",    title: "Guided problems (Part I)" },
  { slug: "cheatsheet",          n: "",    title: "Formula cheat sheet" },
];

const PAGES = CHAPTERS.filter(c => c.slug);

function currentSlug() {
  const b = document.body.getAttribute("data-page");
  if (b) return b;
  const f = location.pathname.split("/").pop() || "index.html";
  return f.replace(/\.html$/, "") || "index";
}

function buildShell() {
  const slug = currentSlug();
  const me = PAGES.find(p => p.slug === slug);

  // ---- top bar ----
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `
    <button class="iconbtn" id="menuToggle" aria-label="Toggle navigation">☰</button>
    <a class="brand" href="index.html">07-280 <span>Field Guide</span></a>
    <span class="crumb">${me && me.slug !== "index" ? me.title : "Intro to AI &amp; ML"}</span>
    <span class="spacer"></span>
    <button class="iconbtn" id="themeToggle" title="Toggle light/dark">◐</button>`;

  // ---- sidebar ----
  const side = document.createElement("nav");
  side.className = "sidebar";
  side.innerHTML = CHAPTERS.map(c => {
    if (c.group) return `<h4>${c.group}</h4>`;
    const active = c.slug === slug ? " active" : "";
    const num = c.n ? `<span class="num">${c.n}</span>` : "";
    return `<a class="${active.trim()}" href="${c.slug}.html">${num}${c.title}</a>`;
  }).join("");

  // ---- wrap existing <main> ----
  const main = document.querySelector("main");
  const shell = document.createElement("div");
  shell.className = "shell";
  main.parentNode.insertBefore(shell, main);
  shell.appendChild(side);
  shell.appendChild(main);
  document.body.insertBefore(bar, shell);

  // ---- prev / next ----
  const i = PAGES.findIndex(p => p.slug === slug);
  if (i >= 0) {
    const prev = PAGES[i - 1], next = PAGES[i + 1];
    const nav = document.createElement("div");
    nav.className = "pagenav";
    nav.innerHTML =
      (prev ? `<a class="prev" href="${prev.slug}.html"><span class="lbl">Previous</span>${prev.title}</a>` : `<span style="flex:1"></span>`) +
      (next ? `<a class="next" href="${next.slug}.html"><span class="lbl">Next</span>${next.title}</a>` : `<span style="flex:1"></span>`);
    main.appendChild(nav);
  }

  document.getElementById("menuToggle").onclick = () => side.classList.toggle("open");
  const tt = document.getElementById("themeToggle");
  const stored = safeGet("theme");
  if (stored) document.documentElement.setAttribute("data-theme", stored);
  tt.onclick = () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const dark = cur ? cur === "dark"
                     : matchMedia("(prefers-color-scheme: dark)").matches;
    const nextTheme = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    safeSet("theme", nextTheme);
    document.dispatchEvent(new CustomEvent("themechange"));
  };
}

function safeGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

/* ---- auto table of contents from <h2 id> ---- */
function buildTOC() {
  const host = document.querySelector("[data-toc]");
  if (!host) return;
  const hs = [...document.querySelectorAll("main h2[id]")];
  if (!hs.length) { host.remove(); return; }
  host.className = "toc";
  host.innerHTML = `<div class="t">On this page</div><ol>` +
    hs.map(h => `<li><a href="#${h.id}">${h.textContent}</a></li>`).join("") + `</ol>`;
}

/* ---- quizzes: <div class="quiz" data-answer="1"> ---- */
function wireQuizzes() {
  document.querySelectorAll(".quiz").forEach(q => {
    const ans = parseInt(q.dataset.answer, 10);
    const opts = [...q.querySelectorAll(".opt")];
    const why = q.querySelector(".why");
    opts.forEach((o, idx) => {
      o.onclick = () => {
        opts.forEach((x, j) => {
          x.classList.remove("right", "wrong");
          if (j === ans) x.classList.add("right");
        });
        if (idx !== ans) o.classList.add("wrong");
        if (why) why.classList.add("show");
      };
    });
  });
}

/* ---- range sliders with a live <output class="val"> ---- */
function wireRanges() {
  document.querySelectorAll('input[type=range][data-out]').forEach(r => {
    const out = document.getElementById(r.dataset.out);
    const sync = () => { if (out) out.textContent = r.dataset.fmt === "int" ? r.value : (+r.value).toFixed(r.dataset.dp || 2); };
    r.addEventListener("input", sync); sync();
  });
}

/* ---- KaTeX ---- */
function renderMath() {
  if (!window.renderMathInElement) return;
  renderMathInElement(document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "\\[", right: "\\]", display: true },
      { left: "$", right: "$", display: false },
      { left: "\\(", right: "\\)", display: false },
    ],
    throwOnError: false,
    macros: {
      "\\1": "\\mathbb{1}",
      "\\R": "\\mathbb{R}",
      "\\E": "\\mathbb{E}",
      "\\X": "\\mathcal{X}",
      "\\Y": "\\mathcal{Y}",
      "\\H": "\\mathcal{H}",
      "\\D": "\\mathcal{D}",
      "\\argmin": "\\operatorname*{arg\\,min}",
      "\\argmax": "\\operatorname*{arg\\,max}",
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  buildShell();
  buildTOC();
  wireQuizzes();
  wireRanges();
  renderMath();
  document.dispatchEvent(new CustomEvent("shellready"));
});

/* ---------- small helpers available to page scripts ---------- */
window.SG = {
  /** read a CSS custom property (re-read after themechange) */
  css: name => getComputedStyle(document.documentElement).getPropertyValue(name).trim(),
  /** linear map */
  lerp: (a, b, t) => a + (b - a) * t,
  clamp: (v, lo, hi) => Math.min(hi, Math.max(lo, v)),
  /** svg element helper */
  el(tag, attrs = {}, text) {
    const e = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (text != null) e.textContent = text;
    return e;
  },
};
