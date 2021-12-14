const AppGlobals = {
  intervals: [],
  loaderActive: true,

  toggleLoader() {
    if (this.loaderActive) {
      $(".appLoader").addClass("hidden");
      this.loaderActive = true;
    } else {
      $(".appLoader").removeClass("hidden");
      this.loaderActive = false;
    }
  },
};

document.addEventListener("route-update", () => {
  AppGlobals.intervals.forEach((interval) => clearInterval(interval));
  AppGlobals.intervals = [];
});

document.addEventListener("route-update", (event) => {
  if (event.detail.to === "Home" || event.detail.to === "Coin" || event.detail.to === "About") {
    gsap
      .from(document.querySelectorAll(".header, .coin-page__details, .about__page"), {
        autoAlpha: 0,
        y: 250,
        filter: "blur(5px)",
        opacity: 0,
        ease: Power1.ease,
        stagger: 0.3,
        clearProps: "all",
      })
      .totalDuration(1.2);
  }
  if (event.detail.to === "Portfolio") {
    gsap
      .from(document.querySelector(".chart__page"), {
        autoAlpha: 0,
        x: -300,
        filter: "blur(5px)",
        opacity: 0,
        ease: Power1.ease,
        stagger: 0.3,
        clearProps: "all",
      })
      .totalDuration(1);
  }
  if (event.detail.to === "Home") {
    if ($(".coins")) {
      gsap
        .from(document.querySelectorAll(".coins"), {
          autoAlpha: 0,
          x: -300,
          filter: "blur(5px)",
          opacity: 0,
          ease: Power1.ease,
          stagger: 0.3,
          clearProps: "all",
        })
        .totalDuration(1);
    }
  }
  if (event.detail.to === "Home") {
    gsap
      .from(document.querySelector(".nav-logo img"), {
        autoAlpha: 0,
        x: -300,
        filter: "blur(5px)",
        opacity: 0,
        ease: Power1.ease,
        stagger: 0.3,
        clearProps: "all",
      })
      .totalDuration(1.5);
  }
  if (event.detail.to === "Coin") {
    gsap
      .from(document.querySelector(".coin-recommended"), {
        autoAlpha: 0,
        x: -200,
        filter: "blur(5px)",
        opacity: 0,
        ease: Power1.ease,
        stagger: 0.3,
        clearProps: "all",
      })
      .totalDuration(1.5);
  }
});

$(document).ready(() => {
  setInterval(() => localStorage.removeItem("coin"), 2 * 60 * 1000);
  // After two minutes, delete the local storage coin item
});
