class SwitchComponent extends Component {
  containerEl = null;

  constructor(props) {
    const watch = ["coin-toggled"];
    super(props, watch);
  }

  render() {
    const checkedProp = CryptoManager.findSelectedCrypto(this.props.id);
    const disabledProp = !checkedProp && CryptoManager.reachedMax;

    const containerEl = elementFromHTML(`
        <input class="form-check-input" type="checkbox" role="switch" id="${this.props.htmlFor}">
      `);

    if (checkedProp) containerEl.checked = true;
    if (disabledProp) containerEl.disabled = true;

    this.assignEvents(containerEl);

    this.containerEl = containerEl;
    return containerEl;
  }

  watchListeners() {
    const checkedProp = CryptoManager.findSelectedCrypto(this.props.id);
    const disabledProp = !checkedProp && CryptoManager.reachedMax;

    if (disabledProp) this.containerEl.disabled = true;
    else this.containerEl.disabled = null;
  }

  onClick($el) {
    if (!$el.checked) {
      CryptoManager.removeCoin(this.props.id);
      toggleSnackBar(`Card successfully removed from Portfolio ${CryptoManager.toggledCoins.length}/5 `);
    } else {
      CryptoManager.addCoin(this.props.id);
      toggleSnackBar(`Card successfully added to Portfolio ${CryptoManager.toggledCoins.length}/5 `);
    }
  }

  assignEvents(el) {
    el.addEventListener("click", this.onClick.bind(this, el));
  }
}
