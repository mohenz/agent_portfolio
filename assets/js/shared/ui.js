// Lucide 아이콘(필요한 것만), 공통 헤더, 테마 전환, 알림, 확인 대화상자.
const ICONS = {
  "chevron-left": '<path d="m15 18-6-6 6-6"/>',
  "chevron-right": '<path d="m9 18 6-6-6-6"/>',
  play: '<polygon points="6 3 20 12 6 21 6 3"/>',
  pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  "trash-2": '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  pencil: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

export function icon(name, size = 18) {
  return `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]}</svg>`;
}

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
}

const NAV = [
  ["portfolio", "포트폴리오", "/index.html", true],
  ["slideshow", "슬라이드", "/pages/slideshow.html", true],
  ["admin", "관리", "/admin/index.html", false],
];

export function mountHeader(active, agentId) {
  const links = NAV.map(([key, label, href, withAgent]) => {
    const url = withAgent && agentId ? `${href}?agent=${agentId}` : href;
    return `<a href="${url}"${key === active ? ' aria-current="page"' : ""}>${label}</a>`;
  }).join("");
  const header = document.getElementById("site-header");
  header.className = "site-header";
  header.innerHTML = `<div class="bar">
    <a class="brand" href="/index.html">에이전트 포트폴리오</a>
    <nav class="site-nav" aria-label="주 메뉴">${links}</nav>
    <button class="icon-btn" id="theme-btn" type="button"></button>
  </div>`;
  const button = header.querySelector("#theme-btn");
  const paint = () => {
    const dark = document.documentElement.getAttribute("data-theme") === "dark";
    button.innerHTML = icon(dark ? "sun" : "moon", 20);
    button.setAttribute("aria-label", dark ? "라이트 테마로 전환" : "다크 테마로 전환");
  };
  button.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("ap-theme", next); } catch (e) { /* 저장 실패는 무시한다 */ }
    paint();
  });
  paint();
}

export function toast(message, isError = false) {
  const el = document.createElement("div");
  el.className = `toast${isError ? " error" : ""}`;
  el.setAttribute("role", "status");
  el.textContent = message;
  document.body.append(el);
  setTimeout(() => el.remove(), isError ? 5000 : 2500);
}

export function confirmDialog(title, message, okLabel = "삭제") {
  return new Promise((resolve) => {
    const dialog = document.createElement("dialog");
    dialog.innerHTML = `<h2>${esc(title)}</h2><p class="muted">${esc(message)}</p>
      <div class="dialog-actions"><button class="btn" value="cancel">취소</button><button class="btn btn-danger" value="ok">${esc(okLabel)}</button></div>`;
    dialog.addEventListener("click", (event) => {
      const value = event.target.closest("button")?.value;
      if (value) dialog.close(value);
    });
    dialog.addEventListener("close", () => { resolve(dialog.returnValue === "ok"); dialog.remove(); });
    document.body.append(dialog);
    dialog.showModal();
  });
}

export function showError(error) {
  toast(error.message || "오류가 발생했습니다.", true);
}
