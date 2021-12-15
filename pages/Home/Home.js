(() => {
  class HomePageComponent extends Component {
    containerEl = null;
    drawnCoins = 0;
    observer = null;

    constructor(props) {
      const watch = ["update-coins", "coin-selected"];
      super(props, watch);
    }

    changeCardLayout() {
      $("#smallLayout").on("click", () => {
        $(".coins").addClass("coins--small");
      });
      $("#bigLayout").on("click", () => {
        $(".coins").removeClass("coins--small");
      });
    }
    unToggleAll() {
      $("#togglebtn").on("click", () => {
        CryptoManager.unToggleAllCoins();
        toggleSnackBar(`All Coins successfully removed from Portfolio`);
      });
    }

    drawCoins(count) {
      const newLength = this.drawnCoins + count;
      const slicedCoins = CryptoManager.coins.slice(this.drawnCoins, newLength);
      slicedCoins.map((coin) => $(".coins").append(new CardComponent({ data: coin }).render()));
      this.drawnCoins = newLength;
    }

    observeForLoadMore() {
      const loader = $("#coins-loader");
      this.observer = new IntersectionObserver(
        (entries) =>
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.drawCoins(10);

              if (this.drawnCoins >= CryptoManager.coins?.length) {
                loader.addClass("d-none");
                this.observer.disconnect();
              }
            }
          }),
        {
          rootMargin: "0px",
          threshold: 1.0,
        }
      );

      this.observer.observe(loader[0]);
    }

    render() {
      this.drawCoins(30);
      this.observeForLoadMore();
      const searchBar = new SearchBarComponent().render();
      $(".search-bar").replaceWith(searchBar);
      this.unToggleAll();
      this.changeCardLayout();
    }

    watchListeners() {
      $(".coins").html(null);
      this.render();
    }
  }

  const hp = new HomePageComponent().render();

  $(document).ready(() => {
    if (!CryptoManager.toggledCoins.length) $("#unToggleBtn").css("visibility", "hidden");
    else $("#unToggleBtn").css("visibility", "visible");
  });
})();
