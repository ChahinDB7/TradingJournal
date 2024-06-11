<template>
  <div>
    <ClientOnly>
      <apexchart
        :options="options"
        :series="series"
        :orders="allTrades"
        type="pie"
        :height="'450px'"
        class="apex-chart-pie"
        :class="{ 'is-dark-mode': darkMode }"
      />
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";

export default {
  name: "TradeDistribution",

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    allCountableTrades: {
      type: Array,
      required: true,
    },

    journal: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      series: [],
      tradeStatusConstants,
      totalTrades: 5,
      options: {
        totalOrders: 0,
        chart: {
          height: 450,
          type: "pie",
        },
        title: {
          text: "Trade distribution",
          align: "left",
        },
        dataLabels: {
          formatter(val, opts) {
            const name = opts.w.globals.labels[opts.seriesIndex];
            return [name, val.toFixed(1) + "%"];
          },
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
          },
        },
        tooltip: {
          y: {
            formatter: function (value, opts) {
              const totalOrders = Math.round(
                (value / 100) * opts.config.totalOrders,
              );
              return `${totalOrders} trades (${value}%)`;
            },
          },
        },
        responsive: [
          {
            breakpoint: 1000,
            options: {
              chart: {
                width: 1000,
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      },
    };
  },

  computed: {
    allTrades() {
      const allTrades = _cloneDeep(this.allCountableTrades);

      // Group by Symbol
      const groupedOrders = _groupBy(allTrades, "Symbol");

      // Convert the grouped data into the desired format
      const symbolsWithTotalOrders = _map(
        groupedOrders,
        (symbolOrders, Symbol) => ({
          Symbol,
          totalOrders: symbolOrders.length,
        }),
      );

      // Order by totalOrders and get the top 10
      const top10 = _slice(
        _orderBy(symbolsWithTotalOrders, "totalOrders", "desc"),
        0,
        10,
      );

      // Filter orders based on the top 10 symbols
      const filteredOrders = _filter(allTrades, (order) =>
        _includes(_map(top10, "Symbol"), order.Symbol),
      );

      return filteredOrders;
    },
  },

  watch: {
    "allTrades.length": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadPie();
      },
    },
  },

  mounted() {
    this.loadPie();
  },

  methods: {
    loadPie() {
      if (!_isEmpty(this.allTrades)) {
        const totalOrders = this.allTrades.length;

        // Group by Symbol
        const groupedOrders = _groupBy(this.allTrades, "Symbol");

        // Calculate percentages and map to desired format
        const formattedOrders = _map(groupedOrders, (symbolOrders, Symbol) => ({
          Symbol,
          totalOrders: symbolOrders.length,
          percentage: parseFloat(
            ((symbolOrders.length / totalOrders) * 100).toFixed(2),
          ),
          orders: symbolOrders,
        }));

        // Extract percentages and symbols
        const percentages = _map(formattedOrders, "percentage");
        const symbols = _map(formattedOrders, "Symbol");

        this.series = percentages;
        this.options = {
          ...this.options,
          ...{
            totalOrders: this.allTrades.length,
            labels: symbols,
          },
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.apex-chart-pie {
}
</style>
