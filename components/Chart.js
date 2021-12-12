const CHART_COLORS = (alpha = 1) => [
  `rgba(255, 99, 132, ${alpha})`,
  `rgba(54, 162, 235, ${alpha})`,
  `rgba(255, 206, 86, ${alpha})`,
  `rgba(75, 192, 192, ${alpha})`,
  `rgba(153, 102, 255, ${alpha})`,
  `rgba(255, 159, 64, ${alpha})`,
];

class ChartComponent extends Component {
  chartObj = null;

  constructor(props) {
    const watch = [];
    super(props, watch);
  }

  async render() {
    const ctx = document.getElementById("cryptoChart").getContext("2d");

    this.chartObj = new Chart(ctx, {
      type: "line",
      data: this.generateChartData(),
      options: {
        aspectRatio: !isMobile ? 16 / 9 : 1 / 1,
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        stacked: false,
        plugins: {
          title: {
            display: true,
            text: `${CryptoManager.toggledCoins.length} Selected Coins`,
            color: "rgb(255, 255, 255)",
          },
          subtitle: {
            color: "rgb(255, 255, 255)",
          },

          legend: {
            align: "start",
            color: "rgb(255, 255, 255)",
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            ticks: {
              callback: (value) => {
                return `${value}$`;
              },
            },
          },
        },
      },
    });

    const intervalId = setInterval(() => this.startAutoFetch(), 2000);
    AppGlobals.intervals.push(intervalId);
  }

  async startAutoFetch() {
    const coinsString = CryptoManager.toggledCoins.map((coin) => coin.id).join(",");

    const coinsPrices = await CryptoManager.fetchPrices(coinsString);
    this.updateChartWithPrices(coinsPrices);
  }

  updateChartWithPrices(pricesObject) {
    this.chartObj.data.labels.push(dayjs().format("hh:mm:ss"));
    this.chartObj.data.datasets.forEach((dataset) => {
      const coinId = CryptoManager.findBySymbol(dataset.label).id;
      const price = pricesObject[coinId].usd;
      dataset.data.push(price);
    });
    this.chartObj.update();
  }

  generateChartData() {
    const labels = CryptoManager.toggledCoins.map(() => dayjs().format("hh:mm:ss"));

    const datasets = CryptoManager.toggledCoins.map((coin, index) => {
      const price = coin.market_data?.current_price.usd || 0;
      return {
        label: coin.symbol,
        data: [0], // Starts at 0 and pushes PRICE to the data array after 2 seconds
        borderColor: CHART_COLORS()[index],
        backgroundColor: CHART_COLORS(0.5)[index],
      };
    });

    return {
      labels,
      datasets,
    };
  }
}
