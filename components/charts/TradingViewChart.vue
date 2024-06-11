<template>
  <div class="chart">
    <ClientOnly>
      <div :id="uniqueId" class="tradingview-chart" />
    </ClientOnly>
  </div>
</template>
<script>
import uuidv4 from "uuid/v4";

export default {
  name: "TradingViewChart",
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    symbol: {
      type: String,
      required: true,
    },
    autosize: {
      type: Boolean,
      required: false,
      default: true,
    },
    hideSideToolbar: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideTopToolbar: {
      type: Boolean,
      required: false,
      default: false,
    },
    candleStyle: {
      type: String,
      required: false,
      default: "1",
    },
    interval: {
      type: String,
      required: false,
      default: "D",
    },
    theme: {
      type: String,
      required: false,
      default: "dark",
    },
  },
  setup() {
    const uniqueId = uuidv4();
    return {
      uniqueId,
    };
  },
  watch: {
    theme: {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(newValue)) return;
        this.initWidget();
      },
    },
  },
  mounted() {
    this.$nextTick(async () => {
      await this.appendScript();
      this.initWidget();
    });
  },
  methods: {
    initWidget() {
      const defaultOptions = {
        symbol: this.symbol,
        interval: this.interval,
        theme: this.theme,
        style: this.candleStyle,
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
        autosize: this.autosize,
        hide_side_toolbar: this.hideSideToolbar,
        hide_top_toolbar: this.hideTopToolbar,
        container_id: this.uniqueId,
      };
      setTimeout(() => {
        if (typeof window.TradingView === "undefined") return;

        const options = { ...defaultOptions, ...this.options };
        if (options.container_id !== this.uniqueId) {
          console.error(
            'container_id in Chart component must be "tradingview-chart"',
          );
          return;
        }
        new window.TradingView.widget(
          Object.assign({ container_id: this.uniqueId }, options),
        );
      }, 100);
    },
    appendScript() {
      return new Promise((resolve, reject) => {
        if (document.getElementById(this.uniqueId + "-script")) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.id = this.uniqueId + "-script";
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://s3.tradingview.com/tv.js";

        script.onload = () => {
          resolve();
        };

        script.onerror = () => {
          reject(new Error("Failed to load TradingView script"));
        };

        document.getElementsByTagName("head")[0].appendChild(script);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
  position: relative;
  .tradingview-chart {
    width: 100%;
    height: 100%;
  }
}
</style>
