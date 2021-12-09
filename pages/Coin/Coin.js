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
        const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);
        this.coin = res;
        this.render();
      } catch (e) {
        this.renderError(e);
      }
    }

    render() {
      $(".coin-page__name span").html(this.coin?.id);
      $(".coin-page__price span").html(this.coin?.name);
    }

    renderError(e) {
      $(".coin-page").html(`<p class="error">Error occoured, ${e.responseJSON?.error} from the API</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
