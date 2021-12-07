class CardComponent extends Component {
  containerEl = null;

  constructor(props) {
    const watch = ["coin-toggled"];
    super(props, watch);
  }

  get isActive() {
    return !!CryptoManager.findSelectedCrypto(this.props.data.id);
  }

  render() {
    const { id, symbol } = this.props.data;

    const classList = classNames(["coins__item", { "coins__item--active": this.isActive }]);

    const containerEl = createElementFromHTML(`
        <label class="${classList}" for="coin__${id}">
          <div class="coins__details">
            <div class="coins__name">
              <span>${symbol}</span>
            </div>
            <div class="coins__btn">
              <a class="coins__btn btn btn-primary modal--link" href="#coin?id=${id}">More Info</a>
            </div>
           <div class="coins__toggle">
           <div class="form-check form-switch"></div>
           </div>
          </div>
        </label>
    `);

    const Switch = new SwitchComponent({ id, htmlFor: `coin__${id}` });

    containerEl.querySelector(".form-switch").appendChild(Switch.render());

    this.containerEl = containerEl;
    // this.mounted();
    return containerEl;
  }

  watchListeners() {
    if (!this.containerEl) return;
    if (this.isActive) this.containerEl.classList.add("coins__item--active");
    else this.containerEl.classList.remove("coins__item--active");
  }
}
