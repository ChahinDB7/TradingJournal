<template>
  <div>
    <ClientOnly>
      <apexchart
        :options="options"
        :series="series"
        type="bar"
        :height="'450px'"
        class="apex-chart-bar"
        :class="{ 'is-dark-mode': darkMode }"
      />
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";
let currency = "$";

export default {
  name: "TradeDistributionPerformance",

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    currentCurrency: {
      type: Object,
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
      options: {
        chart: {
          foreColor: this.darkMode ? "#FFFFFF" : "#000000",
          background: this.darkMode ? "#131722" : "#FFFFFF",
          height: 450,
          type: "bar",
        },
        title: {
          text: "Total performance per symbol",
          align: "center",
        },
        plotOptions: {
          bar: {
            columnWidth: "45%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          textAnchor: "middle",
          style: {
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            colors: ["#000000"],
          },
          background: {
            enabled: true,
            foreColor: "#fff",
            padding: 15,
            borderRadius: 2,
            borderWidth: 1,
            borderColor: "#fff",
            opacity: 0.9,
            dropShadow: {
              enabled: false,
              top: 1,
              left: 1,
              blur: 1,
              color: "#000",
              opacity: 0.45,
            },
          },
          formatter: function (val, opt) {
            return `${currency} ${val.toFixed(2)}`;
          },
          dropShadow: {
            enabled: true,
          },
        },
        legend: {
          show: false,
        },
        tooltip: {
          theme: this.darkMode ? "Dark" : "Light",
        },
        xaxis: {
          categories: [],
          labels: {
            style: {
              colors: this.colors,
              fontSize: "12px",
            },
          },
        },
      },
    };
  },

  computed: {
    allTrades() {
      let allTrades = _cloneDeep(this.allCountableTrades);
      allTrades = _filter(allTrades, function (o) {
        return (
          o.Status !== tradeStatusConstants.IS_ONGOING_TRADE &&
          o.Status !== tradeStatusConstants.IS_SETUP
        );
      });

      // Group by Symbol
      const groupedOrders = _groupBy(allTrades, "Symbol");

      // Convert grouped data to desired format
      const symbolsWithTotalOrders = _map(
        groupedOrders,
        (symbolOrders, Symbol) => ({
          Symbol,
          totalOrders: symbolOrders.length,
        }),
      );

      // Order by totalOrders and get the top 10 symbols
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
    darkMode: {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(oldValue)) return;
        this.options = {
          ...this.options,
          ...{
            chart: {
              height: 450,
              foreColor: newValue ? "#FFFFFF" : "#000000",
              background: newValue ? "#131722" : "#FFFFFF",
            },
          },
        };
      },
    },

    "currentCurrency.symbol": {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(oldValue)) return;
        this.$emit("refresh-chart");
      },
    },

    "allTrades.length": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadStats();
      },
    },

    journal: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadStats();
      },
    },
  },

  mounted() {
    currency = this.currentCurrency.symbol;
    this.loadStats();
  },

  methods: {
    loadStats() {
      const groupedOrders = _groupBy(this.allTrades, "Symbol");

      const symbolsWithRealizedPnL = _map(
        groupedOrders,
        (symbolOrders, Symbol) => ({
          Symbol,
          totalRealizedPnL: _sumBy(symbolOrders, "RealizedPnL"),
        }),
      );

      const sortedOrders = _orderBy(
        symbolsWithRealizedPnL,
        ["totalRealizedPnL"],
        ["asc"],
      );

      const symbols = _map(sortedOrders, "Symbol");
      const realizedPnLs = _map(sortedOrders, "totalRealizedPnL");

      this.series = [
        {
          name: "Total Realized Pnl",
          data: realizedPnLs,
        },
      ];

      this.options = {
        ...this.options,
        ...{
          xaxis: {
            categories: symbols,
            labels: {
              style: {
                colors: this.colors,
                fontSize: "12px",
              },
            },
          },
          yaxis: {
            labels: {
              style: {
                fontSize: "12px",
                fontWeight: 600,
              },
              formatter: function (value) {
                try {
                  return `${currency} ${value.toFixed(2)}`;
                } catch (ex) {
                  return value;
                }
              },
            },
          },
        },
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.apex-chart-pie {
}
</style>
