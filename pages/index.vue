<template>
  <div v-if="loadingTradingJournal" class="loading-box">
    <Loader :dark-mode="darkMode" :message="'Getting information...'" />
  </div>
  <div v-else class="journal-container">
    <div
      v-if="!isLoggedIn"
      class="demo-tag card-item clickable"
      :class="{ 'is-dark-mode': darkMode }"
      @click.self="closeWelcome(true)"
    >
      You're viewing the demo version of the Trading Journal.
      <span class="underline" @click.self="closeWelcome(true)">Sign up</span> to
      create your own Trading Journal.
      <div class="refresh" @click="$emit('reload-demo-trades', true)">
        <Icon name="refresh" tooltip="Reset Trading Journal" />
      </div>
    </div>
    <div
      class="top-bar card-item background-transition"
      :class="{ 'is-dark-mode': darkMode }"
    >
      <TradingJournalCardTop
        :user-settings="userSettings"
        :journals="tradingJournals"
        :show-banner="hasTradingJournal"
        :has-trading-journal="hasTradingJournal"
        :user="user"
        :dark-mode="darkMode"
        :is-loading="isLoading"
        :current-journal="currentJournal"
        @set-current-journal="setActiveJournal"
      />
    </div>
    <Journal
      v-for="journal in tradingJournals"
      :key="journal.Id"
      :journal="journal"
      :journals="tradingJournals"
      :window-options="windowOptions"
      :has-initial-loaded-user="hasInitialLoadedUser"
      :user-settings="userSettings"
      :login-visible="loginVisible"
      :user="user"
      :selected-journal="currentJournal"
    />
    <CustomDialog
      v-show="demoWelcomeVisible"
      :dark-mode="darkMode"
      :dialog-width="'600px'"
      @secondary-button="demoWelcomeVisible = false"
    >
      <template #body>
        <DemoWelcomeDialogBody
          :dark-mode="darkMode"
          :dialog-visible="demoWelcomeVisible"
          @show-modal="demoWelcomeVisible = true"
          @primary-button="closeWelcome"
          @secondary-button="closeWelcome"
        />
      </template>
    </CustomDialog>
  </div>
</template>
<script>
export default {
  name: "TradingJournal",

  props: {
    hasInitialLoadedUser: {
      type: Boolean,
      required: true,
    },
    windowOptions: {
      type: Object,
      required: true,
    },
    userSettings: {
      type: Object,
      required: false,
      default: null,
    },
    loginVisible: {
      type: Boolean,
      required: true,
    },
    welcomeVisible: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();
    const homeAPIStore = HomeAPIStore();

    useHead({
      title: "Trading Journal - Cypher Trading",
    });

    return { windowConfig, homeAPIStore };
  },

  data() {
    return {
      isLoading: true,
      isLoadingData: true,
      blockSetCurrentJournal: false,
      demoWelcomeVisible: false,
      currentJournal: {},
    };
  },

  head() {
    return {
      title: "Trading Journal - Cypher Trading",
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

    loadingTradingJournal() {
      if (this.hasInitialLoadedUser && this.isLoggedIn) return false;
      return this.isLoading || this.isLoadingData;
    },

    hasTradingJournal() {
      if (!this.isLoggedIn) return true;
      return !_isEmpty(this.user.TradingJournal);
    },

    tradingJournals() {
      if (!this.isLoggedIn) {
        return this.homeStore.demoTrades;
      }

      return this.user.TradingJournal;
    },

    isLoggedIn() {
      return this.homeStore.isLoggedIn && !_isNil(this.homeStore.user.Id);
    },

    darkMode() {
      if (_isNil(this.windowStore) || _isEmpty(this.windowStore)) return true;
      else return this.windowStore.windowOptions.darkMode;
    },
  },
  watch: {
    hasInitialLoadedUser: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue) return;

        if (!this.homeStore.serverIsUp) {
          this.$router.push({ name: "index" });
          return;
        }

        this.loadTradingJournal();
      },
    },
    welcomeVisible: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue && oldValue) return;
        if (!newValue && oldValue) {
          setTimeout(() => {
            if (
              !this.windowStore.windowOptions.showedWelcomeMessage &&
              !this.loginVisible &&
              !this.welcomeVisible
            ) {
              this.demoWelcomeVisible = true;
            }
          }, 4000);
        }
      },
    },
    isLoggedIn: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue && oldValue) return;
        this.loadTradingJournal();
      },
    },
    "homeStore.demoTrades": {
      async handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (this.isLoggedIn) return;
        this.loadTradingJournal();
      },
    },
  },
  async mounted() {
    if (!this.homeStore.serverIsUp) {
      this.$router.push({ name: "index" });
      return;
    }

    if (this.hasInitialLoadedUser) {
      this.loadTradingJournal();
    }
  },
  methods: {
    loadTradingJournal() {
      if (
        this.isLoggedIn &&
        this.hasInitialLoadedUser &&
        _isEmpty(this.tradingJournals)
      ) {
        this.isLoading = false;
        this.isLoadingData = false;
      }

      if (_isEmpty(this.tradingJournals)) return;

      let currentTradingJournal = _find(this.tradingJournals, function (o) {
        return o.IsMain;
      });

      if (_isNil(currentTradingJournal)) {
        currentTradingJournal = this.tradingJournals[0];
      }

      this.currentJournal = currentTradingJournal;

      this.isLoading = false;
      this.isLoadingData = false;

      if (!this.isLoggedIn) {
        setTimeout(() => {
          if (
            !this.windowStore.windowOptions.showedWelcomeMessage &&
            !this.loginVisible &&
            !this.welcomeVisible
          ) {
            this.demoWelcomeVisible = true;
          }
        }, 4000);
      }
    },
    setActiveJournal(journal) {
      this.currentJournal = journal;
    },
    closeWelcome(login) {
      this.demoWelcomeVisible = false;

      if (login) {
        this.$emit("open-login", true);
      }
    },
  },
};
</script>
<style scoped lang="scss">
.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
}

.journal-container {
  width: 100%;
  display: flex !important;
  flex-direction: column;
  gap: 20px;

  .top-bar {
    height: auto;
    padding: 0;
  }
}

.demo-tag {
  position: relative;
  text-align: center;

  .refresh {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
</style>
