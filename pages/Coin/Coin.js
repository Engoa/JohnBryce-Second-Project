(() => {
  class CoinPageComponent extends Component {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
    coin = {};

    constructor(props) {
      super(props);

      this.fetchData();
    }

    async fetchData() {
      try {
        const res = await CryptoManager.fetchCoinByID(this.coinRaw.symbol);
        this.coin = res;
        this.render();
        $(".loader").fadeOut();
      } catch (e) {
        this.renderError(e);
      }
    }

    render() {
      $(".coin-page__name").html(this.coin?.id);
      $(".coin-page__price").html(this.coin?.name);
    }

    renderError(e) {
      $(".coin-page").html(`<p>Error occoured, ${e.responseJSON.error}</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
