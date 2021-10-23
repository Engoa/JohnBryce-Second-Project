// Global Variables
const getLS = (key) => JSON.parse(localStorage.getItem(key));
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const isMobile = window.matchMedia("(max-width: 960px)").matches;
const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

// Set caret on contentEditable to start on the right always!
function setEndOfContenteditable(contentEditableElement) {
  let range, selection;
  if (document.createRange) {
    range = document.createRange();
    range.selectNodeContents(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    selection = window.getSelection(); //get the selection object (allows you to change selection)
    selection.removeAllRanges(); //remove any selections already made
    selection.addRange(range); //make the range you have just created the visible selection
  } else if (document.selection) {
    //IE 8 and lower
    range = document.body.createTextRange(); //Create a range (a range is a like the selection but invisible)
    range.moveToElementText(contentEditableElement); //Select the entire contents of the element with the range
    range.collapse(false); //collapse the range to the end point. false means collapse to end rather than the start
    range.select(); //Select the range (make it the visible selection
  }
}

// Error Shake function

const errorShake = (element) => {
  $(element).addClass("shakeError");
  setTimeout(() => {
    // Remove class after anim is finished
    $(element).removeClass("shakeError");
  }, 550);
};
// Snackbar
const toggleSnackBar = (text) => {
  let snackBarElement = document.querySelector(".snackbar");
  snackBarElement.classList.add("show");
  setTimeout(() => {
    snackBarElement.classList.remove("show");
  }, 2500);
  snackBarElement.innerHTML = text;
};

//Tippy
const activateTippy = () => {
  if (!isMobile)
    tippy(".tippy", {
      animation: "shift-toward",
      inertia: true,
      duration: [400, 400],
      theme: "theme",
      arrow: true,
    });
};
// Audio stuff
const $audio = new Audio("");
const triggerSound = (path) => {
  $audio.load(path);
  $audio.src = path;
  $audio.volume = 0.05;
  if (path === "../assets/confettiBig.mp3" || path === "../assets/pop.mp3") {
    $audio.currentTime = 1;
  } else {
    $audio.currentTime = 0.085;
  }
  if (path === "../assets/pop.mp3") {
    $audio.volume = 0.2;
  }
  $audio.play();
};

// Confetti options
const confettiLight = () => {
  triggerSound("../assets/confetti.mp3");
  confetti({
    particleCount: 200,
    startVelocity: 30,
    spread: 360,
    gravity: 0.8,
    scalar: 1.1,
    drift: (Math.random() - 0.5) * 2,
    origin: {
      x: Math.random(),
      y: Math.random() - 0.2,
    },
  });
};

let isAnimatingConfetti = false;
const confettiStrong = () => {
  if (isAnimatingConfetti) return;
  const duration = 2000;
  const end = Date.now() + duration;

  triggerSound("../assets/confettiBig.mp3");
  (function frame() {
    isAnimatingConfetti = true;
    // launch a few confetti from the left edge
    confetti({
      particleCount: isMobile ? 5.5 : 7,
      angle: 60,
      ticks: 50,
      spread: 80,
      origin: { x: 0, y: 1 },
      drift: (Math.random() - 0.5) * 2,
      scalar: 1.1,
      startVelocity: 55,
    });
    // and launch a few from the right edge
    confetti({
      particleCount: isMobile ? 5.5 : 7,
      angle: 120,
      ticks: 50,
      spread: 80,
      origin: { x: 1, y: 1 },
      drift: (Math.random() - 0.5) * 2,
      scalar: 1.1,
      startVelocity: 55,
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    } else {
      isAnimatingConfetti = false;
    }
  })();
};
