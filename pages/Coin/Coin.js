(() => {
  class CoinPageComponent extends ModalComponent {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
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
        CryptoManager.selectedCoin = res;
        this.render();
        setLS(`coin`, CryptoManager.selectedCoin);
        if (!CryptoManager.selectedCoin) this.renderError(e);
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

      $(".coin-page__name__rank").html(`Rank #${CryptoManager.selectedCoin?.coingecko_rank ?? "N/A"}`);
      $(".coin-page__name__score").html(`Score #${CryptoManager.selectedCoin?.community_score ?? "N/A"}`);
      $(".coin-page__name__votes").html(`Votes #${CryptoManager.selectedCoin?.coingecko_score ?? "N/A"}`);
      $(".coin-page__name span").html(
        `${CryptoManager.selectedCoin?.name ?? "N/A"} (<b>${CryptoManager.selectedCoin?.symbol.toUpperCase() ?? "N/A"}</b>)`
      );
      $(".coin-page__price span").html("$" + this.formatToNumber(CryptoManager.selectedCoin?.market_data?.current_price?.usd));
      $(".coin-page__address span").html(CryptoManager.selectedCoin?.contract_address ?? "Unknown wallet address");
      $(".coin-page__image").attr("src", CryptoManager.selectedCoin?.image?.thumb);
      $(".coin-page__bottom__description").html(CryptoManager.selectedCoin?.description.en ?? "Unknown coin description");
      $(".usd").html(`<b>USD:</b> $${this.formatToNumber(CryptoManager.selectedCoin?.market_data.current_price?.usd ?? "N/A")}`);
      $(".eur").html(`<b>EUR:</b> €${this.formatToNumber(CryptoManager.selectedCoin?.market_data.current_price?.eur ?? "N/A")}`);
      $(".ils").html(`<b>ILS:</b> ₪${this.formatToNumber(CryptoManager.selectedCoin?.market_data.current_price?.ils ?? "N/A")}`);
      $(".supply").html(`${this.numberWithCommas(CryptoManager.selectedCoin?.market_data.total_supply ?? "N/A")}`);
      $(".circulating-supply").html(CryptoManager.selectedCoin?.market_data.circulating_supply ?? "N/A");
      $(".volume").html("$" + CryptoManager.selectedCoin?.market_data.total_volume.usd ?? "N/A");
      $(".liquidity").html(CryptoManager.selectedCoin?.liquidity_score ?? "N/A");

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
