<template>
  <div style="position: relative">
    <div class="radio-buttons">
      <div class="radio-list no-select" :class="{ 'is-dark-mode': darkMode }">
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="stroke"
            input-id="smooth-input"
            value="smooth"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="smooth-input"
            class="no-select clickable"
            @click="stroke = 'smooth'"
            >Smooth</label
          >
        </ui-form-field>
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="stroke"
            input-id="straight-input"
            value="straight"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="straight-input"
            class="no-select clickable"
            @click="stroke = 'straight'"
            >Straight</label
          >
        </ui-form-field>
        <ui-form-field class="radio-button">
          <ui-radio
            v-model="stroke"
            input-id="stepline-input"
            value="stepline"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="stepline-input"
            class="no-select clickable"
            @click="stroke = 'stepline'"
            >Stepline</label
          >
        </ui-form-field>
      </div>
      <div
        v-if="!refreshing"
        class="radio-list-2 no-select"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <ui-form-field v-if="showRadios.showSingleTrades" class="radio-button">
          <ui-radio
            v-model="sortBy"
            input-id="per-trade"
            value="per-trade"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="per-trade"
            class="no-select clickable"
            @click="sortBy = 'per-trade'"
            >Trades</label
          >
        </ui-form-field>
        <ui-form-field v-if="showRadios.showDaily" class="radio-button">
          <ui-radio
            v-model="sortBy"
            input-id="daily"
            value="daily"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="daily"
            class="no-select clickable"
            @click="sortBy = 'daily'"
            >Daily</label
          >
        </ui-form-field>
        <ui-form-field v-if="showRadios.showWeekly" class="radio-button">
          <ui-radio
            v-model="sortBy"
            input-id="weekly"
            value="weekly"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="weekly"
            class="no-select clickable"
            @click="sortBy = 'weekly'"
            >Weekly</label
          >
        </ui-form-field>
        <ui-form-field v-if="showRadios.showMonthly" class="radio-button">
          <ui-radio
            v-model="sortBy"
            input-id="monthly"
            value="monthly"
            class="balm-radio"
            :class="{ 'is-dark-mode': darkMode }"
          />
          <label
            for="monthly"
            class="no-select clickable"
            @click="sortBy = 'monthly'"
            >Monthly</label
          >
        </ui-form-field>
      </div>
    </div>
    <ClientOnly>
      <apexchart
        ref="chart"
        :height="'600px'"
        :options="options"
        :series="series"
        class="apex-chart-chart"
        type="line"
        :class="{ 'is-dark-mode': darkMode }"
      />
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";
import moment from "moment";
let currency = "$";

export default {
  name: "ChartJournal",

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
      refreshing: false,
      showRadios: {
        showSingleTrades: true,
        showDaily: true,
        showWeekly: true,
        showMonthly: true,
      },
      loadingChart: false,
      series: [],
      tradeStatusConstants,
      stroke: "smooth",
      sortBy: "daily",
      options: {
        colors: [this.darkMode ? "#FFFFFF" : "#000000"],
        chart: {
          id: "area-datetime",
          type: "line",
          height: 600,
          background: this.darkMode ? "#131722" : "#FFFFFF",
          foreColor: this.darkMode ? "#FFFFFF" : "#000000",
          zoom: {
            autoScaleYaxis: true,
          },
        },
        grid: {
          show: true,
          strokeDashArray: 2,
          borderColor: this.darkMode ? "#C7C7C7" : "#90A4AE",
        },
        title: {
          text: "Balance Curve",
          align: "left",
        },
        stroke: {
          curve: "smooth",
          width: 3,
          lineCap: "butt",
        },
        dataLabels: {
          enabled: true,
          background: {
            padding: 10,
            opacity: this.darkMode ? 0.6 : 0.8,
          },
          formatter: function (val, opts) {
            if (opts.dataPointIndex === 0) return "";
            return `${currency} ${val.toFixed(2)}`;
          },
          style: {
            fontSize: "14px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            colors: ["#000000"],
          },
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {},
        yaxis: {
          labels: {
            formatter: function (value) {
              return `${currency} ${value.toFixed(2)}`;
            },
          },
        },
        tooltip: {
          theme: this.darkMode ? "Dark" : "Light",
          x: {
            format: "dd MMM yyyy",
          },
        },
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
            chart: {
              foreColor: newValue ? "#FFFFFF" : "#000000",
              id: "vuechart-example",
              background: newValue ? "#131722" : "#FFFFFF",
              toolbar: {
                show: true,
              },
            },
            grid: {
              show: true,
              strokeDashArray: 2,
              borderColor: newValue ? "#C7C7C7" : "#90A4AE",
            },
            dataLabels: {
              enabled: true,
              background: {
                padding: 10,
                opacity: newValue ? 0.6 : 0.8,
              },
              formatter: function (val, opts) {
                if (opts.dataPointIndex === 0) return "";
                return `${currency} ${val.toFixed(2)}`;
              },
              style: {
                fontSize: "14px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: "bold",
                colors: ["#000000"],
              },
            },
            colors: [newValue ? "#FFFFFF" : "#000000"],
            annotations: {
              yaxis: [
                {
                  y: this.journal.StartBalance,
                  borderColor: newValue ? "#FFFFFF" : "#000000",
                  label: {
                    show: true,
                    offsetY: 6,
                    text: "Start balance",
                    style: {
                      color: newValue ? "#000000" : "#FFFFFF",
                      background: newValue ? "#FFFFFF" : "#000000",
                      fontSize: "12px",
                      fontFamily: "Arial",
                      borderRadius: 5,
                      padding: {
                        left: 10,
                        right: 10,
                        top: 5,
                        bottom: 5,
                      },
                    },
                  },
                },
              ],
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

        this.checkMonthlyWeekly();
        this.loadChart();
      },
    },

    journal: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;

        this.checkMonthlyWeekly();
        this.loadChart();
      },
    },

    sortBy: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadChart();
      },
    },

    stroke: {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(oldValue)) return;
        this.options = {
          ...this.options,
          ...{
            stroke: {
              curve: newValue,
              width: 3,
              lineCap: "butt",
            },
          },
        };
      },
    },
  },

  mounted() {
    currency = this.currentCurrency.symbol;
    this.checkMonthlyWeekly();
    this.loadChart();
  },

  methods: {
    loadChart() {
      this.loadingChart = true;
      const balanceList = [];
      const labelsChart = [];
      let startDay = "";
      const sortBy = this.sortBy;

      let allTrades = _cloneDeep(this.allCountableTrades);
      allTrades = _orderBy(allTrades, ["OpenTradeAt"], ["asc"]);

      if (!_isEmpty(allTrades)) {
        const firstTradeStart = allTrades[0].OpenTradeAt;
        startDay = moment(firstTradeStart).format("DD MMM YYYY");
        balanceList.push(this.journal.StartBalance);

        if (sortBy === "per-trade") labelsChart.push(1);
        else labelsChart.push(startDay);

        const mappedOrdersWithPeriod = _map(allTrades, (trade) => {
          const date = moment(trade.OpenTradeAt).format("DD MMM yyyy");
          const monthName = moment(trade.OpenTradeAt).format("MMMM");
          const weekNumber = moment(trade.OpenTradeAt).isoWeek();

          return {
            PnL: trade.RealizedPnL,
            date,
            monthName,
            weekNumber,
          };
        });

        const groupBy =
          sortBy === "weekly"
            ? "weekNumber"
            : sortBy === "monthly"
              ? "monthName"
              : "date";

        const groupedTrades = _groupBy(mappedOrdersWithPeriod, groupBy);

        const result = _map(groupedTrades, (values, key) => {
          const OpenTradeAt = key;
          const RealizedPnL = _reduce(
            values,
            (sum, value) => sum + value.PnL,
            0,
          );
          const Month = values[0].monthName;
          const Week = values[0].weekNumber;

          return { OpenTradeAt, RealizedPnL, Month, Week };
        });

        let accountBalanceDynamic = this.journal.StartBalance;
        const list = sortBy === "per-trade" ? allTrades : result;
        let count = 1;

        _forEach(list, function (trade, index) {
          trade.oldAccountBalance = accountBalanceDynamic;
          accountBalanceDynamic = accountBalanceDynamic + trade.RealizedPnL;
          trade.accountBalance = accountBalanceDynamic;

          const date = moment(trade.OpenTradeAt).format("DD MMM YYYY");
          balanceList.push(accountBalanceDynamic);

          if (sortBy === "per-trade") labelsChart.push("#" + count.toString());
          else if (sortBy === "weekly")
            labelsChart.push("Week " + trade.Week.toString());
          else if (sortBy === "monthly")
            labelsChart.push(trade.Month).toString();
          else labelsChart.push(date);
          count++;
        });
      }

      this.series = [
        {
          name: "Account balance",
          data: balanceList,
        },
      ];

      this.options = {
        ...this.options,
        ...{
          labels: labelsChart,
          yaxis: {
            labels: {
              formatter: function (value) {
                return `${currency} ${value.toFixed(2)}`;
              },
            },
          },
          annotations: {
            points: [
              {
                x: startDay,
                y: this.journal.StartBalance,
                offsetX: 5,
                marker: {
                  size: 8,
                  fillColor: "#fff",
                  radius: 2,
                  cssClass: "apexcharts-custom-class",
                },
              },
            ],
            yaxis: [
              {
                y: this.journal.StartBalance,
                borderColor: this.darkMode ? "#FFFFFF" : "#000000",
                label: {
                  show: true,
                  offsetY: 6,
                  text: "Start balance",
                  style: {
                    color: this.darkMode ? "#000000" : "#FFFFFF",
                    background: this.darkMode ? "#FFFFFF" : "#000000",
                    fontSize: "12px",
                    fontFamily: "Arial",
                    borderRadius: 5,
                    padding: {
                      left: 10,
                      right: 10,
                      top: 5,
                      bottom: 5,
                    },
                  },
                },
              },
            ],
          },
        },
      };

      setTimeout(() => {
        this.loadingChart = false;
      }, 100);
    },

    checkMonthlyWeekly() {
      const allTrades = _cloneDeep(this.allCountableTrades);
      const mappedTrades = _map(allTrades, (trade) => {
        const monthName = moment(trade.OpenTradeAt).format("MMMM");
        const weekNumber = moment(trade.OpenTradeAt).isoWeek();

        return {
          monthName,
          weekNumber,
        };
      });

      const groupByMonths = _groupBy(mappedTrades, "monthName");
      const groupByWeeks = _groupBy(mappedTrades, "weekNumber");
      const allMonths = _map(groupByMonths, (values, key) => {
        return key;
      });
      const allWeeks = _map(groupByWeeks, (values, key) => {
        return key;
      });

      this.showRadios = {
        showSingleTrades: true,
        showDaily: true,
        showWeekly: allWeeks.length > 1,
        showMonthly: allMonths.length > 1,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-buttons {
  position: absolute;
  z-index: 1;
  top: 10px;
  left: 150px;
  display: flex;
  gap: 30px;

  .radio-list,
  .radio-list-2 {
    width: fit-content;
    height: 0;
    display: flex;
    align-items: center;
    z-index: 1;
    gap: 20px;
    zoom: 95%;
  }

  @media (max-width: 1400px) {
    top: -15px;
    flex-direction: column;
  }
}

.apex-chart-chart {
  @media (max-width: 1400px) {
    margin-top: 20px;
  }
}
</style>
<style lang="scss">
.arrow_box {
  padding: 5px 10px;
  background-color: white;
  color: black;
  border-radius: 25px;
  display: flex;
  gap: 5px;
}
</style>
