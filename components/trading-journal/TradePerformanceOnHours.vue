<template>
  <div style="position: relative">
    <div class="radio-buttons" :class="{ top: journal.OptimizeForCFD }">
      <div
        v-if="journal.OptimizeForCFD"
        class="radio-list no-select"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="view"
            input-id="wins-losses-input"
            value="wins-losses"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="wins-losses-input"
            class="no-select clickable"
            @click="view = 'wins-losses'"
            >Wins/Losses</label
          >
        </ui-form-field>
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="view"
            input-id="long-short-input"
            value="long-short"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="long-short-input"
            class="no-select clickable"
            @click="view = 'long-short'"
            >Longs/Shorts</label
          >
        </ui-form-field>
      </div>
      <div class="radio-list-2 no-select" :class="{ 'is-dark-mode': darkMode }">
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="sortOn"
            input-id="sort-on-time-input"
            value="time"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="sort-on-time-input"
            class="no-select clickable"
            @click="sortOn = 'time'"
            >Time</label
          >
        </ui-form-field>
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="sortOn"
            input-id="low-to-high-input"
            value="low-to-high"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="low-to-high-input"
            class="no-select clickable"
            @click="sortOn = 'low-to-high'"
            >Low - High</label
          >
        </ui-form-field>
      </div>
    </div>

    <ClientOnly>
      <apexchart
        :options="options"
        :series="series"
        type="line"
        :height="'550px'"
        class="apex-chart-bar stacked"
        :class="{ 'is-dark-mode': darkMode }"
      />
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";
let currency = "$";

export default {
  name: "TradePerformanceOnHours",

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
      view: "wins-losses",
      series: [],
      tradeStatusConstants,
      sortOn: "time",
      totalTrades: 5,
      options: {
        chart: {
          type: "line",
          foreColor: this.darkMode ? "#FFFFFF" : "#000000",
          background: this.darkMode ? "#131722" : "#FFFFFF",
          height: 575,
          stacked: true,
          toolbar: {
            show: true,
          },
          zoom: {
            enabled: true,
          },
        },
        grid: {
          show: true,
          strokeDashArray: 2,
          borderColor: this.darkMode ? "#C7C7C7" : "#90A4AE",
        },
        stroke: {
          width: 2,
          curve: "smooth",
        },
        chartOptions: {
          color: "#FFFFFF",
        },
        colors: [
          this.darkMode ? "#089981" : "#089981",
          "#F23645",
          this.darkMode ? "#FFFFFF" : "#000000",
        ],
        title: {
          text: "Trade performance on daily hours",
          align: "left",
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return `${currency} ${value.toFixed(2)}`;
            },
          },
        },
        xaxis: {
          categories: [],
        },
        legend: {
          position: "right",
          offsetY: 40,
        },
        fill: {
          opacity: 1,
        },
        dataLabels: {
          formatter: function (val, opts) {
            return `${currency} ${val.toFixed(2)}`;
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            borderRadius: 0,
            dataLabels: {
              total: {
                enabled: true,
                style: {
                  fontSize: "13px",
                  fontWeight: 900,
                },
              },
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

  watch: {
    darkMode: {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(oldValue)) return;
        this.options = {
          ...this.options,
          ...{
            colors: [
              newValue ? "#089981" : "#089981",
              "#F23645",
              newValue ? "#FFFFFF" : "#000000",
            ],
            chart: {
              foreColor: newValue ? "#FFFFFF" : "#000000",
              background: newValue ? "#131722" : "#FFFFFF",
            },
            grid: {
              show: true,
              strokeDashArray: 2,
              borderColor: newValue ? "#C7C7C7" : "#90A4AE",
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

    "allCountableTrades.length": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadBar();
      },
    },

    journal: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadBar();
      },
    },

    view: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadBar();
      },
    },

    sortOn: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadBar();
      },
    },
  },

  mounted() {
    currency = this.currentCurrency.symbol;
    this.loadBar();
  },

  methods: {
    loadBar() {
      const allTrades = _cloneDeep(this.allCountableTrades);

      if (!_isEmpty(allTrades)) {
        const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
        const times = _map(allTrades, (trade) => {
          const [, hours, minutes] = trade.OpenTradeAt.match(timeRegex);
          return {
            time: `${hours}:${minutes}`,
            PnL: trade.RealizedPnL,
            direction: trade.Direction,
          };
        });

        const ordersByHour = _chain(times)
          .groupBy((order) => {
            const hour = parseInt(order.time.substring(0, 2));
            const roundedHour =
              (hour < 10 ? "0" : "") +
              (order.time.substring(3) < "30" ? hour : hour + 1) +
              ":00";
            if (roundedHour === "010:00") return "10:00";

            return roundedHour;
          })
          .map((orders, time) => {
            const buyPnL = _sumBy(_filter(orders, { direction: "Buy" }), "PnL");
            const sellPnL = _sumBy(
              _filter(orders, { direction: "Sell" }),
              "PnL",
            );
            const profitsPnL = _sumBy(
              _filter(orders, (o) => o.PnL > 0),
              "PnL",
            );
            const lossesPnL = _sumBy(
              _filter(orders, (o) => o.PnL < 0),
              "PnL",
            );
            return {
              time,
              orders,
              totalPnL: _sumBy(orders, "PnL"),
              buyPnL,
              sellPnL,
              profitsPnL,
              lossesPnL,
            };
          })
          .value();

        let ordersByHourSorted = _orderBy(
          ordersByHour,
          (order) => {
            const hour = parseInt(order.time.substring(0, 2));
            return hour < 9 ? hour + 24 : hour;
          },
          "asc",
        );
        if (this.sortOn === "low-to-high")
          ordersByHourSorted = _orderBy(ordersByHour, ["totalPnL"], ["asc"]);

        const labelsTimes = ordersByHourSorted.map((order) => order.time);
        const totalPnL = ordersByHourSorted.map((order) => order.totalPnL);

        let maxPositiveSum = _maxBy(ordersByHourSorted, (o) => o.profitsPnL);
        if (_isNil(maxPositiveSum) || maxPositiveSum.profitsPnL < 0)
          maxPositiveSum = 10;
        else maxPositiveSum = maxPositiveSum.profitsPnL * 1.6;

        let maxNegativeSum = _minBy(ordersByHourSorted, (o) => o.lossesPnL);
        if (_isNil(maxNegativeSum) || maxNegativeSum.lossesPnL > 0)
          maxNegativeSum = -10;
        else maxNegativeSum = maxNegativeSum.lossesPnL * 2;

        this.series = [];

        if (this.view === "wins-losses") {
          const profitsPnL = ordersByHourSorted.map(
            (order) => order.profitsPnL,
          );
          const lossPnL = ordersByHourSorted.map((order) => order.lossesPnL);

          this.series.push({
            name: "Profits",
            type: "column",
            data: profitsPnL,
          });

          this.series.push({
            name: "Losses",
            type: "column",
            data: lossPnL,
          });
        } else if (this.view === "long-short") {
          const longsPnL = ordersByHourSorted.map((order) => order.buyPnL);
          const sellPnL = ordersByHourSorted.map((order) => order.sellPnL);

          this.series.push({
            name: this.journal.OptimizeForCFD ? "Longs" : "Buys",
            type: "column",
            data: longsPnL,
          });

          this.series.push({
            name: this.journal.OptimizeForCFD ? "Shorts" : "Sells",
            type: "column",
            data: sellPnL,
          });
        }

        this.series.push({
          name: "Total realized PnL",
          type: "line",
          data: totalPnL,
        });

        this.options = {
          ...this.options,
          ...{
            yaxis: {
              min: maxNegativeSum,
              max: maxPositiveSum,
              labels: {
                formatter: function (value) {
                  return `${currency} ${value.toFixed(2)}`;
                },
              },
            },
            xaxis: {
              categories: labelsTimes,
            },
          },
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-buttons {
  position: absolute;
  z-index: 100;
  top: 10px;
  left: 300px;
  display: flex;
  gap: 30px;

  .radio-list,
  .radio-list-2 {
    width: fit-content;
    height: 0;
    display: flex;
    align-items: center;
    z-index: 500;
    gap: 20px;
    zoom: 95%;

    .radio-button {
      cursor: pointer;
      display: flex;
      align-items: flex-end;
    }

    &.is-dark-mode {
      .radio-button {
        color: white;
      }

      label {
        cursor: pointer;
      }
    }
  }

  &.top {
    @media (max-width: 1400px) {
      top: -15px;
      flex-direction: column;
    }
  }
}

.apex-chart-bar {
  @media (max-width: 1400px) {
    margin-top: 20px;
  }
}
</style>
