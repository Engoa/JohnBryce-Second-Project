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
    }

    watchListeners() {
      $(".coins").html(null);
      this.render();
    }
  }

  const hp = new HomePageComponent().render();
})();
