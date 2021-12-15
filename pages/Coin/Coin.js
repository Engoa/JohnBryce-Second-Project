(() => {
  class CoinPageComponent extends Component {
    coinRaw = CryptoManager.findCoin(Router.getCurrentQuery().id);
    skeletonActive = true;

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
        this.renderSkeletons();
        if (LSCoin?.id === this.coinRaw.id) {
          CryptoManager.selectedCoin = LSCoin;
          this.render();
          // Check if available in local storage and if not, fetch from API
          // Coin Local storage will auto delete after 2 minutes everytime
        } else {
          if (!CryptoManager.selectedCoin) this.renderError(e);
          const res = await CryptoManager.fetchCoinByID(this.coinRaw.id);
          CryptoManager.selectedCoin = res;
          this.render();
          setLS(`coin`, CryptoManager.selectedCoin);
        }
      } catch (e) {
        this.renderError(e);
        console.error(e);
      } finally {
        this.toggleSkeleton();
        document.title = `Cryptonite | ${CryptoManager.selectedCoin?.name || "Coin"} `;
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
      $(".coin-page__bottom__description").html(
        coin?.description.en === "" || !coin?.description.en ? "Unknown coin description" : coin?.description.en
      );
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

    renderSkeletons() {
      $(".coin-page__top").css("display", "none");
      $(".bottom-wrapper").css("display", "none");
      // Make the current text dissapear

      $(".coin-page-skeleton-top").html(`
       <main>
  <ul class="o-vertical-spacing o-vertical-spacing--l">
    <li class="blog-post o-media">
      <div class="o-media__figure">
        <span class="skeleton-box" style="width:100px;height:80px;"></span>
      </div>
      <div class="o-media__body">
        <div class="o-vertical-spacing">
          <h3 class="blog-post__headline">
            <span class="skeleton-box" style="width:55%;"></span>
          </h3>
          <p>
            <span class="skeleton-box" style="width:90%;"></span>
            <span class="skeleton-box" style="width:83%;"></span>
          </p>
          <div class="blog-post__meta">
            <span class="skeleton-box" style="width:70px;"></span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</main>`);

      $(".coin-page-skeleton-bottom").html(`
      <main>
  <ul class="o-vertical-spacing o-vertical-spacing--l">
    <li class="blog-post o-media">
      <div class="o-media__figure">
        <span class="skeleton-box" style="width:100px;height:80px;"></span>
      </div>
      <div class="o-media__body">
        <div class="o-vertical-spacing">
          <h3 class="blog-post__headline">
            <span class="skeleton-box" style="width:55%;"></span>
          </h3>
          <p>
            <span class="skeleton-box" style="width:80%;"></span>
            <span class="skeleton-box" style="width:90%;"></span>
            <span class="skeleton-box" style="width:83%;"></span>
            <span class="skeleton-box" style="width:80%;"></span>
          </p>
          <div class="blog-post__meta">
            <span class="skeleton-box" style="width:70px;"></span>
          </div>
        </div>
      </div>
    </li>
    <li class="blog-post o-media">
      <div class="o-media__figure">
        <span class="skeleton-box" style="width:100px;height:80px;"></span>
      </div>
      <div class="o-media__body">
        <div class="o-vertical-spacing">
          <h3 class="blog-post__headline">
            <span class="skeleton-box" style="width:55%;"></span>
          </h3>
          <p>
            <span class="skeleton-box" style="width:80%;"></span>
            <span class="skeleton-box" style="width:90%;"></span>
            <span class="skeleton-box" style="width:83%;"></span>
            <span class="skeleton-box" style="width:80%;"></span>
          </p>
          <div class="blog-post__meta">
            <span class="skeleton-box" style="width:70px;"></span>
          </div>
        </div>
      </div>
    </li>
    <li class="blog-post o-media">
      <div class="o-media__figure">
        <span class="skeleton-box" style="width:100px;height:80px;"></span>
      </div>
      <div class="o-media__body">
        <div class="o-vertical-spacing">
          <h3 class="blog-post__headline">
            <span class="skeleton-box" style="width:55%;"></span>
          </h3>
          <p>
            <span class="skeleton-box" style="width:80%;"></span>
            <span class="skeleton-box" style="width:90%;"></span>
            <span class="skeleton-box" style="width:83%;"></span>
            <span class="skeleton-box" style="width:80%;"></span>
          </p>
          <div class="blog-post__meta">
            <span class="skeleton-box" style="width:70px;"></span>
          </div>
        </div>
      </div>
    </li>
  </ul>
</main>`);
    }

    toggleSkeleton() {
      if (this.skeletonActive) {
        $(".coin-page-skeleton-top").addClass("hidden");
        $(".coin-page-skeleton-bottom").addClass("hidden");
        this.skeletonActive = true;
      } else {
        $(".coin-page-skeleton-top").removeClass("hidden");
        $(".coin-page-skeleton-bottom").removeClass("hidden");
        this.skeletonActive = false;
      }

      $(".coin-page__top").css("display", "flex");
      $(".bottom-wrapper").css("display", "unset");
      // Render the data normally after hiding the skeleton
    }

    renderError(e) {
      $(".coin-page").html(`<p class="error">Error occoured, ${e?.responseJSON?.error} from the API</p>`);
    }
  }

  const cp = new CoinPageComponent();
})();
