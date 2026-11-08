// 접속한 주소의 3052 포트를 API로 쓴다. 서버로 옮겨도 주소를 고칠 필요가 없다.
export const API = `${location.protocol}//${location.hostname || "localhost"}:3052`;

export const mediaUrl = (path) => (path ? `${API}/media/${path}` : "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, options);
  } catch (error) {
    throw new Error("서버에 연결할 수 없습니다. start-portfolio.cmd로 서버를 먼저 실행해 주세요.");
  }
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.message || "요청을 처리하지 못했습니다.");
  return body;
}

const json = (method, data) => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});

const upload = (method, file) => ({
  method,
  headers: { "Content-Type": file.type || "application/octet-stream", "X-Filename": encodeURIComponent(file.name) },
  body: file,
});

export const api = {
  agents: () => request("/agents"),
  agent: (id) => request(`/agents/${id}`),
  createAgent: (data) => request("/agents", json("POST", data)),
  updateAgent: (id, data) => request(`/agents/${id}`, json("PATCH", data)),
  deleteAgent: (id) => request(`/agents/${id}`, { method: "DELETE" }),
  uploadTurnaround: (id, file) => request(`/agents/${id}/turnaround`, upload("PUT", file)),
  uploadPhoto: (id, file) => request(`/agents/${id}/photos`, upload("POST", file)),
  deletePhoto: (id) => request(`/photos/${id}`, { method: "DELETE" }),
};
