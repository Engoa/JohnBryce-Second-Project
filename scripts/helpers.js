const getLS = (key) => JSON.parse(localStorage.getItem(key));
const setLS = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const isMobile = window.matchMedia("(max-width: 960px)").matches;

function setEndOfContenteditable(contentEditableElement) {
  var range, selection;
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

const toggleSnackBar = (text) => {
  let snackBarElement = document.querySelector(".snackbar");
  snackBarElement.classList.add("show");
  setTimeout(function () {
    snackBarElement.classList.remove("show");
  }, 2500);
  snackBarElement.innerHTML = text;
};

const $audio = new Audio("");
$audio.volume = 0.2;
const triggerSound = (path) => {
  $audio.src = path;
  $audio.load();
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

  triggerSound("../assets/confetti.mp3");
  (function frame() {
    isAnimatingConfetti = true;
    // launch a few confetti from the left edge
    confetti({
      particleCount: 6,
      angle: 60,
      ticks: 40,
      spread: 70,
      origin: { x: 0, y: 1 },
      drift: (Math.random() - 0.5) * 2,
    });
    // and launch a few from the right edge
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      ticks: 40,
      origin: { x: 1, y: 1 },
      drift: (Math.random() - 0.5) * 2,
    });

    // keep going until we are out of time
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    } else {
      isAnimatingConfetti = false;
    }
  })();
};
