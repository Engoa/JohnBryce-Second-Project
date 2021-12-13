(() => {
  class PortfolioPageComponent extends Component {
    containerEl = null;

    constructor(props) {
      super(props);
    }

    render() {
      const Chart = new ChartComponent().render();
    }
  }

  const pp = new PortfolioPageComponent().render();
})();
