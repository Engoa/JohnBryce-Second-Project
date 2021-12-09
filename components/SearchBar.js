class SearchBarComponent extends Component {
  containerEl = null;
  searchBar = null;
  searchBtn = null;
  resetBtn = null;
  $fuse = null;
  isActive = false;
  isVisited = false;

  FUSE_OPTIONS = {
    isCaseSensitive: false,
    includeMatches: true,
    threshold: 0.2,
    distance: 200,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    findAllMatches: false,
    location: 0,
    keys: ["symbol"],
  };

  constructor(props) {
    const watch = [];
    super(props, watch);
  }

  renderDataItem(item) {
    const el = elementFromHTML(`
        <a href="#coin?id=${item.id}" class="search__card">
            <div class="search__card--body">
            <div class="search__card--text">${item.symbol}</div>
            </div>
        </a>
    `);

    this.assignDataItemEvents(el, item);

    return el;
  }

  closeDropdown() {
    this.isActive = false;
    this.containerEl.querySelector(".search__results").classList.add("hidden");
  }
  openDropdown() {
    this.isActive = true;
    this.containerEl.querySelector(".search__results").classList.remove("hidden");
  }

  renderDataList(replaceWithEl, list) {
    const classList = classNames(["search__results", { hidden: !this.isActive }]);
    const container = elementFromHTML(`<div class="${classList}"></div>`);
    for (const item of list) {
      container.appendChild(this.renderDataItem(item));
    }

    this.assignDataLisEvents(container);

    $(replaceWithEl).replaceWith(container);
    return container;
  }

  appendInputGroup(containerEl) {
    this.searchBar = elementFromHTML(`<input type="text" class="form-control" placeholder="Search for a token">`);
    containerEl.querySelector(".input-group").appendChild(this.searchBar);
  }

  render() {
    const containerEl = elementFromHTML(`
        <div class="search__wrapper ${!isMobile ? "w-50" : ""}">
          <div class="input-group"></div>
          <div class="search__results"></div>
        </div>
    `);

    this.appendInputGroup(containerEl);

    this.renderDataList(containerEl.querySelector(".search__results"), CryptoManager.coins.slice(0, 10));

    this.containerEl = containerEl;
    this.assignInputEvents(this.searchBar);

    return containerEl;
  }

  assignInputEvents(el) {
    el.addEventListener("blur", this.onInputBlur.bind(this));
    el.addEventListener("focus", this.onInputFocus.bind(this));
    el.addEventListener("input", this.onInput.bind(this));
  }

  assignDataLisEvents(el) {
    el.addEventListener("mouseenter", this.onDataListMouseEnter.bind(this));
    el.addEventListener("mouseleave", this.onDataListMouseLeave.bind(this));
  }

  assignDataItemEvents(el, item) {
    el.addEventListener("click", this.onDataItemClick.bind(this, item));
  }

  onDataListMouseEnter(e) {
    this.isVisited = true;
  }

  onDataListMouseLeave(e) {
    this.isVisited = false;
  }

  onDataItemClick(item, e) {
    e.stopPropagation();
  }

  onInputFocus(e) {
    if (e.target.value?.length) {
      this.openDropdown();
    }
  }
  onInputBlur() {
    if (!this.isVisited) this.closeDropdown();
  }

  onInput(e) {
    this.openDropdown();
    this.$fuse = new Fuse(CryptoManager.coins, this.FUSE_OPTIONS);
    const searchResults = this.$fuse.search(e.target.value).map(({ item }) => item);
    this.renderDataList(this.containerEl.querySelector(".search__results"), searchResults);
  }
}
