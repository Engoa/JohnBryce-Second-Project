(() => {
  class CoinPageComponent extends ModalComponent {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
    constructor(props) {
      super(props);
      this.fetchData();
    }
    formatToNumber(num) {
      return num?.toLocaleString("fullwide", { useGrouping: true });
    }

    async fetchData() {
      try {
        AppGlobals.toggleLoader(true);
        const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);

        CryptoManager.selectedCoin = res;
        this.render();
        setLS(`coin`, CryptoManager.selectedCoin);
        if (!CryptoManager.selectedCoin) this.renderError(e);
      } catch (e) {
        this.renderError(e);
        console.log(e);
      } finally {
        AppGlobals.toggleLoader(false);
      }
    }

    onClick() {
      $(".form-switch").on("click", () => {
        const isDisabled = this.containerEl.disabled;
        if (isDisabled) this.openModal();
      });
    }

    render() {
      const coin = CryptoManager.selectedCoin || {};
      const id = Router.getCurrentQuery()?.id;

      $(".coin-page__name__rank").html(`Rank #${coin?.coingecko_rank ?? "N/A"}`);
      $(".coin-page__name__score").html(`Score #${coin?.community_score ?? "N/A"}`);
      $(".coin-page__name__votes").html(`Votes #${coin?.coingecko_score ?? "N/A"}`);
      $(".coin-page__name span").html(`${coin?.name ?? "N/A"} (<b>${coin?.symbol.toUpperCase() ?? "N/A"}</b>)`);
      $(".coin-page__price span").html("$" + this.formatToNumber(coin?.market_data?.current_price?.usd));
      $(".coin-page__address span").html(coin?.contract_address ?? "Unknown wallet address");
      $(".coin-page__image").attr("src", coin?.image?.thumb);
      $(".coin-page__bottom__description").html(coin?.description.en ?? "Unknown coin description");
      $(".usd").html(`<b>USD:</b> $${this.formatToNumber(coin?.market_data.current_price?.usd ?? "N/A")}`);
      $(".eur").html(`<b>EUR:</b> €${this.formatToNumber(coin?.market_data.current_price?.eur ?? "N/A")}`);
      $(".ils").html(`<b>ILS:</b> ₪${this.formatToNumber(coin?.market_data.current_price?.ils ?? "N/A")}`);
      $(".supply").html(`${coin?.market_data.total_supply?.toLocaleString() ?? "N/A"}`);
      $(".circulating-supply").html(coin?.market_data.circulating_supply ?? "N/A");
      $(".volume").html("$" + coin?.market_data.total_volume.usd ?? "N/A");
      $(".liquidity").html(coin?.liquidity_score ?? "N/A");

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
