<template>
  <div>
    <div class="radio-list no-select" :class="{ 'is-dark-mode': darkMode }">
      <ui-form-field class="radio-button">
        <ui-radio
          v-model="chartOrientation"
          input-id="horizontal-input"
          value="horizontal"
          class="balm-radio"
          :class="{ 'is-dark-mode': darkMode }"
        />
        <label
          for="horizontal-input"
          class="no-select clickable"
          @click="chartOrientation = 'horizontal'"
        >
          <Icon
            name="chart-arrow-horizontal"
            large
            style="margin-right: 12px; cursor: pointer"
          />
        </label>
      </ui-form-field>
      <ui-form-field class="radio-button">
        <ui-radio
          v-model="chartOrientation"
          input-id="verticle-input"
          value="verticle"
          class="balm-radio"
          :class="{ 'is-dark-mode': darkMode }"
        />
        <label
          for="verticle-input"
          class="no-select clickable"
          @click="chartOrientation = 'verticle'"
        >
          <Icon
            name="chart-arrow-verticle"
            large
            style="margin-right: 12px; cursor: pointer"
          />
        </label>
      </ui-form-field>
    </div>
    <ClientOnly>
      <apexchart
        ref="chart"
        :height="'600px'"
        :options="options"
        :series="series"
        class="apex-chart-chart"
        type="bar"
        :class="{ 'is-dark-mode': darkMode }"
      />
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";
let currency = "$";

export default {
  name: "TagsCurve",

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
      chartOrientation: "horizontal",
      loadingChart: false,
      series: [],
      categories: [],
      colors: [],
      tradeStatusConstants,
      options: {
        chart: {
          id: "tag-curve",
          type: "bar",
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
          text: "Tags performance",
          align: "center",
        },
        plotOptions: {
          bar: {
            barHeight: "50%",
            distributed: true,
            horizontal: true,
            dataLabels: {
              position: "center",
            },
          },
        },
        colors: [],
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
        stroke: {
          width: 1,
          colors: [this.darkMode ? "#FFF" : "#000"],
        },
        annotations: {
          xaxis: [
            {
              x: 0,
              strokeDashArray: 0,
              borderColor: this.darkMode ? "#FFFFFF" : "#000000",
            },
          ],
        },
        markers: {
          size: 0,
          style: "hollow",
        },
        xaxis: {
          tickAmount: 10,
          categories: [],
          labels: {
            style: {
              fontSize: "12px",
              fontWeight: 600,
            },
            formatter: function (value) {
              return `${currency} ${value.toFixed(2)}`;
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
              return value;
            },
          },
        },
        tooltip: {
          theme: this.darkMode ? "Dark" : "Light",
          y: {
            formatter: function (value) {
              return `${currency} ${value.toFixed(2)}`;
            },
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
              id: "tag-curve",
              type: "bar",
              height: this.categories.length > 4 ? 600 : 400,
              background: newValue ? "#131722" : "#FFFFFF",
              foreColor: newValue ? "#FFFFFF" : "#000000",
              zoom: {
                autoScaleYaxis: true,
              },
            },
            stroke: {
              width: 1,
              colors: [newValue ? "#FFF" : "#000"],
            },
            annotations: {
              xaxis: [
                {
                  x: 0,
                  strokeDashArray: 0,
                  borderColor: newValue ? "#FFFFFF" : "#000000",
                },
              ],
            },
            grid: {
              show: true,
              strokeDashArray: 2,
              borderColor: newValue ? "#C7C7C7" : "#90A4AE",
            },
            tooltip: {
              theme: newValue ? "Dark" : "Light",
              y: {
                formatter: function (value) {
                  return `${currency} ${value.toFixed(2)}`;
                },
              },
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
        this.loadChart();
      },
    },

    chartOrientation: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (newValue === "verticle")
          localStorage.setItem(
            "trading-journal-tags-performance-verticle",
            "Yes",
          );
        else
          localStorage.removeItem("trading-journal-tags-performance-verticle");

        this.loadChart();
      },
    },

    journal: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadChart();
      },
    },
  },

  mounted() {
    if (
      localStorage.getItem("trading-journal-tags-performance-verticle") ===
      "Yes"
    )
      this.chartOrientation = "verticle";
    currency = this.currentCurrency.symbol;
    this.loadChart();
  },

  methods: {
    loadChart() {
      this.loadingChart = true;
      const categories = [];
      const chartOrientation = this.chartOrientation;

      let allTrades = _cloneDeep(this.allCountableTrades);
      allTrades = _filter(allTrades, function (trade) {
        return !_isEmpty(trade.Tags);
      });
      allTrades = _orderBy(allTrades, ["OpenTradeAt"], ["asc"]);
      let colors = [];

      if (!_isEmpty(allTrades)) {
        const allTags = _flatMap(allTrades, (trade) => {
          const tags = trade.Tags;
          if (_size(tags) > 0) {
            return _map(tags, (tag, index) => {
              return { ...tag, RealizedPnL: trade.RealizedPnL, Trade: trade };
            });
          } else {
            return [];
          }
        });

        const groupedTags = _groupBy(allTags, "Name");
        let tagsArray = _map(groupedTags, (tags, name) => ({
          name,
          totalPnL: _sumBy(tags, (tag) => {
            return tag.RealizedPnL;
          }),
          color: tags[0].Color,
        }));
        tagsArray = _orderBy(tagsArray, ["totalPnL"], ["desc"]);
        const seriesData = [];

        _forEach(tagsArray, function (tagObj, index) {
          colors.push(tagObj.color);
          categories.push(tagObj.name);
          seriesData.push(tagObj.totalPnL);
        });

        this.series = [
          {
            data: seriesData,
            name: "Total Realized PnL",
          },
        ];
      }

      this.categories = categories;
      let height = categories.length > 4 ? 600 : 400;
      if (chartOrientation === "verticle") height = 600;

      if (_isEmpty(colors)) colors = [this.darkMode ? "#FFFFFF" : "#000000"];

      this.colors = colors;
      this.options = {
        ...this.options,
        ...{
          colors: colors,
          chart: {
            id: "tag-curve",
            type: "bar",
            height: height,
            background: this.darkMode ? "#131722" : "#FFFFFF",
            foreColor: this.darkMode ? "#FFFFFF" : "#000000",
            zoom: {
              autoScaleYaxis: true,
            },
          },
          plotOptions: {
            bar: {
              barHeight: "50%",
              distributed: true,
              horizontal: chartOrientation === "horizontal",
              dataLabels: {
                position: "center",
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
                if (chartOrientation === "horizontal") return value;
                return `${currency} ${value.toFixed(2)}`;
              },
            },
          },
          xaxis: {
            tickAmount: 10,
            categories: categories,
            labels: {
              formatter: function (value) {
                if (chartOrientation === "verticle") return value;
                return `${currency} ${value.toFixed(2)}`;
              },
            },
          },
        },
      };

      setTimeout(() => {
        this.loadingChart = false;
      }, 100);
    },

    convertToRGB(hex) {
      const r = parseInt(hex.substr(1, 2), 16);
      const g = parseInt(hex.substr(3, 2), 16);
      const b = parseInt(hex.substr(5, 2), 16);
      return r + ", " + g + ", " + b;
    },
  },
};
</script>

<style lang="scss" scoped>
.radio-list,
.radio-list-2 {
  width: fit-content;
  height: 0;
  display: flex;
  align-items: center;
  z-index: 500;
  position: relative;
  top: 12px;
  zoom: 95%;

  .radio-button {
    cursor: pointer;
    display: flex;
    align-items: flex-end;
  }

  &.radio-list-2 {
    left: 560px;
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
