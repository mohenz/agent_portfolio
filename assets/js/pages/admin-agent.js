import { api, mediaUrl } from "/assets/js/shared/api.js";
import { confirmDialog, esc, icon, mountHeader, showError, toast } from "/assets/js/shared/ui.js";

const app = document.getElementById("app");
const agentId = Number(new URLSearchParams(location.search).get("id"));
mountHeader("admin");

const FIELDS = [
  ["name", "이름", "text"], ["age", "나이", "number"], ["nationality", "국적", "text"],
  ["occupation", "직업", "text"], ["role", "역할", "text"],
  ["height_cm", "키(cm)", "number"], ["bust_cm", "가슴(cm)", "number"], ["waist_cm", "허리(cm)", "number"],
  ["hip_cm", "엉덩이(cm)", "number"], ["shoe_size", "신발 사이즈", "text"],
];

function render(agent) {
  document.title = `${agent.name} 편집 - 에이전트 포트폴리오`;
  const inputs = FIELDS.map(([key, label, type]) => `<div class="field"><label for="f-${key}">${label}</label>
      <input class="input" id="f-${key}" name="${key}" type="${type}" ${type === "number" ? 'min="0" max="1000"' : 'maxlength="50"'}
        ${key === "name" ? "required" : ""} value="${esc(agent[key])}"></div>`).join("");
  const photos = agent.photos.map((p, i) => `<div class="photo-card">
      <img src="${mediaUrl(p.thumb_path || p.object_path)}" alt="${esc(agent.name)} 사진 ${i + 1}">
      <button class="icon-btn" type="button" data-photo="${p.id}" aria-label="사진 ${i + 1} 삭제">${icon("trash-2", 16)}</button></div>`).join("");

  app.innerHTML = `
    <div class="admin-head"><h1>${esc(agent.name)} 편집</h1>
      <a class="btn" href="/index.html?agent=${agent.id}">포트폴리오 보기</a></div>

    <form id="info"><h2 class="section-title" style="font-size:18px;font-weight:600;margin-bottom:16px">기본 정보와 바디 프로필</h2>
      <div class="form-grid">${inputs}</div>
      <div class="form-actions"><button class="btn btn-primary" type="submit">저장</button></div></form>

    <section class="section"><h2>턴어라운드 GIF</h2>
      <div class="gif-edit"><div class="preview">${agent.turnaround_path ? `<img src="${mediaUrl(agent.turnaround_path)}" alt="현재 턴어라운드">` : ""}</div>
        <div><p class="muted" style="margin-bottom:12px">포트폴리오 왼쪽에 반복 재생됩니다. GIF 파일만 올릴 수 있습니다.</p>
          <label class="btn" for="gif-input">${icon("upload", 16)}${agent.turnaround_path ? "GIF 교체" : "GIF 올리기"}</label>
          <input id="gif-input" type="file" accept="image/gif" hidden></div></div></section>

    <section class="section"><h2>사진 ${agent.photos.length}장</h2>
      <label class="dropzone" id="drop" for="photo-input">${icon("upload", 24)}<span>사진을 끌어놓거나 눌러서 선택하세요 (JPEG·PNG·WebP, 20MB 이하)</span></label>
      <input id="photo-input" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden>
      <div class="photo-grid">${photos}</div></section>`;

  bind(agent);
}

function bind(agent) {
  document.getElementById("info").addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    try {
      render(await api.updateAgent(agent.id, data));
      toast("저장했습니다.");
    } catch (error) { showError(error); }
  });

  document.getElementById("gif-input").addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      render(await api.uploadTurnaround(agent.id, file));
      toast("턴어라운드 GIF를 바꿨습니다.");
    } catch (error) { showError(error); }
  });

  const uploadPhotos = async (files) => {
    let latest = null;
    let done = 0;
    for (const file of files) {
      try {
        latest = await api.uploadPhoto(agent.id, file);
        done += 1;
      } catch (error) { showError(new Error(`${file.name}: ${error.message}`)); }
    }
    if (latest) { render(latest); toast(`사진 ${done}장을 추가했습니다.`); }
  };
  document.getElementById("photo-input").addEventListener("change", (event) => uploadPhotos([...event.target.files]));
  const drop = document.getElementById("drop");
  drop.addEventListener("dragover", (event) => { event.preventDefault(); drop.classList.add("drag"); });
  drop.addEventListener("dragleave", () => drop.classList.remove("drag"));
  drop.addEventListener("drop", (event) => {
    event.preventDefault();
    drop.classList.remove("drag");
    uploadPhotos([...event.dataTransfer.files]);
  });

  app.querySelectorAll("[data-photo]").forEach((button) =>
    button.addEventListener("click", async () => {
      if (!(await confirmDialog("사진 삭제", "이 사진 파일이 삭제됩니다. 되돌릴 수 없습니다."))) return;
      try {
        render(await api.deletePhoto(Number(button.dataset.photo)));
        toast("사진을 삭제했습니다.");
      } catch (error) { showError(error); }
    }));
}

if (!agentId) {
  app.innerHTML = `<div class="empty"><p>편집할 에이전트를 선택해 주세요.</p><a class="btn" href="/admin/index.html">에이전트 관리로 가기</a></div>`;
} else {
  api.agent(agentId).then(render).catch((error) => {
    app.innerHTML = `<div class="empty"><p>${esc(error.message)}</p><a class="btn" href="/admin/index.html">에이전트 관리로 가기</a></div>`;
    showError(error);
  });
}
