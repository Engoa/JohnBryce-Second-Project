(() => {
  class HomePageComponent extends Component {
    containerEl = null;

    constructor(props) {
      const watch = ["update-coins", "coin-selected"];
      super(props, watch);
    }

    render() {
      CryptoManager.coins.map((coin) => {
        const Card = new CardComponent({ data: coin }).render();
        $(".coins").append(Card);
      });

      const searchBar = new SearchBarComponent().render();
      $(".search-bar").replaceWith(searchBar);
    }

    watchListeners() {
      $(".coins").html(null);
      this.render();
    }
  }

  const hp = new HomePageComponent().render();
})();
