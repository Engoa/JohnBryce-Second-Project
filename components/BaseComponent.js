class BaseComponent extends Component {
  containerEl = null;

  constructor(props) {
    const watch = [];
    super(props, watch);
  }

  render() {
    const containerEl = elementFromHTML(`
    <div>hello</div>
    `);

    this.containerEl = containerEl;
    this.assignEvents(containerEl);
    return containerEl;
  }

  assignEvents(el) {
    // el.addEventListener("click", this.onClick.bind(this, el));
  }
}
