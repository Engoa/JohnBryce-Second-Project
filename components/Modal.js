function dispatchToggleModal() {
  document.dispatchEvent(new CustomEvent("modal-toggle"));
}
let alreadyCreated = false;
class ModalComponent extends Component {
  isActive = false;

  constructor(props) {
    const watch = ["modal-toggle", "route-update"];
    super(props, watch);

    if (!alreadyCreated) {
      alreadyCreated = true;
      this.assignClickoutside();
    }
  }

  assignClickoutside() {
    $(".modal__overlay").on("click", (e) => {
      const clickedOutside = !$(e.target).closest(".toggles__modal").length;
      if (clickedOutside && this.isActive) this.closeModal();
    });
  }

  closeModalonButton() {
    $("#closeModalBtn").on("click", () => {
      this.closeModal();
    });
  }

  closeModalOnEsc() {
    $(document).on("keyup", (e) => {
      if (e.keyCode === 27) this.closeModal();
    });
  }

  closeModal() {
    this.isActive = false;
    document.querySelector(".modal__overlay").classList.remove("active");
  }

  openModal() {
    this.isActive = true;
    document.querySelector(".modal__overlay").classList.add("active");
  }

  renderList() {
    const newListWrapper = elementFromHTML(`<div class="toggles__modal__coins"></div>`);

    CryptoManager.toggledCoins.forEach(({ name, id, symbol }) => {
      const el = elementFromHTML(`
        <label class="toggles__modal__coin" for="toggled__${id}">
            <a class="coins__btn modal--link" href="#coin?id=${id}">${name} - (${symbol})</a>
            <div class="form-check form-switch"></div>    
        </label>
      `);
      const Switch = new SwitchComponent({ id, htmlFor: `toggled__${id}` });
      el.querySelector(".form-switch").appendChild(Switch.render());

      newListWrapper.append(el);
    });

    $(".toggles__modal__coins").replaceWith(newListWrapper);
  }

  render() {
    this.renderList();
  }

  watchListeners(eventName) {
    if (!this.isActive) this.openModal();
    else this.closeModal();
    if (eventName === "route-update") this.closeModal();
    this.renderList();
    this.closeModalOnEsc();
    this.closeModalonButton();
  }
}
