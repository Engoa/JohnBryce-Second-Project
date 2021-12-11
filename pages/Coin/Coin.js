(() => {
  class CoinPageComponent extends Component {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
    coin = {};

    constructor(props) {
      super(props);
      this.fetchData();
    }
    formatToNumber(num) {
      return num.toLocaleString("fullwide", { useGrouping: false });
    }
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    async fetchData() {
      try {
        AppGlobals.toggleLoader(true);
        const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);
        this.coin = res;
        this.render();
        console.log(this.coin);
        if (!this.coin) return this.renderError(e);
      } catch (e) {
        console.log(e);
      } finally {
        AppGlobals.toggleLoader(false);
      }
    }

    render() {
      const { coingecko_rank, name, symbol, market_data, image, community_score, coingecko_score, description, contract_address, liquidity_score } =
        this.coin;
      const id = Router.getCurrentQuery()?.id;

      $(".coin-page__name__rank").html(`Rank #${coingecko_rank}`);
      $(".coin-page__name__score").html(`Score #${community_score}`);
      $(".coin-page__name__votes").html(`Votes #${coingecko_score}`);
      $(".coin-page__name span").html(`${name} (${symbol.toUpperCase()})`);
      $(".coin-page__price span").html("$" + this.formatToNumber(market_data.current_price?.usd));
      $(".coin-page__address span").html(contract_address);
      $(".coin-page__image").attr("src", image.thumb);
      $(".coin-page__bottom__description").html(description.en);
      $(".usd").html(`<b>USD:</b> $${this.formatToNumber(market_data.current_price?.usd)}`);
      $(".eur").html(`<b>EUR:</b> €${this.formatToNumber(market_data.current_price?.eur)}`);
      $(".ils").html(`<b>ILS:</b> ₪${this.formatToNumber(market_data.current_price?.ils)}`);
      $(".supply").html(`${this.numberWithCommas(market_data.total_supply)}`);
      $(".circulating-supply").html(market_data.circulating_supply);
      $(".volume").html("$" + market_data.total_volume.usd);
      $(".liquidity").html(liquidity_score);

      const Switch = new SwitchComponent({ id: id });
      this.containerEl = document.querySelector(".form-switch").appendChild(Switch.render());
      return this.containerEl;
    }
    renderError(e) {
      $(".coin-page").html(`<p class="error">Error occoured, ${e?.responseJSON?.error} from the API</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
