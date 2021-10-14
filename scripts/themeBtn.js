// const themeBtn = document.getElementById("themebtn");
// themeBtn.addEventListener("click", () => {
//   setTimeout(() => {
//     document.body.classList.toggle("bglight");
//     let isLight = document.body.classList.contains("bglight");
//     localStorage.setItem("lightTheme", isLight);
//     $("#meta-theme").attr("content", isLight ? "light" : "dark");
//   }, 100);
// });

// // Save to Local Storage
// const isLightTheme = JSON.parse(localStorage.getItem("lightTheme"));
// if (isLightTheme) {
//   document.body.classList.add("bglight");
// $("#meta-theme").attr("content", "light");
//   themeBtn.checked = true;
// } else {
// $("#meta-theme").attr("content", "dark");
// }

const themeToggle = document.querySelector("#theme-toggle");
themeToggle.addEventListener("click", () => {
  toggleThemes();
});

let isLight;
function toggleThemes() {
  if (isLight) {
    $("#meta-theme").attr("content", "dark");
    themeToggle.setAttribute("aria-label", "Toggle light theme");
  } else {
    $("#meta-theme").attr("content", "light");
    themeToggle.setAttribute("aria-label", "Toggle dark theme");
  }
  document.body.classList.toggle("bglight");
  isLight = !isLight;
  setLS("lightTheme", isLight);
}

$(document).ready(() => {
  if (getLS("lightTheme")) {
    document.body.classList.add("bglight");
    $("#meta-theme").attr("content", "light");
    isLight = true;
  } else {
    $("#meta-theme").attr("content", "dark");
    isLight = false;
  }
});
