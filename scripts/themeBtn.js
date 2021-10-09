const themeBtn = document.getElementById("themebtn");
themeBtn.addEventListener("click", () => {
  setTimeout(() => {
    document.body.classList.toggle("bglight");
    let isLight = document.body.classList.contains("bglight");
    localStorage.setItem("lightTheme", isLight);
    $("#meta-theme").attr("content", isLight ? "light" : "dark");
  }, 100);
});

// Save to Local Storage
const isLightTheme = JSON.parse(localStorage.getItem("lightTheme"));
if (isLightTheme) {
  document.body.classList.add("bglight");
  themeBtn.checked = true;
}
