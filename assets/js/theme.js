// 첫 화면이 깜빡이지 않도록 head에서 동기로 불러온다.
(function () {
  let theme = "";
  try { theme = localStorage.getItem("ap-theme") || ""; } catch (e) { /* 저장소를 못 쓰면 시스템 설정을 따른다 */ }
  if (theme !== "light" && theme !== "dark") {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  document.documentElement.setAttribute("data-theme", theme);
})();
