import { api, mediaUrl } from "/assets/js/shared/api.js";
import { esc, mountHeader, showError } from "/assets/js/shared/ui.js";

const app = document.getElementById("app");
const FADE_MS = 150;
mountHeader("portfolio");

const value = (v, unit = "") => (v === null || v === undefined || v === "" ? "-" : `${esc(v)}${unit ? `<span class="unit">${unit}</span>` : ""}`);

let agents = [];
let currentId = null;
let tabs;
let content;
const cache = new Map();

async function loadAgent(id) {
  if (!cache.has(id)) cache.set(id, await api.agent(id));
  return cache.get(id);
}

// 화면을 바꾸기 전에 GIF를 미리 받아 두어, 바뀐 뒤에 늦게 나타나며 틀이 흔들리는 일을 막는다.
function preload(url) {
  if (!url) return Promise.resolve();
  const image = new Image();
  image.src = url;
  return image.decode().catch(() => {});
}

function contentHtml(agent) {
  const gif = agent.turnaround_path
    ? `<img src="${mediaUrl(agent.turnaround_path)}" alt="${esc(agent.name)} 전신 턴어라운드">`
    : `<p class="muted">턴어라운드 GIF가 없습니다.</p>`;
  const photos = agent.photos.length
    ? `<div class="gallery">${agent.photos
        .map((p, i) => `<a href="/pages/slideshow.html?agent=${agent.id}&i=${i}" aria-label="${esc(agent.name)} 사진 ${i + 1} 슬라이드로 보기">
            <img src="${mediaUrl(p.thumb_path || p.object_path)}" alt="${esc(agent.name)} 사진 ${i + 1}" loading="lazy"
              ${p.width && p.height ? `style="aspect-ratio:${p.width}/${p.height}"` : ""}></a>`)
        .join("")}</div>`
    : `<div class="empty"><p>아직 등록된 사진이 없습니다.</p><a class="btn" href="/admin/agent.html?id=${agent.id}">사진 추가하러 가기</a></div>`;
  const slideLink = agent.photos.length
    ? `<a class="btn btn-sm" href="/pages/slideshow.html?agent=${agent.id}">슬라이드로 보기</a>`
    : "";
  return `
    <section class="stage">
      <figure class="turnaround">${gif}</figure>
      <div>
        <div class="gallery-head"><h2>사진 ${agent.photos.length}장</h2>${slideLink}</div>
        ${photos}
      </div>
    </section>
    <section class="profile">
      <div>
        <h1>${esc(agent.name)}</h1>
        <dl class="facts">
          <div><dt>나이</dt><dd>${value(agent.age, "세")}</dd></div>
          <div><dt>국적</dt><dd>${value(agent.nationality)}</dd></div>
          <div><dt>직업</dt><dd>${value(agent.occupation)}</dd></div>
          <div><dt>역할</dt><dd>${value(agent.role)}</dd></div>
        </dl>
      </div>
      <div class="body-profile">
        <h2>바디 프로필</h2>
        <dl class="stats">
          <div><dt>키</dt><dd>${value(agent.height_cm, "cm")}</dd></div>
          <div><dt>가슴</dt><dd>${value(agent.bust_cm, "cm")}</dd></div>
          <div><dt>허리</dt><dd>${value(agent.waist_cm, "cm")}</dd></div>
          <div><dt>엉덩이</dt><dd>${value(agent.hip_cm, "cm")}</dd></div>
          <div><dt>신발</dt><dd>${value(agent.shoe_size)}</dd></div>
        </dl>
      </div>
    </section>`;
}

function paintTabs() {
  tabs.querySelectorAll("a").forEach((link) => {
    if (Number(link.dataset.id) === currentId) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  });
  const slideLink = document.querySelector('.site-nav a[href^="/pages/slideshow.html"]');
  if (slideLink) slideLink.href = `/pages/slideshow.html?agent=${currentId}`;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function show(id, { animate }) {
  const agent = await loadAgent(id);
  await preload(mediaUrl(agent.turnaround_path));
  if (animate) {
    // 서서히 사라지는 동안 높이를 붙잡아 두어 아래 영역이 위로 튀지 않게 한다.
    content.style.minHeight = `${content.offsetHeight}px`;
    content.classList.add("fading");
    await wait(FADE_MS);
  }
  currentId = id;
  content.innerHTML = contentHtml(agent);
  document.title = `${agent.name} - 에이전트 포트폴리오`;
  paintTabs();
  if (animate) {
    requestAnimationFrame(() => {
      content.classList.remove("fading");
      setTimeout(() => { content.style.minHeight = ""; }, FADE_MS);
    });
  }
}

function pickId() {
  const requested = Number(new URLSearchParams(location.search).get("agent"));
  return agents.some((a) => a.id === requested) ? requested : agents[0].id;
}

async function main() {
  agents = await api.agents();
  if (!agents.length) {
    app.innerHTML = `<div class="empty"><p>등록된 에이전트가 없습니다.</p><a class="btn btn-primary" href="/admin/index.html">에이전트 등록하기</a></div>`;
    return;
  }
  app.innerHTML = `<nav class="agent-tabs" aria-label="에이전트 선택">${agents
    .map((a) => `<a href="/index.html?agent=${a.id}" data-id="${a.id}">${esc(a.name)}</a>`)
    .join("")}</nav><div id="content" class="fade-swap"></div>`;
  tabs = app.querySelector(".agent-tabs");
  content = document.getElementById("content");

  let busy = false;
  const go = async (id, push) => {
    if (busy || id === currentId) return;
    busy = true;
    try {
      await show(id, { animate: true });
      if (push) history.pushState({}, "", `/index.html?agent=${id}`);
    } catch (error) {
      showError(error);
    } finally {
      busy = false;
    }
  };
  tabs.addEventListener("click", (event) => {
    const link = event.target.closest("a[data-id]");
    if (!link || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    go(Number(link.dataset.id), true);
  });
  window.addEventListener("popstate", () => go(pickId(), false));

  await show(pickId(), { animate: false });
}

main().catch((error) => {
  app.innerHTML = `<div class="empty"><p>${esc(error.message)}</p></div>`;
  showError(error);
});
