const AppGlobals = {
  intervals: [],

  // Loader functions
  loaderActive: false,
  toggleLoader(state) {
    if (this.loaderActive) {
      $("#appLoader").addClass("hidden");
      this.loaderActive = false;
    } else {
      $("#appLoader").removeClass("hidden");
      this.loaderActive = true;
    }
  },
};

document.addEventListener("route-update", () => {
  AppGlobals.intervals.forEach((interval) => clearInterval(interval));
  AppGlobals.intervals = [];
});
