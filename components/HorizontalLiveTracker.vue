<template>
  <div class="no-select ticker-widget" style="">
    <div style="height: 40px; padding: 0px; margin: 0px; width: 100%">
      <div>
        <div v-if="!isRefreshWidget" class="tradingview-widget-container">
          <ClientOnly>
            <TickerTape
              :options="{
                theme: darkMode ? 'dark' : 'light',
                isTransparent: true,
                symbols: tickers,
              }"
            />
          </ClientOnly>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HorizontalLiveTracker",

  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },
    userSettings: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      isRefreshWidget: true,
      tickers: [],
    };
  },
  watch: {
    "userSettings.TickerWidgetOption.Symbols": {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(newValue)) return;
        if (!_isEqual(newValue, oldValue)) {
          this.tickers = _cloneDeep(
            _map(newValue, (symbol, index) => {
              return {
                description: "",
                proName: symbol.TradingViewSymbol.Symbol,
              };
            }),
          );
        }
      },
    },
    darkMode(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.isRefreshWidget = true;
        setTimeout(() => {
          this.isRefreshWidget = false;
        }, 1);
      }
    },
    tickers(newValue, oldValue) {
      if (oldValue === newValue || _isNil(newValue)) return;

      if (!_isEqual(newValue, oldValue)) {
        this.isRefreshWidget = true;
        setTimeout(() => {
          this.isRefreshWidget = false;
        }, 1);
      }
    },
  },
  mounted() {
    if (_isNil(this.userSettings)) {
      this.tickers = [
        { description: "", proName: "BINANCE:BTCUSD" },
        { description: "", proName: "BINANCE:ETHUSD" },
        { description: "", proName: "FOREXCOM:SPXUSD" },
        { description: "", proName: "FOREXCOM:NSXUSD" },
        { description: "", proName: "FX_IDC:EURUSD" },
      ];
    } else {
      this.tickers = _cloneDeep(
        _map(this.userSettings.TickerWidgetOption.Symbols, (symbol, index) => {
          return { description: "", proName: symbol.TradingViewSymbol.Symbol };
        }),
      );
    }

    this.isRefreshWidget = false;
  },
};
</script>

<style scoped lang="scss">
.ticker-widget {
  max-height: 38px !important;
  overflow: hidden;
  box-sizing: border-box;
  border: 1px solid #282e3b;
  border-radius: 4px;
  text-align: right;
  line-height: 14px;
  block-size: 62px;
  font-size: 12px;
  font-feature-settings: normal;
  text-size-adjust: 100%;
  border: none !important;
  padding: 1px;
  padding: 0px;
  margin: 0px;
  width: 100%;
}
</style>
