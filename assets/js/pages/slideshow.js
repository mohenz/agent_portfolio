import { api, mediaUrl } from "/assets/js/shared/api.js";
import { esc, icon, mountHeader, showError } from "/assets/js/shared/ui.js";

const app = document.getElementById("app");
const INTERVAL_MS = 4000;
mountHeader("slideshow");

function start(agents, agent) {
  const photos = agent.photos;
  const tabs = agents
    .map((a) => `<a href="/pages/slideshow.html?agent=${a.id}"${a.id === agent.id ? ' aria-current="true"' : ""}>${esc(a.name)}</a>`)
    .join("");
  document.title = `슬라이드 ${agent.name} - 에이전트 포트폴리오`;
  mountHeader("slideshow", agent.id);

  if (!photos.length) {
    app.innerHTML = `<div class="page"><nav class="agent-tabs" aria-label="에이전트 선택">${tabs}</nav>
      <div class="empty"><p>${esc(agent.name)}의 사진이 아직 없습니다.</p>
      <a class="btn" href="/admin/agent.html?id=${agent.id}">사진 추가하러 가기</a></div></div>`;
    return;
  }

  app.innerHTML = `<div class="slide-page">
    <div class="slide-top"><nav class="agent-tabs" style="margin:0" aria-label="에이전트 선택">${tabs}</nav>
      <span class="muted" id="counter" aria-live="polite"></span></div>
    <figure class="slide-stage" style="margin-block:0"><img id="slide" alt=""></figure>
    <div class="slide-bar">
      <strong>${esc(agent.name)}</strong>
      <div class="slide-controls">
        <button class="icon-btn" id="prev" type="button" aria-label="이전 사진">${icon("chevron-left", 22)}</button>
        <button class="icon-btn" id="toggle" type="button"></button>
        <button class="icon-btn" id="next" type="button" aria-label="다음 사진">${icon("chevron-right", 22)}</button>
      </div>
    </div>
    <div class="progress"><span id="bar"></span></div>
  </div>`;

  const img = document.getElementById("slide");
  const counter = document.getElementById("counter");
  const bar = document.getElementById("bar");
  const toggle = document.getElementById("toggle");
  const requested = Number(new URLSearchParams(location.search).get("i"));
  let index = Number.isInteger(requested) && requested >= 0 && requested < photos.length ? requested : 0;
  let timer = null;

  const show = (next) => {
    index = (next + photos.length) % photos.length;
    img.src = mediaUrl(photos[index].object_path);
    img.alt = `${agent.name} 사진 ${index + 1}`;
    counter.textContent = `${index + 1} / ${photos.length}`;
    bar.style.width = `${((index + 1) / photos.length) * 100}%`;
    new Image().src = mediaUrl(photos[(index + 1) % photos.length].object_path);
  };
  const paint = () => {
    toggle.innerHTML = icon(timer ? "pause" : "play", 22);
    toggle.setAttribute("aria-label", timer ? "자동 재생 멈춤" : "자동 재생 시작");
  };
  const play = () => { clearInterval(timer); timer = setInterval(() => show(index + 1), INTERVAL_MS); paint(); };
  const pause = () => { clearInterval(timer); timer = null; paint(); };
  const move = (delta) => { show(index + delta); if (timer) play(); };

  document.getElementById("prev").addEventListener("click", () => move(-1));
  document.getElementById("next").addEventListener("click", () => move(1));
  toggle.addEventListener("click", () => (timer ? pause() : play()));
  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") move(-1);
    else if (event.key === "ArrowRight") move(1);
    else if (event.key === " ") { event.preventDefault(); timer ? pause() : play(); }
  });
  show(index);
  photos.length > 1 ? play() : paint();
}

async function main() {
  const agents = await api.agents();
  if (!agents.length) {
    app.innerHTML = `<div class="page"><div class="empty"><p>등록된 에이전트가 없습니다.</p><a class="btn btn-primary" href="/admin/index.html">에이전트 등록하기</a></div></div>`;
    return;
  }
  const requested = Number(new URLSearchParams(location.search).get("agent"));
  const id = agents.some((a) => a.id === requested) ? requested : agents[0].id;
  start(agents, await api.agent(id));
}

main().catch((error) => {
  app.innerHTML = `<div class="page"><div class="empty"><p>${esc(error.message)}</p></div></div>`;
  showError(error);
});
