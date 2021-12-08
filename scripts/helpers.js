// Global Variables
const getLS = (key) => JSON.parse(localStorage.getItem(key));
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const isMobile = window.matchMedia("(max-width: 960px)").matches;
const genUID = (length = 7) => Math.random().toString(36).substring(length);
const getRandomColor = (el) =>
  $(el).each(function () {
    var items = [
      "var(--card-stripe1)",
      "var(--card-stripe2)",
      "var(--card-stripe3)",
      "var(--card-stripe4)",
      "var(--card-stripe5)",
      "var(--card-stripe6)",
      "var(--card-stripe7)",
    ];
    var colour = items[Math.floor(Math.random() * items.length)];
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

// Audio stuff
// const $audio = new Audio("");
// const triggerSound = (path) => {
//   $audio.load(path);
//   $audio.src = path;
//   $audio.volume = 0.05;
//   if (path === "../assets/confettiBig.mp3" || path === "../assets/pop.mp3") {
//     $audio.currentTime = 1;
//   } else {
//     $audio.currentTime = 0.085;
//   }
//   if (path === "../assets/pop.mp3") {
//     $audio.volume = 0.2;
//   }
//   $audio.play();
// };
