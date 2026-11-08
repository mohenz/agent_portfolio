import { api, mediaUrl } from "/assets/js/shared/api.js";
import { confirmDialog, esc, icon, mountHeader, showError, toast } from "/assets/js/shared/ui.js";

const app = document.getElementById("app");
mountHeader("admin");

function render(agents) {
  const rows = agents.length
    ? agents.map((a) => `<div class="agent-row" data-id="${a.id}">
        <div class="thumb">${a.turnaround_path ? `<img src="${mediaUrl(a.turnaround_path)}" alt="">` : ""}</div>
        <div><div class="name">${esc(a.name)}</div>
          <div class="muted">${esc([a.occupation, a.role].filter(Boolean).join(" · ") || "직업·역할 미입력")}</div></div>
        <div class="muted">사진 ${a.photo_count}장</div>
        <div class="actions">
          <a class="btn btn-sm" href="/admin/agent.html?id=${a.id}">${icon("pencil", 16)}편집</a>
          <button class="btn btn-sm btn-danger" type="button" data-delete="${a.id}">${icon("trash-2", 16)}삭제</button>
        </div></div>`).join("")
    : `<div class="empty"><p>등록된 에이전트가 없습니다.</p></div>`;
  app.innerHTML = `<div class="admin-head"><h1>에이전트 관리</h1>
      <button class="btn btn-primary" id="add" type="button">${icon("plus", 16)}에이전트 등록</button></div>
    <div>${rows}</div>`;

  document.getElementById("add").addEventListener("click", openCreateDialog);
  app.querySelectorAll("[data-delete]").forEach((button) =>
    button.addEventListener("click", async () => {
      const agent = agents.find((a) => a.id === Number(button.dataset.delete));
      const ok = await confirmDialog(`${agent.name} 삭제`, "이 에이전트와 턴어라운드 GIF, 사진 파일이 모두 삭제됩니다. 되돌릴 수 없습니다.");
      if (!ok) return;
      try {
        await api.deleteAgent(agent.id);
        toast("삭제했습니다.");
        load();
      } catch (error) { showError(error); }
    }));
}

function openCreateDialog() {
  const dialog = document.createElement("dialog");
  dialog.innerHTML = `<form method="dialog"><h2>에이전트 등록</h2>
    <div class="field"><label for="new-name">이름</label><input class="input" id="new-name" required maxlength="50" autocomplete="off"></div>
    <p class="muted" style="margin-top:8px">나머지 정보와 사진은 등록 후 편집 화면에서 입력합니다.</p>
    <div class="dialog-actions"><button class="btn" value="cancel" formnovalidate>취소</button><button class="btn btn-primary" value="ok">등록</button></div></form>`;
  dialog.addEventListener("close", async () => {
    const name = dialog.querySelector("#new-name").value.trim();
    const ok = dialog.returnValue === "ok";
    dialog.remove();
    if (!ok || !name) return;
    try {
      const agent = await api.createAgent({ name });
      location.href = `/admin/agent.html?id=${agent.id}`;
    } catch (error) { showError(error); }
  });
  document.body.append(dialog);
  dialog.showModal();
}

async function load() {
  try { render(await api.agents()); } catch (error) {
    app.innerHTML = `<div class="empty"><p>${esc(error.message)}</p></div>`;
    showError(error);
  }
}

load();
