import { defineStore, acceptHMRUpdate } from "pinia";
import mathNotationConstants from "@/lib/math-notation-constants";
import mathNotationTranslations from "@/lib/math-notation-translations";
import uuidv4 from "uuid/v4";
import moment from "moment";

export const WindowConfigStore = defineStore({
  id: "windowConfig",
  state: () => ({
    windowOptions: {
      disableAutomaticApplyLeverage: false,
      darkMode: true,
      loadingAPI: false,
      showCalculator: true,
      showChart: false,
      futureMode: false,
      isInversePerpetual: false,
      calculateShares: false,
      riskRewardRatio: false,
      smallMenu: false,
      firstLoadedCurrencyCheckboxesContainer: false,
      newAnnouncement: false,
      currentTimezone: "",
      hasLoadedFields: false,
      tradingJournalFields: {},
      showMarginWarning: true,
      mathNotation: 0,
      didWarnedForexMessage: false,
      didWarnedCryptoMessage: false,
      currentCurrency: "USD",
      currentCurrencySymbol: "$",
      windowScaling: 100,
      currentMode: "Normal",
      startSpeech: false,
      showTickerWidget: true,
      currentSelectedCryptoModeItem: {
        value: "BTC",
        mode: "Crypto",
        contractSize: 1,
        pair: "BTCUSD",
        leadingZeros: 100,
      },
      currentSelectedForexModeItem: {
        value: "EURUSD",
        mode: "Forex",
        contractSize: 100000,
        forexRate: 0,
        minimum_change: 0.0001,
        leadingZeros: 100000,
      },
      dialogVisible: false,
      windowOptions: {
        smallMenu: false,
        windowWidth: 0,
        scrollY: 0,
        isMobile: false,
      },
    },
    currencies: [
      {
        id: 1,
        text: "USD",
        symbol: "$",
      },
      {
        id: 2,
        text: "EUR",
        symbol: "€",
      },
      {
        id: 3,
        text: "GBP",
        symbol: "£",
      },
      {
        id: 4,
        text: "JPY",
        symbol: "¥",
      },
      {
        id: 5,
        text: "CAD",
        symbol: "$",
      },
      {
        id: 6,
        text: "AUD",
        symbol: "$",
      },
      {
        id: 7,
        text: "CHF",
        symbol: "₣",
      },
      {
        id: 8,
        text: "NZD",
        symbol: "$",
      },
    ],
  }),
  getters: {},
  actions: {
    setConfig(payload) {
      this.windowOptions = payload;
    },
    setSingleConfig(payload) {
      this.windowOptions[payload.type] = payload.value;
    },
    setTradingJournalFields(payload) {
      const fields = {};

      _forEach(payload, function (field) {
        fields[field.Name] = {
          name: field.Name,
          label: field.Label,
          visible: field.Visible,
        };
      });

      this.windowOptions.tradingJournalFields = fields;
      this.windowOptions.hasLoadedFields = true;
    },
    sleep(delay) {
      const start = new Date().getTime();
      while (new Date().getTime() < start + delay);
    },
    getTagStyle(tag) {
      let rgb = tag.RGB;
      const darkMode = this.windowOptions.darkMode;
      if (darkMode && rgb === "0, 0, 0") rgb = "255, 255, 255";
      else if (!darkMode && rgb === "255, 255, 255") rgb = "0, 0, 0";

      return {
        color: "rgb(" + rgb + ")",
        backgroundColor: "rgba(" + rgb + ", 0.1)",
      };
    },
    generateId() {
      return uuidv4();
    },
    getCurrentDateTime() {
      return moment().format("YYYY-MM-DD HH:mm:ss.SSSSSSS");
    },
    formatNumber(price, roundOn2Decimals = false, blockLargeNumbers = false) {
      if (typeof price === "string") price = parseFloat(price);

      let numberFormat =
        mathNotationTranslations[this.windowOptions.mathNotation];
      const compact =
        numberFormat ===
        mathNotationTranslations[mathNotationConstants.COMPACT];

      const format = {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };

      if (!roundOn2Decimals) {
        format.roundingIncrement = 5;
      }

      if (compact) {
        numberFormat = "en-US";
        format.notation = "compact";
      }

      const nf = new Intl.NumberFormat(numberFormat, format);
      let newPrice = nf.format(price);

      if (blockLargeNumbers && newPrice.length > 15) {
        return "Error";
      }

      if (compact) {
        newPrice = newPrice.replace("K", "k");
        newPrice = newPrice.replace("M", "m");
        newPrice = newPrice.replace("B", "b");
        newPrice = newPrice.replace("T", "t");
      }

      return newPrice;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(WindowConfigStore, import.meta.hot));
}
