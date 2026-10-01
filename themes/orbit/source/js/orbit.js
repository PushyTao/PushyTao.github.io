import { initializeSearch } from "./search.js";
import { initializePoetry } from "./poetry.js";

initializePoetry();
initializeSearch();

const root = document.documentElement;
const themeButtons = document.querySelectorAll("[data-theme-toggle]");
function applyTheme(theme) {
  root.dataset.theme = theme;
  themeButtons.forEach((button) => {
    button.setAttribute(
      "aria-label",
      theme === "dark" ? "切换到浅色主题" : "切换到深色主题",
    );
    button.setAttribute("aria-pressed", String(theme === "light"));
  });
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#080e1a" : "#f5f8fc");
}
let initialTheme = root.dataset.theme || "dark";
try {
  const saved = localStorage.getItem("orbit-theme");
  if (saved === "light" || saved === "dark") initialTheme = saved;
} catch {
  /* Browsing with storage disabled still supports theme switching. */
}
applyTheme(initialTheme);
themeButtons.forEach((button) =>
  button.addEventListener("click", () => {
    const theme = root.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(theme);
    try {
      localStorage.setItem("orbit-theme", theme);
    } catch {
      /* Persistence is optional. */
    }
  }),
);

const menuButton = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("#site-nav");
if (menuButton && nav) {
  const setMenu = (open) => {
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "收起导航" : "展开导航");
    nav.classList.toggle("is-open", open);
  };
  menuButton.addEventListener("click", () =>
    setMenu(menuButton.getAttribute("aria-expanded") !== "true"),
  );
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });
  document.addEventListener("click", (event) => {
    if (!nav.contains(event.target) && !menuButton.contains(event.target))
      setMenu(false);
  });
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      menuButton.getAttribute("aria-expanded") === "true"
    ) {
      setMenu(false);
      menuButton.focus();
    }
  });
}

const cards = [...document.querySelectorAll("[data-post-card]")];
const filters = [...document.querySelectorAll("[data-filter]")];
const belongsTo = (card, category) =>
  category === "all" || card.dataset.category.split(",").includes(category);
filters.forEach((button) => {
  if (!button.querySelector("span")) {
    const count = document.createElement("span");
    count.textContent = cards.filter((card) =>
      belongsTo(card, button.dataset.filter),
    ).length;
    button.append(count);
  }
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visible = 0;
    cards.forEach((card) => {
      card.hidden = !belongsTo(card, category);
      if (!card.hidden) visible++;
    });
    filters.forEach((filter) => {
      const active = filter === button;
      filter.classList.toggle("active", active);
      filter.setAttribute("aria-pressed", String(active));
    });
    const counter = document.querySelector("#filter-count");
    if (counter) counter.textContent = `${visible} 篇文章`;
    const empty = document.querySelector("#filter-empty");
    if (empty) empty.hidden = visible !== 0;
  });
});

async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText)
      throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    /* An insecure context or denied permission can use the legacy path. */
  }
  const active = document.activeElement;
  const selection = window.getSelection();
  const ranges = selection
    ? Array.from({ length: selection.rangeCount }, (_, i) =>
        selection.getRangeAt(i),
      )
    : [];
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("aria-hidden", "true");
  field.style.cssText = "position:fixed;top:0;left:-9999px;";
  document.body.append(field);
  field.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    field.remove();
    selection?.removeAllRanges();
    ranges.forEach((range) => selection?.addRange(range));
    active?.focus({ preventScroll: true });
  }
  if (!copied) throw new Error("Copy failed");
}

document.querySelectorAll("article .post-content pre").forEach((pre) => {
  const code = pre.querySelector("code") || pre;
  const text = code.textContent;
  const button = document.createElement("button");
  button.className = "copy-code";
  button.type = "button";
  button.textContent = "复制代码";
  button.setAttribute("aria-live", "polite");
  let reset;
  button.addEventListener("click", async () => {
    clearTimeout(reset);
    button.disabled = true;
    try {
      await copyText(text);
      button.textContent = "已复制";
      button.dataset.state = "success";
    } catch {
      button.textContent = "复制失败，请手动复制";
      button.dataset.state = "error";
    } finally {
      button.disabled = false;
      reset = setTimeout(() => {
        button.textContent = "复制代码";
        delete button.dataset.state;
      }, 3500);
    }
  });
  pre.append(button);
});

const progress = document.querySelector("#reading-progress");
const article = document.querySelector("article .post-content");
const backTop = document.querySelector("[data-back-top]");
let scheduled = false;
function updateScroll() {
  scheduled = false;
  if (backTop) {
    const visible = window.scrollY > 400;
    backTop.hidden = !visible;
    backTop.classList.toggle("is-visible", visible);
  }
  if (progress && article) {
    const start = article.getBoundingClientRect().top + window.scrollY - 110;
    const distance = Math.max(
      1,
      article.offsetHeight - window.innerHeight + 140,
    );
    const amount = Math.max(
      0,
      Math.min(1, (window.scrollY - start) / distance),
    );
    progress.style.transform = `scaleX(${amount})`;
  }
}
function scheduleScroll() {
  if (!scheduled) {
    scheduled = true;
    requestAnimationFrame(updateScroll);
  }
}
window.addEventListener("scroll", scheduleScroll, { passive: true });
window.addEventListener("resize", scheduleScroll);
updateScroll();
backTop?.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "instant"
      : "smooth",
  });
  const main = document.querySelector("#main");
  if (main) {
    const oldTabIndex = main.getAttribute("tabindex");
    main.setAttribute("tabindex", "-1");
    main.focus({ preventScroll: true });
    main.addEventListener(
      "blur",
      () => {
        if (oldTabIndex === null) main.removeAttribute("tabindex");
        else main.setAttribute("tabindex", oldTabIndex);
      },
      { once: true },
    );
  }
});
