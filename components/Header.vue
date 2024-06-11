<template>
  <div
    class="header background-transition"
    :class="{ 'is-dark-mode': darkMode }"
  >
    <div class="left">
      <HamburgerMenu
        :window-options="windowOptions"
        :server-is-up="serverIsUp"
        :dark-mode="darkMode"
      />
    </div>
    <div
      class="right"
      style="display: flex; justify-content: flex-end; align-items: center"
    >
      <div class="icon">
        <Icon
          :name="showTickerWidget ? 'widget-on' : 'widget-off'"
          current-color
          :width="smallScreen ? 35 : 24"
          :height="smallScreen ? 35 : 24"
          clickable
          no-scaling-difference
          :tooltip="
            !showTickerWidget ? 'Show widget banner' : 'Hide widget banner'
          "
          @click="setOption('ticker-widget')"
        />
      </div>
      <div class="icon">
        <Icon
          :name="darkMode ? 'dark-mode' : 'light-mode'"
          current-color
          :width="smallScreen ? 35 : 24"
          :height="smallScreen ? 35 : 24"
          clickable
          no-scaling-difference
          :tooltip="!darkMode ? 'Set dark mode' : 'Set light mode'"
          @click="setOption('theme')"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/no-reserved-component-names
  name: "Header",
  props: {
    hasInitialLoadedUser: {
      type: Boolean,
      required: true,
    },
    userSettings: {
      type: Object,
      required: false,
      default: null,
    },
    serverIsUp: {
      type: Boolean,
      required: true,
    },
    windowOptions: {
      type: Object,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();
    const encryptionStore = EncryptionStore();
    const homeAPIStore = HomeAPIStore();
    const color = useColorMode();

    const setDark = () => {
      color.preference = color.value === "dark" ? "light" : "dark";
    };

    return { windowConfig, encryptionStore, homeAPIStore, color, setDark };
  },

  data() {
    return {
      startSpeech: false,
      showTickerWidget: true,
      darkMode: true,
      showChart: false,
      showCalculator: true,
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    homeStore() {
      if (_isNil(this.homeAPIStore.$state)) return {};
      return this.homeAPIStore.$state;
    },

    currentRouteName() {
      return this.$route.name;
    },

    smallScreen() {
      return this.windowOptions.windowWidth <= 1000;
    },

    showTutorialOnTop() {
      if (this.homeStore.tutorial.length <= 0) return false;
      if (_isNil(this.userSettings)) return true;
      else return this.userSettings.ShowTutorialOnTopbar;
    },
    showAnnouncementsOnTop() {
      return this.homeStore.announcements.length > 0;
    },
  },

  watch: {
    "windowOptions.windowWidth": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.checkChartWidth();
      },
    },
    hasInitialLoadedUser: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.getSettings();
      },
    },
    "windowStore.windowOptions.showChart": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (this.showChart !== newValue) {
          this.showChart = newValue;
          this.updateSettings();
        }
      },
    },
    "windowStore.windowOptions.startSpeech": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (this.startSpeech !== newValue) {
          this.startSpeech = newValue;
          this.updateSettings(false);
        }
      },
    },
    darkMode: {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (newValue) localStorage.removeItem("dark-mode");
        else localStorage.setItem("dark-mode", false);
      },
    },
    "userSettings.CalculatorOption.ShowCalculator": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (this.ShowCalculator !== newValue) {
          this.ShowCalculator = newValue;
          this.updateSettings(false);
        }
      },
    },
    "userSettings.CalculatorOption.ShowMultipleCharts": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (this.showChart !== newValue) {
          this.showChart = newValue;
          this.updateSettings(false);
        }
      },
    },
    "userSettings.TickerWidgetOption.ShowWidget": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || _isNil(newValue))
          return;
        if (this.showTickerWidget !== newValue) {
          this.showTickerWidget = newValue;
          this.updateSettings(false);
        }
      },
    },
  },

  mounted() {
    if (localStorage.getItem("dark-mode") === "false") {
      this.darkMode = false;
      this.windowConfig.setSingleConfig({
        type: "darkMode",
        value: this.darkMode,
      });
    }

    this.getSettings(true);
  },

  methods: {
    async setOption(type) {
      if (type === "chart") {
        if (this.windowOptions.windowWidth < 1350) {
          this.$noty.info("The screen is too small to fit the charts.");
          return;
        }

        if (!this.showCalculator) return;
        this.showChart = !this.showChart;
      } else if (type === "theme") {
        this.darkMode = !this.darkMode;
      } else if (type === "ticker-widget") {
        this.showTickerWidget = !this.showTickerWidget;
      } else if (type === "calculator") {
        if (!this.showChart) return;
        this.showCalculator = !this.showCalculator;
      } else if (type === "start-speech") {
        this.startSpeech = !this.startSpeech;
      }

      this.updateSettings();
    },
    updateSettings(update = true) {
      this.windowConfig.setSingleConfig({
        type: "darkMode",
        value: this.darkMode,
      });
      this.windowConfig.setSingleConfig({
        type: "showCalculator",
        value: this.showCalculator,
      });
      this.windowConfig.setSingleConfig({
        type: "showChart",
        value: this.showChart,
      });
      this.windowConfig.setSingleConfig({
        type: "showTickerWidget",
        value: this.showTickerWidget,
      });
      this.windowConfig.setSingleConfig({
        type: "startSpeech",
        value: this.startSpeech,
      });

      setTimeout(() => {
        if (this.isLoggedIn && !_isNil(this.userSettings) && update) {
          const newUserSettings = _cloneDeep(this.userSettings);
          newUserSettings.DarkMode = this.darkMode;
          newUserSettings.CalculatorOption.ShowCalculator = this.showCalculator;
          newUserSettings.CalculatorOption.ShowMultipleCharts = this.showChart;
          newUserSettings.TickerWidgetOption.ShowWidget = this.showTickerWidget;

          this.homeAPIStore.updateSettings({
            UserOption: newUserSettings,
            Tables: ["CalculatorOption", "TickerWidgetOption", "UserOption"],
          });
        }
      }, 100);
    },

    isDisabled(type) {
      if (type === "calculator") {
        return !this.showChart;
      } else if (type === "chart") {
        return !this.showCalculator;
      }
    },
    checkChartWidth() {
      if (this.showChart && this.windowOptions.windowWidth < 1350) {
        this.showChart = !this.showChart;
        this.$noty.info("The screen is too small to fit the charts.");
        this.windowConfig.setSingleConfig({
          type: "showChart",
          value: this.showChart,
        });
      }
    },
    async getSettings(initial = false) {
      if (!this.isLoggedIn || _isNil(this.userSettings)) return;

      const settings = this.userSettings;

      this.darkMode = settings.DarkMode;
      this.showCalculator = settings.CalculatorOption.ShowCalculator;
      this.showChart = settings.CalculatorOption.ShowMultipleCharts;

      if (
        !settings.CalculatorOption.ShowMultipleCharts &&
        !settings.CalculatorOption.ShowCalculator
      )
        this.showCalculator = true;
      this.showTickerWidget = settings.TickerWidgetOption.ShowWidget;

      this.windowConfig.setConfig({
        ...this.windowStore.windowOptions,
        ...{
          darkMode: this.darkMode,
          showCalculator: this.showCalculator,
          showChart: this.showChart,
          showTickerWidget: this.showTickerWidget,
        },
      });

      setTimeout(() => {
        this.checkChartWidth();
      }, 100);
    },

    navigatePage(name) {
      this.$router.push({ name: name });
    },
  },
};
</script>

<style scoped lang="scss">
.header {
  overflow: hidden;
  background-color: #121212;
  color: white;
  display: flex;
  padding: 0 10px;
  align-items: center;
  justify-content: flex-end;
  height: 40px;
  border-bottom: 1px solid #808080;

  &.is-dark-mode {
    background-color: #131722;
    border-bottom: 1px solid white;
  }
  .right > .icon {
    width: 30px;
    text-align: center;
    cursor: pointer;
    max-height: 24px;
  }

  div > .is-chart-on > svg {
    background-color: yellow !important;
    fill: white !important;
    stroke: black !important;
  }

  .left {
    display: none;
  }

  @media (max-width: 1000px) {
    height: 150px;
    padding: 0 20px;
    justify-content: space-between;

    .left {
      display: block;
    }

    .right {
      gap: 10px;
    }
  }
}
</style>
