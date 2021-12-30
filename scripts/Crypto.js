const CryptoManager = {
  //DATA MEMBERS
  coins: [],
  toggledCoins: [],
  selectedCoin: {},
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
  findByName(name) {
    return this.toggledCoins.find((coin) => name === coin.name);
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
  unToggleAllCoins() {
    this.toggledCoins.length = 0;
    this.coinToggled();
  },

  async fetchCoins() {
    try {
      AppGlobals.toggleLoader(true);
      const response = await $.ajax("https://api.coingecko.com/api/v3/coins/list");
      this.coins = response;
      this.syncLSandUI();
    } catch (error) {
      console.log(error);
    } finally {
      AppGlobals.toggleLoader(false);
    }
  },

  fetchCoinByID(coinID) {
    const url = `https://api.coingecko.com/api/v3/coins/${coinID}`;
    return $.ajax(url);
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

$(document).ready(() => {
  if (!getLS("coins")) CryptoManager.fetchCoins();
  else {
    AppGlobals.toggleLoader();
    CryptoManager.coins = getLS("coins");
  }

  if (getLS("toggled-coins")) CryptoManager.toggledCoins = getLS("toggled-coins");
  new ModalComponent().render();
});
