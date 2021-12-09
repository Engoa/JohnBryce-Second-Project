const CryptoManager = {
  //DATA MEMBERS
  coins: [],
  toggledCoins: [],
  openedCoin: null,
  MAXtoggled: 5,
  $fuse: null,

  //COMPUTED
  get reachedMax() {
    return this.toggledCoins?.length >= this.MAXtoggled;
  },

  findCoin(id) {
    return this.coins.find((coin) => id === coin.id);
  },

  findCoinIndex(id) {
    return this.coins.findIndex((coin) => id === coin.id);
  },

  findBySymbol(symbol) {
    return this.toggledCoins.find((coin) => symbol === coin.symbol);
  },

  findSelectedCrypto(id) {
    return this.toggledCoins.find((coin) => id === coin.id);
  },

  findSelectedCryptoIndex(id) {
    return this.toggledCoins.findIndex((coin) => id === coin.id);
  },

  //METHODS

  async addCoin(id) {
    const exist = this.findSelectedCrypto(id);
    if (exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins.push(toggledCoin);
    document.dispatchEvent(new CustomEvent("coin-toggled"));
    const res = await this.fetchCoinByID(toggledCoin.id);
    this.toggledCoins[this.toggledCoins.length - 1] = res;
    setLS("toggled-coins", this.toggledCoins);
  },
  removeCoin(id) {
    const exist = this.findSelectedCrypto(id);
    if (!exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins = this.toggledCoins.filter((coin) => coin.id !== toggledCoin.id);
    this.coinToggled();
  },

  async getMoreInfo(id) {
    await this.fetchCoinByID(id);
  },
  async fetchCoins() {
    try {
      AppGlobals.toggleLoader();
      const response = await $.ajax("../assets/JSON/coins.json");
      this.coins = response.slice(4500, 5000);
      this.syncLSandUI();
      console.log(this.coins);
    } catch (error) {
      console.log(error);
    } finally {
      AppGlobals.toggleLoader();
    }
  },

  fetchCoinByID(coinID) {
    return $.ajax(`https://api.coingecko.com/api/v3/coins/${coinID}`);
  },

  fetchPrices(coins) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURI(coins)}&vs_currencies=usd`;
    return $.ajax(url);
  },

  syncLSandUI() {
    document.dispatchEvent(new CustomEvent("update-coins"));
    setLS("coins", this.coins);
  },
  coinToggled() {
    document.dispatchEvent(new CustomEvent("coin-toggled"));
    setLS("toggled-coins", this.toggledCoins);
  },
};

// $(document).on("update-coins", () => {
//   CryptoManager.$fuse = new Fuse(CryptoManager.coins, FUSE_OPTIONS);
// });

$(document).ready(() => {
  CryptoManager.fetchCoins();
  if (getLS("coins")) {
    CryptoManager.coins = getLS("coins");
  }
  if (getLS("toggled-coins")) {
    CryptoManager.toggledCoins = getLS("toggled-coins");
  }
});
