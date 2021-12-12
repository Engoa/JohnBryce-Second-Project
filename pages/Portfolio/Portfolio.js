(() => {
  class PortfolioPageComponent extends Component {
    containerEl = null;

    constructor(props) {
      super(props);
    }

    render() {
      if (CryptoManager.toggledCoins.length) new ChartComponent().render();
      else $(".chart__page").html("No coins toggled, Please toggle coins to see the chart");
    }
  }

  const pp = new PortfolioPageComponent().render();
})();
