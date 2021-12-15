(() => {
  class CoinPageComponent extends Component {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);

    constructor(props) {
      super(props);
      this.fetchData();
    }
    get fetchRecommendedCoins() {
      let recommendedCoins = [];
      let n = 0;
      while (n < 3) {
        recommendedCoins.push(CryptoManager.coins[Math.floor(Math.random() * CryptoManager.coins.length)]);
        n++;
      }
      return recommendedCoins;
    }
    formatToNumber(num) {
      return num?.toLocaleString("fullwide", { useGrouping: true });
    }
    async fetchData() {
      const LSCoin = getLS("coin");
      try {
        if (LSCoin?.id === this.coinRaw.id) {
          CryptoManager.selectedCoin = LSCoin;
          this.render();
          // Check if available in local storage and if not, fetch from API
          // Coin Local storage will auto delete after 2 minutes everytime
        } else {
          AppGlobals.toggleLoader(true);
          const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);
          CryptoManager.selectedCoin = res;
          this.render();
          setLS(`coin`, CryptoManager.selectedCoin);
          if (!CryptoManager.selectedCoin) this.renderError(e);
        }
      } catch (e) {
        this.renderError(e);
        console.error(e);
      } finally {
        AppGlobals.toggleLoader(false);
        document.title = `Cryptonite | ${CryptoManager.selectedCoin?.name} `;
      }
    }

    onClick() {
      $(".coin-page__details .form-switch").on("click", () => {
        const isDisabled = this.checkBoxElement.disabled;
        if (isDisabled) dispatchToggleModal();
      });
    }

    render() {
      const coin = CryptoManager.selectedCoin || {};

      $(".coin-page__name__rank").html(`Rank #${coin?.coingecko_rank ?? "N/A"}`);
      $(".coin-page__name__score").html(`Score #${coin?.community_score ?? "N/A"}`);
      $(".coin-page__name__votes").html(`Votes #${coin?.coingecko_score ?? "N/A"}`);
      $(".coin-page__name span").html(`${coin?.name ?? "N/A"} (<b>${coin?.symbol.toUpperCase() ?? "N/A"}</b>)`);
      $(".coin-page__price span").html("$" + this.formatToNumber(coin?.market_data?.current_price?.usd ?? "N/A"));
      $(".coin-page__address span").html(coin?.contract_address ?? "Unknown wallet address");
      $(".coin-page__image").attr("src", coin?.image?.thumb);
      $(".coin-page__bottom__description").html(coin?.description.en ?? "Unknown coin description");
      $(".usd").html(`<b>USD:</b> $${this.formatToNumber(coin?.market_data.current_price?.usd ?? "N/A")}`);
      $(".eur").html(`<b>EUR:</b> €${this.formatToNumber(coin?.market_data.current_price?.eur ?? "N/A")}`);
      $(".ils").html(`<b>ILS:</b> ₪${this.formatToNumber(coin?.market_data.current_price?.ils ?? "N/A")}`);
      $(".supply").html(`${coin?.market_data?.total_supply?.toLocaleString() ?? "N/A"}`);
      $(".circulating-supply").html(coin?.market_data?.circulating_supply ?? "N/A");
      $(".volume").html("$" + coin?.market_data?.total_volume.usd ?? "N/A");
      $(".liquidity").html(coin?.liquidity_score ?? "N/A");

      this.fetchRecommendedCoins.map((coin) => $(".coin-recommended__list").append(new CardComponent({ data: coin }).render()));

      const id = Router.getCurrentQuery()?.id;
      const Switch = new SwitchComponent({ id });
      this.checkBoxElement = document.querySelector(".form-switch").appendChild(Switch.render());
      $(this.checkBoxElement).attr("id", "coin-page__checkbox");

      this.onClick();
      return this.checkBoxElement;
    }

    renderError(e) {
      $(".coin-page").html(`<p class="error">Error occoured, ${e?.responseJSON?.error} from the API</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
