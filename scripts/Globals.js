const AppGlobals = {
  intervals: [],

  // Loader functions
  loaderActive: false,
  toggleLoader(state) {
    if (this.loaderActive) {
      $("#appLoader").addClass("hidden");
    } else {
      $("#appLoader").removeClass("hidden");
    }
    this.loaderActive = state ?? !this.loaderActive;
  },
};

document.addEventListener("route-update", () => {
  AppGlobals.intervals.forEach((interval) => clearInterval(interval));
  AppGlobals.intervals = [];
});

$(window).resize(() => {
  const isMobile = window.matchMedia("(max-width: 960px)").matches;
  if (!isMobile) $(".navbar--mobile").hide();
});
