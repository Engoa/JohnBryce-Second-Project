const themeToggle = document.querySelector("#theme-toggle");
themeToggle.addEventListener("click", () => {
  toggleThemes();
});

let isLight;
function toggleThemes() {
  isLight = !isLight;
  $("#meta-theme").attr("content", isLight ? "light" : "dark");
  document.body.classList.toggle("bglight");
  setLS("lightTheme", isLight);
}

function setDarkTheme() {
  document.body.classList.remove("bglight");
  $("#meta-theme").attr("content", "dark");
  isLight = false;
}

function setLightTheme() {
  document.body.classList.add("bglight");
  $("#meta-theme").attr("content", "light");
  isLight = true;
}

$(document).ready(() => {
  if (getLS("lightTheme")) {
    setLightTheme();
  } else {
    setDarkTheme();
  }
});

const mql = window.matchMedia("(prefers-color-scheme: dark)");
mql.onchange = (ev) => (ev.matches ? setDarkTheme() : setLightTheme());
