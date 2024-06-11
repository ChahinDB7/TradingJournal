<template>
  <div :id="container" ref="tradingview" />
</template>

<script>
import useInitWidget from "@/composables/useInitWidget";
import uuidv4 from "uuid/v4";

export default {
  name: "WTickerTape",
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    symbols: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: "dark",
    },
  },
  setup(props) {
    const uniqueId = uuidv4();

    const options = {
      symbols: props.symbols,
      showSymbolLogo: true,
      colorTheme: props.theme,
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en",
      ...props.options,
    };

    const { container, tradingview } = useInitWidget(
      options,
      "tradingview-ticker-tape",
      `tradingview-ticker-tape-script-${uniqueId}`,
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js",
    );

    return { optionsTape: options, container, tradingview };
  },
  watch: {},
};
</script>
