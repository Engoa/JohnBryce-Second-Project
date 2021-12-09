function elementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

class Component {
  uid = genUID();
  containerEl = null;
  watch = [];

  constructor(props = {}, watch = []) {
    this.watch = watch;
    this.props = props;
    this.created();
  }

  created() {
    if (this.watch.length) {
      for (const ev of this.watch) {
        document.addEventListener(ev, () => {
          this.watchListeners();
        });
      }
    }
  }

  render() {
    throw new Error("You need to implement the `template` method.");
  }

  watchListeners() {
    throw new Error("You need to implement the `watchListeners` method.");
  }
}
