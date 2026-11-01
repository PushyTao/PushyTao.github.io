const DEFAULT_SIZE = 15;
const MIN_SIZE = 14;
const MAX_SIZE = 22;
const STORAGE_KEY = "orbit-article-font-size";

export function initializeReadingControls(document, onSizeChange = () => {}) {
  const controls = document.querySelector("[data-reading-controls]");
  if (!controls) return;

  const root = document.documentElement;
  const decrease = controls.querySelector("[data-font-decrease]");
  const increase = controls.querySelector("[data-font-increase]");
  const reset = controls.querySelector("[data-font-reset]");
  const value = controls.querySelector("[data-font-value]");
  let size = DEFAULT_SIZE;
  try {
    const saved = Number(document.defaultView.localStorage.getItem(STORAGE_KEY));
    if (Number.isInteger(saved) && saved >= MIN_SIZE && saved <= MAX_SIZE) {
      size = saved;
    }
  } catch {
    /* Reading controls also work when browser storage is unavailable. */
  }

  function render() {
    root.style.setProperty("--article-font-size", `${size}px`);
    value.textContent = `${size}px`;
    decrease.disabled = size === MIN_SIZE;
    increase.disabled = size === MAX_SIZE;
    reset.disabled = size === DEFAULT_SIZE;
  }

  function changeSize(next) {
    const bounded = Math.max(MIN_SIZE, Math.min(MAX_SIZE, next));
    if (bounded === size) return;
    size = bounded;
    render();
    try {
      document.defaultView.localStorage.setItem(STORAGE_KEY, String(size));
    } catch {
      /* Persistence is optional. */
    }
    onSizeChange();
  }

  decrease.addEventListener("click", () => changeSize(size - 1));
  increase.addEventListener("click", () => changeSize(size + 1));
  reset.addEventListener("click", () => changeSize(DEFAULT_SIZE));
  render();
  controls.hidden = false;
}
