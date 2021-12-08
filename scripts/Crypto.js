const FUSE_OPTIONS = {
  isCaseSensitive: false,
  includeMatches: true,
  threshold: 0.2,
  keys: ["text", "completed", "fullDate", "time", "day"],
};

const CryptoManager = {
  //DATA MEMBERS
  coins: [],
  toggledCoins: [],
  openedCoin: null,
  loading: null,
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
    const res = await this.fetchCoinByID(toggledCoin.id);
    this.toggledCoins.push(res);
    this.coinToggled();
  },
  removeCoin(id) {
    const exist = this.findSelectedCrypto(id);
    if (!exist) return;
    const toggledCoin = this.findCoin(id);
    this.toggledCoins = this.toggledCoins.filter((coin) => coin.id !== toggledCoin.id);
    this.coinToggled();
  },

  async getMoreInfo(id) {
    // this.openedCoin = this.coins.find((coin) => id === coin.id);
    await this.fetchCoinByID(this.openedCoin.symbol);
    // document.dispatchEvent(new CustomEvent("coin-selected"));
  },
  async fetchCoins() {
    try {
      this.loading = true;
      const response = await $.ajax("../assets/JSON/coins.json");
      this.coins = response.slice(0, 100);
      this.syncLSandUI();
      console.log(this.coins);
    } catch (error) {
      console.log(error);
    } finally {
      this.loading = false;
    }
  },
  fetchCoinByID(coinID) {
    return $.ajax(`https://api.coingecko.com/api/v3/coins/${coinID}`);
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
