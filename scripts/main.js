// Run on each task object, of the coins array, and render them.

function createElementFromHTML(htmlString) {
  var div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  return div.firstChild;
}

const renderCoins = (searchResults) => {
  $(".coins").html(null);

  CryptoManager.coins.map((coin) => {
    const Card = new CardComponent({ data: coin });
    $(".coins").append(Card.render());
  });

  // const moreInfoBtn = document.querySelectorAll(".coin");
  // moreInfoBtn.forEach((btn) => {
  //   btn.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //     CryptoManager.getMoreInfo(btn.dataset.id);
  //   });
  // });
};

renderCoins();

const openCoinModal = () => {
  let modalHtml = "";
  modalHtml += `
        <p>${CryptoManager.openedCoin.symbol}</p>
       `;
  $(".modal__info").html(modalHtml);
};

// Get search results on input change, with mappedResults that fit the search values
// const searchInput = $(".search-task");
// searchInput.on("input", () => {
//   const mappedResults = ToDo.$fuse.search(searchInput.val()).map(({ item }) => item);
//   if (!mappedResults.length) {
//     $("#search-result-amount").html(`No Results - Showing all coins`);
//   } else {
//     $("#search-result-amount").html(`${mappedResults.length === 1 ? mappedResults.length + " Result" : mappedResults.length + " Results"}`);
//   }
//   renderCoins(mappedResults);
//   if (!searchInput.val()) {
//     $("#search-result-amount").html(``);
//     renderCoins();
//   }
// });

// Events to update UI
document.addEventListener("update-coins", () => {
  renderCoins();
});

document.addEventListener("coin-selected", () => {
  openCoinModal();
});
