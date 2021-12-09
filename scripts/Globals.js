const AppGlobals = {
  intervals: [],

  // Loader functions
  loaderActive: false,
  toggleLoader(state) {
    this.loaderActive = state ?? !this.loaderActive;
    if (this.loaderActive) {
      $("#appLoader").addClass("active");
    } else {
      $("#appLoader").removeClass("active");
    }
  },
};

document.addEventListener("route-update", () => {
  AppGlobals.intervals.forEach((interval) => clearInterval(interval));
  AppGlobals.intervals = [];
});
