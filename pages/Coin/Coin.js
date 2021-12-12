(() => {
  class CoinPageComponent extends ModalComponent {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
    coin = {};

    constructor(props) {
      super(props);
      this.fetchData();
    }
    formatToNumber(num) {
      return num?.toLocaleString("fullwide", { useGrouping: false });
    }
    numberWithCommas(x) {
      return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    async fetchData() {
      try {
        AppGlobals.toggleLoader(true);
        const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);
        this.coin = res;
        this.render();
        setLS(`coin`, this.coin);
        if (!this.coin) this.renderError(e);
      } catch (e) {
        this.renderError(e);
        console.log(e);
      } finally {
        setTimeout(() => {
          AppGlobals.toggleLoader(false);
        }, 1000);
      }
    }

    onClick() {
      $(".form-switch").on("click", () => {
        const isDisabled = this.containerEl.disabled;
        if (isDisabled) this.openModal();
      });
    }

    render() {
      const id = Router.getCurrentQuery()?.id;

      $(".coin-page__name__rank").html(`Rank #${this.coin?.coingecko_rank ?? "N/A"}`);
      $(".coin-page__name__score").html(`Score #${this.coin?.community_score ?? "N/A"}`);
      $(".coin-page__name__votes").html(`Votes #${this.coin?.coingecko_score ?? "N/A"}`);
      $(".coin-page__name span").html(`${this.coin?.name ?? "N/A"} (<b>${this.coin?.symbol.toUpperCase() ?? "N/A"}</b>)`);
      $(".coin-page__price span").html("$" + this.formatToNumber(this.coin?.market_data?.current_price?.usd));
      $(".coin-page__address span").html(this.coin?.contract_address ?? "Unknown wallet address");
      $(".coin-page__image").attr("src", this.coin?.image?.thumb);
      $(".coin-page__bottom__description").html(this.coin?.description.en ?? "Unknown coin description");
      $(".usd").html(`<b>USD:</b> $${this.formatToNumber(this.coin?.market_data.current_price?.usd ?? "N/A")}`);
      $(".eur").html(`<b>EUR:</b> €${this.formatToNumber(this.coin?.market_data.current_price?.eur ?? "N/A")}`);
      $(".ils").html(`<b>ILS:</b> ₪${this.formatToNumber(this.coin?.market_data.current_price?.ils ?? "N/A")}`);
      $(".supply").html(`${this.numberWithCommas(this.coin?.market_data.total_supply ?? "N/A")}`);
      $(".circulating-supply").html(this.coin?.market_data.circulating_supply ?? "N/A");
      $(".volume").html("$" + this.coin?.market_data.total_volume.usd ?? "N/A");
      $(".liquidity").html(this.coin?.liquidity_score ?? "N/A");

      const Switch = new SwitchComponent({ id: id });
      this.containerEl = document.querySelector(".form-switch").appendChild(Switch.render());
      $(this.containerEl).attr("id", "coin-page__checkbox");

      this.onClick();
      return this.containerEl;
    }
    renderError(e) {
      $(".coin-page").html(`<p class="error">Error occoured, ${e?.responseJSON?.error} from the API</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
