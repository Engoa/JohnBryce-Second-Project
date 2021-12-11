class SearchBarComponent extends Component {
  containerEl = null;
  searchBar = null;
  searchBtn = null;
  resetBtn = null;
  $fuse = null;
  isActive = false;
  isVisited = false;
  drawnItems = 0;
  searchResults = [];

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
    this.containerEl.querySelector(".search__results-wrap").classList.add("hidden");
  }
  openDropdown() {
    this.isActive = true;
    this.containerEl.querySelector(".search__results-wrap").classList.remove("hidden");
  }

  lazyDrawDataItems(container, list, count) {
    const newLength = this.drawnItems + count;
    const sliced = list.slice(this.drawnItems, newLength);

    for (const item of sliced) {
      container.appendChild(this.renderDataItem(item));
    }

    this.drawnItems = newLength;
  }

  observeForLoadMore(container) {
    const loader = $(container).find(".search__loader");
    this.observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.lazyDrawDataItems($(container).find(".search__results")[0], this.searchResults, 10);

            if (this.drawnItems >= this.searchResults?.length && this.searchResults >= 11) {
              loader.addClass("d-none");
              this.observer.disconnect();
            }
          }
        }),
      {
        root: $(container).find(".search__results-wrap")[0],
        rootMargin: "50px",
        threshold: 1.0,
      }
    );

    this.observer.observe(loader[0]);
  }

  renderDataList(replaceWithEl, list) {
    const classList = classNames(["search__results", { hidden: !this.isActive }]);
    const container = elementFromHTML(`<div class="${classList}"></div>`);
    this.drawnItems = 0;
    this.lazyDrawDataItems(container, list, 10);

    this.assignDataListEvents(container);

    $(replaceWithEl).replaceWith(container);
    return container;
  }

  appendInputGroup(containerEl) {
    this.searchBar = elementFromHTML(`<input type="text" class="form-control" placeholder="Search for a token">`);
    containerEl.querySelector(".input-group").appendChild(this.searchBar);
  }

  render() {
    const containerEl = elementFromHTML(`
        <div class="search__wrapper ${!isMobile ? "w-75" : ""}">
          <div class="input-group"></div>
          <div class="search__results-wrap hidden">
            <div class="search__results"></div>
            <div class="search__loader"></div>
          </div>
        </div>
    `);

    this.appendInputGroup(containerEl);

    this.renderDataList(containerEl.querySelector(".search__results"), CryptoManager.coins.slice(0, 10));
    this.observeForLoadMore(containerEl);

    this.containerEl = containerEl;
    this.assignInputEvents(this.searchBar);

    return containerEl;
  }

  assignInputEvents(el) {
    el.addEventListener("blur", this.onInputBlur.bind(this));
    el.addEventListener("focus", this.onInputFocus.bind(this));
    el.addEventListener("input", this.onInput.bind(this));
    el.addEventListener("input", this.onNoValue.bind(this));
  }

  assignDataListEvents(el) {
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
  onNoValue(e) {
    if (!e.target.value.length) {
      this.closeDropdown();
    }
  }
  onInputBlur() {
    if (!this.isVisited) this.closeDropdown();
  }

  onInput(e) {
    this.openDropdown();
    this.$fuse = new Fuse(CryptoManager.coins, this.FUSE_OPTIONS);
    this.searchResults = this.$fuse.search(e.target.value).map(({ item }) => item);
    this.renderDataList(this.containerEl.querySelector(".search__results"), this.searchResults);
  }
}
