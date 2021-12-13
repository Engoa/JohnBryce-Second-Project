let navLogo = new Rellax(".nav-logo");
let bgImage = new Rellax(".bg");

// Global Variables
const getLS = (key) => JSON.parse(localStorage.getItem(key));
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const isMobile = window.matchMedia("(max-width: 960px)").matches;
const genUID = (length = 7) => Math.random().toString(36).substring(length);
const getRandomColor = (el) =>
  $(el).each(function () {
    let items = [
      "var(--card-stripe1)",
      "var(--card-stripe2)",
      "var(--card-stripe3)",
      "var(--card-stripe4)",
      "var(--card-stripe5)",
      "var(--card-stripe6)",
      "var(--card-stripe7)",
    ];
    let colour = items[Math.floor(Math.random() * items.length)];
    $(this).css("background", colour);
  });

// Snackbar
const toggleSnackBar = (text) => {
  let snackBarElement = document.querySelector(".snackbar");
  snackBarElement.classList.add("show");
  setTimeout(() => {
    snackBarElement.classList.remove("show");
  }, 2500);
  snackBarElement.innerHTML = text;
};

// Nav Stuff
const menuBtn = document.getElementById("menubtn");
const navbarMobile = document.querySelector(".navbar--mobile");

const menuToggle = () => {
  navbarMobile.classList.toggle("active");
};

const closeNav = () => {
  navbarMobile.classList.remove("active");
};
