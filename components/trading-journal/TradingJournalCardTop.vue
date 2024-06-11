f
<template>
  <div class="parent">
    <div v-if="showBanner" ref="parent-container" class="parent-container">
      <div
        id="trading-journals-container"
        ref="trading-journals-container"
        class="trading-journals is-thumb verticle no-select"
      >
        <div
          v-for="tradingJournal in tradingJournals"
          :id="tradingJournal.Id"
          :ref="tradingJournal.Id"
          :key="tradingJournal.Id"
          class="trading-journal-card smaller"
          :style="{ width: `calc(100% / ${tradingJournals.length}` }"
          :class="{
            active: isMainJournal(tradingJournal),
            'not-active': !isMainJournal(tradingJournal),
            'is-dark-mode': darkMode,
            'is-hidden': tradingJournal.IsHidden,
            'set-height': getJournalProgressProcent(tradingJournal) === null,
          }"
          @click.self="setMain(tradingJournal)"
        >
          <div class="left" @click="setMain(tradingJournal)">
            <span class="name">{{ tradingJournal.Name }}</span>
            <div class="trades">
              <span
                class="no-select label"
                :class="{
                  bigger: getJournalProgressProcent(tradingJournal) !== null,
                }"
                >Start balance:</span
              >
              <span
                >{{ getCurrency(tradingJournal.Currency).symbol
                }}{{
                  windowConfig.formatNumber(tradingJournal.StartBalance, true)
                }}</span
              >
            </div>
            <div
              v-if="getJournalProgressProcent(tradingJournal) !== null"
              class="trades"
            >
              <span class="no-select label bigger">Current balance:</span>
              <span
                >{{ getCurrency(tradingJournal.Currency).symbol
                }}{{ getBalance(tradingJournal) }}</span
              >
              <span
                v-if="
                  getJournalProgressProcent(tradingJournal).percentage !==
                  '0.00'
                "
                class="progress-percentage"
                :class="{
                  'is-dark-mode': darkMode,
                  'is-positive':
                    getJournalProgressProcent(tradingJournal).rawPercentage > 0,
                  'is-negative':
                    getJournalProgressProcent(tradingJournal).rawPercentage < 0,
                }"
                >{{
                  getJournalProgressProcent(tradingJournal).state === "win"
                    ? "+"
                    : getJournalProgressProcent(tradingJournal).state === "loss"
                    ? "-"
                    : ""
                }}{{ getCurrency(tradingJournal.Currency).symbol
                }}{{
                  windowConfig.formatNumber(
                    getJournalProgressProcent(tradingJournal).totalPnL,
                    true,
                  )
                }}
                ({{
                  getJournalProgressProcent(tradingJournal).absPercentage
                }}%)</span
              >
            </div>
          </div>
          <div class="right">
            <div class="action-icons">
              <div class="icon-box">
                <Icon
                  name="copy"
                  tooltip="Duplicate this trading journal"
                  clickable
                  @click="openDuplicateJournal(tradingJournal)"
                />
                <Icon
                  v-if="showVisibleButton(tradingJournal)"
                  :name="tradingJournal.IsHidden ? 'eye-on' : 'eye-off'"
                  :tooltip="
                    tradingJournal.IsHidden
                      ? 'Show this trading journal'
                      : 'Hide this trading journal'
                  "
                  clickable
                  @click="setVisibility(tradingJournal)"
                />
              </div>
              <div class="icon-box">
                <Icon
                  name="edit"
                  tooltip="Edit this trading journal"
                  clickable
                  @click="openEditJournal(tradingJournal)"
                />
                <Icon
                  v-if="!isMainJournal(tradingJournal)"
                  name="trash"
                  tooltip="Remove this trading journal"
                  clickable
                  @click="removeTradingJournal(tradingJournal)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div ref="action-journal" class="action-journal no-select">
        <button
          type="button"
          class="button"
          :class="{ 'is-dark-mode': darkMode }"
          @click="dialogsVisible.createJournalDialogVisible = true"
        >
          Create journal
        </button>
        <button
          type="button"
          class="button"
          :class="{ 'is-dark-mode': darkMode }"
          @click="dialogsVisible.createTradeDialogVisible = true"
        >
          Create trade
        </button>
        <div v-if="hiddenJournalExist" class="hide-show-journals">
          <input
            id="show-hide-journal"
            v-model="showHiddenJournals"
            type="checkbox"
            style="margin-right: 13px"
          />
          <label class="no-select clickable" for="show-hide-journal"
            >Show hidden</label
          >
        </div>
      </div>
    </div>
    <CustomDialog
      v-if="dialogsVisible.createJournalDialogVisible && !isLoading"
      :dark-mode="darkMode"
      :dialog-width="'550px'"
      :block-background-click="!hasTradingJournal"
      @secondary-button="dialogsVisible.createJournalDialogVisible = false"
    >
      <template #body>
        <CreateJournalDialogBody
          :loading-call="isLoadingAPI"
          :has-trading-journal="hasTradingJournal"
          :current-journal="currentJournal"
          :user-id="user.Id"
          :all-journals="journals"
          :dark-mode="darkMode"
          @primary-button="createJournal"
          @secondary-button="dialogsVisible.createJournalDialogVisible = false"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="dialogsVisible.editJournalDialogVisible && !isLoading"
      :dark-mode="darkMode"
      :dialog-width="'550px'"
      @secondary-button="dialogsVisible.editJournalDialogVisible = false"
    >
      <template #body>
        <EditJournalDialogBody
          :loading-call="isLoadingAPI"
          :journal="editJournal"
          :all-journals="journals"
          :dark-mode="darkMode"
          @primary-button="updateJournal"
          @secondary-button="dialogsVisible.editJournalDialogVisible = false"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="dialogsVisible.duplicateTradeDialogVisible && !isLoading"
      :dark-mode="darkMode"
      :dialog-width="'550px'"
      @secondary-button="dialogsVisible.duplicateTradeDialogVisible = false"
    >
      <template #body>
        <DuplicateJournalDialogBody
          :loading-call="isLoadingAPI"
          :all-journals="journals"
          :dark-mode="darkMode"
          @primary-button="duplicateJournalNow"
          @secondary-button="dialogsVisible.duplicateTradeDialogVisible = false"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="dialogsVisible.createTradeDialogVisible && !isLoading"
      :dark-mode="darkMode"
      :dialog-width="'660px'"
      remove-event-listenting
      :block-background-click="true"
      @secondary-button="dialogsVisible.createTradeDialogVisible = false"
    >
      <template #body>
        <CreateTradeDialogBody
          :journals-ids="journalsIds"
          :all-journals="journals"
          :trade="trade"
          :current-journal="currentJournal"
          :user-settings="userSettings"
          :current-currency="currentCurrency"
          :dark-mode="darkMode"
          @primary-button="dialogsVisible.createTradeDialogVisible = false"
          @secondary-button="dialogsVisible.createTradeDialogVisible = false"
        />
      </template>
    </CustomDialog>
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";

export default {
  name: "TradingJournalCardTop",

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    hasTradingJournal: {
      type: Boolean,
      required: true,
    },

    showBanner: {
      type: Boolean,
      required: false,
      default: true,
    },

    trade: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },

    journalsIds: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    userSettings: {
      type: Object,
      required: false,
      default: null,
    },

    currentJournal: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },

    journals: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    darkMode: {
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
    return { homeAPIStore, windowConfig };
  },

  data() {
    return {
      isLoadingAPI: false,
      hasScrolJournalContainer: false,
      showHiddenJournals: false,
      editJournal: {},
      duplicateJournal: {},
      dialogsVisible: {
        createJournalDialogVisible: false,
        editJournalDialogVisible: false,
        createTradeDialogVisible: false,
        duplicateTradeDialogVisible: false,
      },
      tradeStatusConstants,
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

    isLoggedIn() {
      return (
        this.homeStore.isLoggedIn &&
        !_isNil(this.homeStore.user) &&
        !_isNil(this.homeStore.user.Id)
      );
    },

    totalTradingJournals() {
      return this.journals.length;
    },

    tradingJournals() {
      if (this.showHiddenJournals) {
        return this.journals;
      }

      return _filter(this.journals, function (t) {
        return t.IsHidden == false;
      });
    },

    currentCurrency() {
      if (_isNil(this.currentJournal) || _isEmpty(this.currentJournal))
        return {
          id: 1,
          text: "USD",
          symbol: "$",
        };

      const currentCurrency = this.currentJournal.Currency;
      const currency = _find(this.windowStore.currencies, function (o) {
        return o.text === currentCurrency;
      });

      return currency;
    },

    hiddenJournalExist() {
      const hiddenJournals = _filter(this.journals, function (t) {
        return t.IsHidden;
      });

      return !_isEmpty(hiddenJournals);
    },
  },

  watch: {
    hasTradingJournal: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        this.showDontJournalYet();
      },
    },

    "dialogsVisible.editJournalDialogVisible": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.editJournal = {};
        }
      },
    },

    "dialogsVisible.createJournalDialogVisible": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.$emit("exit-dialog");
        }
      },
    },

    "dialogsVisible.createTradeDialogVisible": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.$emit("exit-dialog");
        }
      },
    },

    "dialogsVisible.duplicateTradeDialogVisible": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.duplicateJournal = {};
        }
      },
    },

    showHiddenJournals: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (newValue) localStorage.setItem("show-hidden-journals", newValue);
        else {
          if (!_isNil(this.currentJournal) && this.currentJournal.IsHidden) {
            this.setVisibility(this.currentJournal);
          }

          localStorage.removeItem("show-hidden-journals");
        }
      },
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.scrollToTradingJournal();
    });

    if (localStorage.getItem("show-hidden-journals") === "true") {
      this.showHiddenJournals = true;
    }

    this.showDontJournalYet();
  },

  methods: {
    getBalance(tradingJournal) {
      const totalPnL = _sumBy(tradingJournal.Trades, (trade) => {
        if (
          trade.Status !== tradeStatusConstants.IS_ONGOING_TRADE &&
          trade.Status !== tradeStatusConstants.IS_SETUP
        ) {
          return _sumBy(trade.Entries, (entry) => {
            if (_isNil(entry.RealizedPnL)) return 0;
            return entry.RealizedPnL;
          });
        }
        return 0;
      });

      return this.windowConfig.formatNumber(
        tradingJournal.StartBalance + totalPnL,
        true,
      );
    },
    getCurrency(symbol) {
      const currency = _find(this.windowStore.currencies, function (o) {
        return o.text === symbol;
      });

      return currency;
    },
    isMainJournal(journal) {
      return journal.Id === this.currentJournal.Id;
    },
    getJournalProgressProcent(journal) {
      const countableTrades = _filter(journal.Trades, function (j) {
        return (
          j.Status !== tradeStatusConstants.IS_ONGOING_TRADE &&
          j.Status !== tradeStatusConstants.IS_SETUP
        );
      });

      if (_isEmpty(countableTrades)) {
        return null;
      }

      const totalPnL = _sumBy(countableTrades, (trade) => {
        if (
          trade.Status !== tradeStatusConstants.IS_ONGOING_TRADE &&
          trade.Status !== tradeStatusConstants.IS_SETUP
        ) {
          return _sumBy(trade.Entries, (entry) => {
            if (_isNil(entry.RealizedPnL)) return 0;
            return entry.RealizedPnL;
          });
        }
        return 0;
      });

      const state = totalPnL > 0 ? "win" : totalPnL < 0 ? "loss" : "neutral";
      const percentage = (totalPnL / journal.StartBalance) * 100;
      return {
        totalPnL: Math.abs(totalPnL),
        percentage: percentage.toFixed(2),
        rawPercentage: percentage,
        absPercentage: Math.abs(percentage).toFixed(2),
        state,
      };
    },

    createJournal(newJournal) {
      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: newJournal,
          endpoint: "/tradingjournal/create",
          method: "post",
          getResponse: true,
        };

        this.isLoadingAPI = true;
        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            this.isLoadingAPI = false;
            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
              this.$noty.success(`Successfully created the trading journal.`);
              this.dialogsVisible.createJournalDialogVisible = false;
              setTimeout(() => {
                const container = this.$refs["trading-journals-container"];
                container.scrollLeft = container.scrollWidth;
              }, 100);
            } else if (response.data.includes("unique name")) {
              this.$noty.info(
                `Sorry this name does already exist. Please choose an unique name.`,
              );
            } else {
              this.$noty.error(response.data);
            }
          })
          .catch((response) => {
            this.isLoadingAPI = false;
            this.$noty.error(
              `Something went wrong with creating the trading journal. Please try it again later.`,
            );
          });
      } else {
        newJournal.Id = this.windowConfig.generateId();
        newJournal.CreatedAt = this.windowConfig.getCurrentDateTime();
        newJournal.IsMain = true;
        newJournal.IsHidden = false;
        newJournal.Trades = [];
        newJournal.UserId = "";
        this.addDemoTrade(newJournal);

        this.$noty.success(`Successfully created the trading journal.`);
        this.dialogsVisible.createJournalDialogVisible = false;

        this.$emit("set-current-journal", newJournal);

        setTimeout(() => {
          const container = this.$refs["trading-journals-container"];
          container.scrollLeft = container.scrollWidth;
        }, 100);
      }
    },

    addDemoTrade(newJournal) {
      const journals = this.journals;

      _forEach(journals, function (journal) {
        journal.IsMain = false;
      });

      journals.push(newJournal);
      this.homeAPIStore.setDemoTrades(journals, false);
    },

    duplicateJournalNow(name) {
      if (_isNil(this.duplicateJournal) || _isEmpty(this.duplicateJournal)) {
        this.$noty.error(
          `Something went wrong with duplicating the trading journal. Please try it again later.`,
        );
        return;
      }

      if (this.isLoggedIn) {
        const journalModal = {
          Id: this.duplicateJournal.Id,
          userId: this.duplicateJournal.UserId,
          Name: name,
        };

        const payload = {
          params: {},
          body: journalModal,
          endpoint: "/tradingjournal/duplicate",
          method: "post",
          getResponse: true,
        };

        this.isLoadingAPI = true;
        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            this.isLoadingAPI = false;
            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
              this.$noty.success(
                `Successfully duplicated the trading journal.`,
              );
              this.dialogsVisible.duplicateTradeDialogVisible = false;
              this.duplicateJournal = {};
              setTimeout(() => {
                const container = this.$refs["trading-journals-container"];
                container.scrollLeft = container.scrollWidth;
              }, 100);
            } else if (response.data.includes("unique name")) {
              this.$noty.info(
                `Sorry this name does already exist. Please choose an unique name.`,
              );
            } else {
              this.$noty.error(
                `Something went wrong with duplicating the trading journal. Please try it again later.`,
              );
            }
          })
          .catch((response) => {
            this.isLoadingAPI = false;
            this.$noty.error(
              `Something went wrong with duplicating the trading journal. Please try it again later.`,
            );
          });
      } else {
        const duplicateJournal = _cloneDeep(this.duplicateJournal);
        duplicateJournal.Id = this.windowConfig.generateId();
        duplicateJournal.Name = name;
        duplicateJournal.CreatedAt = this.windowConfig.getCurrentDateTime();
        duplicateJournal.IsMain = true;
        duplicateJournal.IsHidden = false;
        this.addDemoTrade(duplicateJournal);

        _forEach(duplicateJournal.Trades, function (trade) {
          trade.TradingJournalId = duplicateJournal.Id;
        });

        this.$noty.success(`Successfully duplicated the trading journal.`);
        this.dialogsVisible.duplicateTradeDialogVisible = false;
        this.duplicateJournal = {};

        this.$emit("set-current-journal", duplicateJournal);

        setTimeout(() => {
          const container = this.$refs["trading-journals-container"];
          container.scrollLeft = container.scrollWidth;
        }, 100);
      }
    },

    updateJournal(journal) {
      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: journal,
          endpoint: "/tradingjournal/update-journal",
          method: "post",
          getResponse: true,
        };

        this.isLoadingAPI = true;
        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            this.isLoadingAPI = false;
            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
              setTimeout(() => {
                this.$noty.success(`Successfully updated the trading journal.`);
              }, 100);
              this.dialogsVisible.editJournalDialogVisible = false;
            } else {
              this.$noty.error(response.data);
            }
          })
          .catch((response) => {
            this.isLoadingAPI = false;
            this.$noty.error(
              `Something went wrong with updating the trading journal. Please try it again later.`,
            );
          });
      } else {
        const currentSelectedItemIndex = _findIndex(
          this.journals,
          (o) => o.Id === journal.Id,
        );
        const journals = this.journals;
        journals[currentSelectedItemIndex] = journal;
        this.homeAPIStore.setDemoTrades(journals, false);
        this.$noty.success(`Successfully updated the trading journal.`);
        this.dialogsVisible.editJournalDialogVisible = false;
      }
    },

    setMain(tradingJournal) {
      if (this.isMainJournal(tradingJournal)) return;

      this.$emit("set-current-journal", tradingJournal);
      this.scrollToTradingJournal(700, tradingJournal);

      if (this.isLoggedIn) {
        this.homeAPIStore.setJournalState(tradingJournal);

        this.homeAPIStore.postRequest({
          params: {},
          body: tradingJournal,
          endpoint: "/tradingjournal/set-main",
          method: "post",
          getResponse: true,
        });
      } else {
        const journals = this.journals;

        _forEach(journals, function (journal) {
          journal.IsMain = false;
        });

        const currentSelectedItemIndex = _findIndex(
          journals,
          (o) => o.Id === tradingJournal.Id,
        );
        journals[currentSelectedItemIndex].IsMain = true;
        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },

    setVisibility(tradingJournal) {
      if (this.isMainJournal(tradingJournal) && !tradingJournal.IsHidden) {
        this.$noty.info("An active journal can't be hidden.");
        return;
      }

      tradingJournal.IsHidden = !tradingJournal.IsHidden;

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: tradingJournal,
          endpoint: "/tradingjournal/set-visibility",
          method: "post",
          getResponse: true,
        };

        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.$noty.error(`Something went wrong on the server.`);
          });
      }
    },

    async removeTradingJournal(journal) {
      const demoTrades = _filter(this.journals, function (o) {
        return o.Id !== journal.Id;
      });

      this.homeAPIStore.setDemoTrades(demoTrades, false);
    },

    openDuplicateJournal(journal) {
      this.duplicateJournal = journal;
      this.dialogsVisible.duplicateTradeDialogVisible = true;
    },

    openEditJournal(journal) {
      this.editJournal = journal;
      this.dialogsVisible.editJournalDialogVisible = true;
    },

    showDontJournalYet() {
      if (!this.showBanner) {
        if (!this.hasTradingJournal) {
          this.$noty.info(
            `You don't have a trading journal yet. Please create one to continue.`,
          );
          this.dialogsVisible.createJournalDialogVisible = true;
        } else {
          this.dialogsVisible.createTradeDialogVisible = true;
        }
      }
    },

    scrollToTradingJournal(duration = 700, tradingJournal = null) {
      if (tradingJournal == null) {
        tradingJournal = this.currentJournal;
      }

      const options = {
        container: "#trading-journals-container",
        easing: "ease-in",
        lazy: false,
        offset: -200,
        force: true,
        onStart: false,
        onDone: false,
        onCancel: false,
        x: true,
        y: false,
      };

      if (!_isNil(tradingJournal)) {
        this.$scrollTo(`[id='${tradingJournal.Id}']`, duration, options);
      }
    },

    showVisibleButton(tradingJournal) {
      if (this.isMainJournal(tradingJournal)) {
        return false;
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.parent {
  width: 100%;
  .parent-container {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-content: center;
    padding-right: 10px;

    .trading-journals {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
      overflow-x: auto;
      margin: 10px 10px 0 10px;
      padding: 0 10px 10px 10px;
      scroll-snap-type: x mandatory;

      .trading-journal-card {
        scroll-snap-align: center;
        display: flex;
        align-items: center;
        padding: 10px 20px 10px 20px;
        border-radius: 10px;
        min-width: 450px;
        justify-content: space-between;

        .left {
          // padding-left: 10px;
          display: flex;
          gap: 20px;
          width: 100%;
          height: 100%;

          .name {
            font-weight: bold;
            font-size: 18px;
          }

          .trades {
            display: flex;
            align-items: center;
            gap: 7px;

            .label {
              width: 100px;

              &.bigger {
                width: 130px;
              }
            }
            .progress-percentage {
              font-size: 12px;
            }
          }
        }

        .right {
          display: flex;
          gap: 15px;
          align-items: center;

          .action-icons {
            display: flex;
            gap: 5px;

            .icon-box {
              width: min-content;
            }
          }
        }

        &.is-hidden {
          border-style: dashed !important;
        }

        &.active {
          background-color: #ededed;
          border: 1px solid black;

          &.is-dark-mode {
            background-color: #1e222d;
            border: 1px solid white;
          }
        }

        &.not-active {
          cursor: pointer;
          border: 2px solid #f0f0f0;
          &.is-dark-mode {
            border: 2px solid #1e222d;
          }
        }

        &.set-height {
          min-height: 99px;
        }

        &.smaller {
          .left {
            gap: unset;
            flex-direction: column;
          }
        }
      }
    }

    .action-journal {
      width: 150px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;

      .hide-show-journals {
        display: flex;
        justify-content: center;
        zoom: 80%;

        label {
          white-space: nowrap;
          position: relative;
          top: 3px;
        }
      }

      button {
        border-radius: 10px;
        width: 100%;
      }
    }
  }
}
</style>
