(() => {
  class PortfolioPageComponent extends Component {
    containerEl = null;

    constructor(props) {
      super(props);
    }

    render() {
      // $(".charts__title").html(`${CryptoManager.toggledCoins.length} selected coins`);
      const Chart = new ChartComponent().render();
    }
  }

  const pp = new PortfolioPageComponent().render();
})();
