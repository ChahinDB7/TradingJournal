<template>
  <div
    id="journal-container"
    class="trading-journal"
    :class="{ hidden: currentJournal.Id !== selectedJournal.Id }"
  >
    <div class="container-section" :class="{ 'is-dark-mode': darkMode }">
      <div class="main-menu" :class="{ 'is-dark-mode': darkMode }">
        <div
          v-if="hasCountableTrades"
          class="top-section"
          :class="{ 'is-dark-mode': darkMode }"
        >
          <TopSection
            :all-countable-trades="allCountableTrades"
            :current-currency="currentCurrency"
            :current-advance-stats-visible="settingsOrders.advanceProgressStats"
            :journal="currentJournal"
            :dark-mode="darkMode"
            :is-loading="isLoading"
            @change-advance-stats-visible="changeAdvanceStatsVisible"
          />
        </div>
        <div
          v-if="hasTradingJournal"
          class="bottom-section card-item background-transition"
        >
          <div
            class="bar"
            :class="{ 'no-bottom-bar': settingsOrders.selectSymbols !== 'All' }"
          >
            <div>
              <h3 class="title-closed-orders no-select">All trades</h3>
            </div>
            <div v-if="!isLoading" class="contract-search-bar">
              <div
                class="radio-list no-select"
                :class="{ 'is-dark-mode': darkMode }"
              >
                <ClientOnly>
                  <ui-form-field class="radio-button" style="margin-right: 3px">
                    <ui-radio
                      v-model="settingsOrders.filterBy"
                      input-id="all-input"
                      :value="tradeStatus.IS_ALL"
                      class="balm-radio"
                      :class="{ 'is-dark-mode': darkMode }"
                    />
                    <label
                      for="all-input"
                      class="no-select clickable"
                      @click="settingsOrders.filterBy = tradeStatus.IS_ALL"
                      >All</label
                    >
                  </ui-form-field>
                  <ui-form-field class="radio-button">
                    <ui-radio
                      v-model="settingsOrders.filterBy"
                      input-id="win-input"
                      :value="tradeStatus.IS_WIN_TRADE"
                      class="balm-radio"
                      :class="{ 'is-dark-mode': darkMode }"
                    />
                    <label
                      for="win-input"
                      class="no-select clickable"
                      @click="
                        settingsOrders.filterBy = tradeStatus.IS_WIN_TRADE
                      "
                      >Wins</label
                    >
                  </ui-form-field>
                  <ui-form-field class="radio-button">
                    <ui-radio
                      v-model="settingsOrders.filterBy"
                      input-id="lose-input"
                      :value="tradeStatus.IS_LOSS_TRADE"
                      class="balm-radio"
                      :class="{ 'is-dark-mode': darkMode }"
                    />
                    <label
                      for="lose-input"
                      class="no-select clickable"
                      @click="
                        settingsOrders.filterBy = tradeStatus.IS_LOSS_TRADE
                      "
                      >Losses</label
                    >
                  </ui-form-field>
                  <ui-form-field class="radio-button">
                    <ui-radio
                      v-model="settingsOrders.filterBy"
                      input-id="ongoing-input"
                      :value="tradeStatus.IS_ONGOING_TRADE"
                      class="balm-radio"
                      :class="{ 'is-dark-mode': darkMode }"
                    />
                    <label
                      for="ongoing-input"
                      class="no-select clickable"
                      @click="
                        settingsOrders.filterBy = tradeStatus.IS_ONGOING_TRADE
                      "
                      >Ongoing</label
                    >
                  </ui-form-field>
                  <ui-form-field class="radio-button">
                    <ui-radio
                      v-model="settingsOrders.filterBy"
                      input-id="not-taken-input"
                      :value="tradeStatus.IS_SETUP"
                      class="balm-radio"
                      :class="{ 'is-dark-mode': darkMode }"
                    />
                    <label
                      for="not-taken-input"
                      class="no-select clickable"
                      @click="settingsOrders.filterBy = tradeStatus.IS_SETUP"
                      >Setup</label
                    >
                  </ui-form-field>
                </ClientOnly>
              </div>
              <div
                class="data-table-icons"
                style="display: flex; align-items: center"
              >
                <div class="icon">
                  <Icon
                    name="config"
                    large
                    clickable
                    @click="
                      settingsOrders.showFilterSettings =
                        !settingsOrders.showFilterSettings
                    "
                  />
                </div>
                <div class="icon" style="margin-left: 5px">
                  <Icon
                    name="plus"
                    large
                    clickable
                    tooltip="Create trade"
                    @click="openTradeDialog({})"
                  />
                </div>
                <ClientOnly>
                  <FieldSelector
                    :fields="columnFields"
                    :dark-mode="darkMode"
                    @set-fields="columnFields = $event"
                    @hide="saveSettings(true)"
                  />
                </ClientOnly>
              </div>
            </div>
          </div>
          <div
            v-if="settingsOrders.showFilterSettings"
            class="settings"
            :class="{ 'is-dark-mode': darkMode }"
          >
            <div
              style="display: flex; gap: 20px"
              class="setting-item margin"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <div class="select-symbol">
                <label
                  class="no-select no-margin"
                  for="refresh-data"
                  style="margin-right: 20px"
                  >Symbols</label
                >
                <select
                  id="refresh-data"
                  v-model="settingsOrders.selectSymbols"
                  class="minimal padding fixed-height"
                  :class="{ 'is-dark-mode': darkMode }"
                  style="min-width: auto !important; width: 120px"
                >
                  <option
                    v-for="option in ['All', 'Choose']"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
              <div
                v-if="settingsOrders.selectSymbols !== 'All'"
                class="search-symbol"
              >
                <InputFields
                  :field="fields.selectSymbol"
                  :dark-mode="darkMode"
                  :fixed-height="false"
                  @on-value-change="onValueChange"
                />
              </div>
            </div>
            <div class="d-flex gap-4">
              <ClientOnly>
                <div class="setting-item" :class="{ 'is-dark-mode': darkMode }">
                  <label for="orders-from-date" class="no-select no-margin"
                    >From</label
                  >
                  <DateTime
                    v-model:value="settingsOrders.from"
                    :dark-mode="darkMode"
                    width="170px"
                  />
                </div>
              </ClientOnly>
              <ClientOnly>
                <div
                  class="setting-item margin"
                  :class="{ 'is-dark-mode': darkMode }"
                >
                  <label for="orders-from-date" class="no-select no-margin"
                    >To</label
                  >
                  <DateTime
                    v-model:value="settingsOrders.to"
                    :dark-mode="darkMode"
                    width="170px"
                  />
                </div>
              </ClientOnly>
            </div>
            <div class="checkboxes" style="display: flex; gap: 30px">
              <div
                v-tooltip="filterOutTradesToolTip"
                class="settings-item"
                @click="openIgnoreTrades"
              >
                <input
                  id="ignore-break-even"
                  :checked="settingsOrders.ignoreTrades"
                  type="checkbox"
                  style="margin-right: 13px"
                  @change="changedIgnoreTrades($event)"
                />
                <label class="no-select" for="ignore-break-even"
                  >Ignore trades
                </label>
              </div>
              <div v-if="hasHiddenTrades" class="settings-item">
                <input
                  id="show-hidden-trades"
                  v-model="settingsOrders.showHiddenTrades"
                  type="checkbox"
                  style="margin-right: 13px"
                />
                <label class="no-select" for="show-hidden-trades"
                  >Show hidden trades
                </label>
              </div>
            </div>
          </div>
          <div
            v-if="
              symbols.length > 0 &&
              settingsOrders.selectSymbols !== 'ALL' &&
              settingsOrders.showFilterSettings
            "
            class="symbols-list is-thumb"
          >
            <div
              v-for="symbol in symbols"
              :key="symbol.orderId"
              class="symbol-item"
              :class="{ 'is-dark-mode': darkMode }"
              @click="removeSymbol(symbol)"
            >
              {{ symbol.contract }}
              <Icon name="cross" clickable />
            </div>
          </div>
          <ClientOnly>
            <DataTableBalmUI
              v-if="tableDataFields.thread.length > 0"
              :data="paginationTradesData"
              :user-settings="userSettings"
              :row-checkbox="showCheckboxTable"
              :page-size="pageSize"
              :total-pages="paginationTotalPages"
              :thead="tableDataFields.thread"
              has-pagination
              :tbody="tableDataFields.tbody"
              :dark-mode="darkMode"
              no-rows-text="No trades"
              :selected-key="'Id'"
              show-edit
              show-info
              show-delete
              show-add-tags
              :journal="currentJournal"
              :all-journals="allJournals"
              :current-currency="currentCurrency"
              show-add-link
              show-duplicate
              show-hide-and-show
              @set-page="setPage"
              @open-tag="openTagDialog"
              @change-size-page="changePageSize"
              @add-tag="showTagDialog"
              @remove-tag="addOrSaveOrDeleteTag"
              @hide-show-trade="hideShowTrade"
              @delete-item="deleteTrade"
              @upload-attachment="addAttachment"
              @add-link="addAttachment"
              @remove-attachment="removeAttachment"
              @update-attachment="updateAttachment"
              @duplicate-trade="duplicateTrade"
              @show-trade-dialog="openTradeDialog"
            />
          </ClientOnly>
          <div
            v-if="tableDataFields.thread.length <= 0"
            class="no-fields-selected"
          >
            <Loader :dark-mode="darkMode" message="" type="small" />
          </div>
        </div>
        <div
          v-if="hasCountableTrades && !refreshingChart"
          class="mid-section large card-item background-transition"
        >
          <ChartJournal
            :current-currency="currentCurrency"
            :all-countable-trades="allCountableTrades"
            :journal="currentJournal"
            :dark-mode="darkMode"
            :is-loading="isLoadingData"
            @refresh-chart="refreshChart"
          />
        </div>
        <template v-if="!windowOptions.isMobile">
          <div
            v-if="
              hasCountableTrades &&
              hasTags &&
              hasMultipleTags &&
              !refreshingChart
            "
            class="mid-section fit-content card-item background-transition"
          >
            <TagsPerformance
              :current-currency="currentCurrency"
              :all-countable-trades="allCountableTrades"
              :journal="currentJournal"
              :dark-mode="darkMode"
              :is-loading="isLoadingData"
              @refresh-chart="refreshChart"
            />
          </div>
          <div
            v-if="hasCountableTrades"
            class="trade-distribution-container"
            :class="{ 'is-dark-mode': darkMode }"
          >
            <div class="card-item background-transition">
              <TradeDistribution
                :all-countable-trades="allCountableTrades"
                :journal="currentJournal"
                :dark-mode="darkMode"
                :is-loading="isLoadingData"
              />
            </div>
            <div
              v-if="!refreshingChart"
              class="card-item background-transition"
            >
              <TradeDistributionPerformance
                :current-currency="currentCurrency"
                :all-countable-trades="allCountableTrades"
                :journal="currentJournal"
                :dark-mode="darkMode"
                :is-loading="isLoadingData"
                @refresh-chart="refreshChart"
              />
            </div>
          </div>
          <div
            v-if="hasCountableTrades && !refreshingChart"
            class="mid-section large card-item background-transition"
          >
            <TradePerformanceOnHours
              :current-currency="currentCurrency"
              :all-countable-trades="allCountableTrades"
              :journal="currentJournal"
              :dark-mode="darkMode"
              :is-loading="isLoadingData"
              @refresh-chart="refreshChart"
            />
          </div>
        </template>
        <div
          v-else
          class="mid-section fit-content card-item background-transition mobile"
        >
          More data charts available on the desktop view.
        </div>
        <div class="empty-lint" />
      </div>
    </div>
    <div class="empty-lint" />
    <CustomDialog
      v-show="dialogVisibleComponent.ignoreTradesOptionVisible"
      :dark-mode="darkMode"
      :dialog-width="'500px'"
      :big-shadow="false"
      @secondary-button="cancelBreakEvenModal()"
    >
      <template #body>
        <div class="modal-header">
          <div style="display: flex">
            <h3 class="title-modal">Ignore trades</h3>
            <div style="display: flex; margin-left: 30px">
              <div>
                <button
                  type="button"
                  class="button add-padding rounded-button"
                  :class="{ 'is-dark-mode': darkMode }"
                  @click="resetBarValues()"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
          <button type="button" class="close-button">
            <Icon
              large
              name="cross"
              clickable
              @click="cancelBreakEvenModal()"
            />
          </button>
        </div>
        <div class="modal-body">
          <div>
            <div class="upper-container-ignore-break-even">
              <p>
                Ignore P&Ls between: {{ currentCurrency.symbol
                }}{{ settingsOrders.barMinValue }} - {{ currentCurrency.symbol
                }}{{ settingsOrders.barMaxValue }}
              </p>
            </div>
            <ClientOnly>
              <MultiRangeSlider
                :base-class-name="'multi-range-slider-bar-only'"
                :class="{ 'is-dark-mode': darkMode }"
                :min-value="settingsOrders.barMinValue"
                :max-value="settingsOrders.barMaxValue"
                :max="settingsOrders.barMaximum"
                :min="settingsOrders.barMinimum"
                :step="1"
                :range-margin="5"
                @input="updateBarValues"
              />
            </ClientOnly>
            <div class="min-max-container">
              <div :class="{ 'is-dark-mode': darkMode }">
                <label
                  class="no-select"
                  style="margin-right: 10px"
                  for="min-value-input"
                  >Min:</label
                >
                <input
                  id="min-value-input"
                  v-model="settingsOrders.initialMinVal"
                  style="width: 140px !important"
                  type="number"
                  @input="changeBarValues($event, 'min')"
                />
              </div>
              <div :class="{ 'is-dark-mode': darkMode }">
                <label
                  class="no-select"
                  style="margin-right: 10px"
                  for="max-value-input"
                  >Max:</label
                >
                <input
                  id="max-value-input"
                  v-model="settingsOrders.initialMaxVal"
                  style="width: 140px !important"
                  type="number"
                  @input="changeBarValues($event, 'max')"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="modal-footer no-padding"
          :class="{ 'is-dark-mode': darkMode }"
        >
          <button
            type="button"
            class="secondary-button button small"
            @click="cancelBreakEvenModal()"
          >
            Cancel
          </button>
          <button
            type="button"
            style="width: 100%"
            class="primary-button button"
            @click="saveBreakEvenTrades()"
          >
            Continue
          </button>
        </div>
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="dialogVisibleComponent.tagDialog && !isLoading && !isLoadingData"
      :dark-mode="darkMode"
      :dialog-width="'500px'"
      :big-shadow="false"
      :block-background-click="true"
      @secondary-button="closeTagDialog()"
    >
      <template #body>
        <TradeTagDialogBody
          :current-tag="currentTag"
          :all-tags="allTags"
          :current-trade="currentTrade"
          :dark-mode="darkMode"
          @primary-button="addOrSaveOrDeleteTag"
          @secondary-button="closeTagDialog()"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="dialogVisibleComponent.createTradeDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'660px'"
      remove-event-listenting
      :block-background-click="true"
      @secondary-button="
        dialogVisibleComponent.createTradeDialogVisible = false
      "
    >
      <template #body>
        <CreateTradeDialogBody
          :trade="editTrade"
          :all-journals="journals"
          :current-journal="currentJournal"
          :user-settings="userSettings"
          :current-currency="currentCurrency"
          :dark-mode="darkMode"
          @primary-button="
            dialogVisibleComponent.createTradeDialogVisible = false
          "
          @secondary-button="
            dialogVisibleComponent.createTradeDialogVisible = false
          "
        />
      </template>
    </CustomDialog>
  </div>
</template>
<script>
import moment from "moment";
import tradeStatus from "@/lib/trade-status-constants";
import attachmentStatus from "@/lib/attachment-type-constants";
import humanizeDuration from "humanize-duration";
import * as tradingJournalLib from "@/lib/trading-journal";

export default {
  name: "Journal",

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
    windowOptions: {
      type: Object,
      required: true,
    },
    journal: {
      type: Object,
      required: true,
    },
    loginVisible: {
      type: Boolean,
      required: true,
    },
    journals: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
    selectedJournal: {
      type: Object,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();
    const bybitAPIStore = BybitAPIStore();
    const homeAPIStore = HomeAPIStore();
    const date = ref({ start: null, end: null });

    return { windowConfig, bybitAPIStore, homeAPIStore, date };
  },

  data() {
    return {
      blockUpdateSettings: false,
      refreshingChart: false,
      showCheckboxTable: false,
      currentPage: 1,
      columnFields: {},
      datatableFields: {},
      editTrade: {},
      allTags: [],
      currentTrade: {},
      currentTag: {},
      dialogVisibleComponent: {
        ignoreTradesOptionVisible: false,
        updatingFilterDialog: false,
        tagDialog: false,
        createTradeDialogVisible: false,
        createTradeDialogBlockEvent: false,
      },
      tradeStatus,
      attachmentStatus,
      allSymbols: [],
      isLoading: false,
      isLoadingData: false,
      loadedSettings: false,
      isInversePerpetual: false,
      config: {},
      fields: {},
      symbols: [],
      settingsOrders: {
        advanceProgressStats: false,
        from: "",
        to: "",
        pageSize: 10,
        showFilterSettings: false,
        showHiddenTrades: false,
        filterBy: 0,
        selectSymbols: "All",
        ignoreTrades: false,
        breakEvenValue: 0,
        barMinValue: -5,
        barMaxValue: 5,
        barMaximum: 100,
        barMinimum: -100,
        initialMinVal: -100,
        initialMaxVal: 100,
      },
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

    BybitStore() {
      if (_isNil(this.bybitAPIStore.$state)) return {};
      return this.bybitAPIStore.$state;
    },

    darkMode() {
      if (_isNil(this.windowStore) || _isEmpty(this.windowStore)) return true;
      else return this.windowStore.windowOptions.darkMode;
    },

    tableDataFields() {
      const thread = this.datatableFields.thead;
      const tbody = this.datatableFields.tbody;
      const columnFields = this.columnFields;

      const filteredTbodyArray = _orderBy(
        _filter(tbody, (item) => {
          const filterItem = _find(columnFields, { name: item.key });
          return filterItem ? filterItem.visible : true;
        }),
        ["order"],
        ["asc"],
      );

      const filteredThreadArray = _orderBy(
        _filter(thread, (item) => {
          const filterItem = _find(columnFields, { name: item.key });
          return filterItem ? filterItem.visible : true;
        }),
        ["order"],
        ["asc"],
      );

      return { thread: filteredThreadArray, tbody: filteredTbodyArray };
    },

    totalColumns() {
      const totalVisible = _filter(this.columnFields, function (c) {
        return c.visible;
      });

      return totalVisible.length;
    },

    hasTradingJournal() {
      return !_isEmpty(this.journals);
    },

    isOptimizedForCFD() {
      if (!this.hasTradingJournal || _isNil(this.currentJournal)) return false;
      else return this.currentJournal.OptimizeForCFD;
    },

    allJournals() {
      if (_isNil(this.user) && this.isLoggedIn) return [];
      return this.journals;
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

    currentJournal() {
      const currentTradingJournal = this.journal;

      currentTradingJournal.Trades = _map(
        currentTradingJournal.Trades,
        (o, index) => {
          return {
            ...o,
            RealizedPnL: _sumBy(o.Entries, (entry) => {
              if (_isNil(entry.RealizedPnL)) return 0;
              return entry.RealizedPnL;
            }),
            CommissionFees: _sumBy(o.Entries, (entry) => {
              if (_isNil(entry.CommissionFees)) return 0;
              return entry.CommissionFees;
            }),
          };
        },
      );

      let trades = _cloneDeep(currentTradingJournal.Trades);
      if (
        this.symbols.length > 0 &&
        this.settingsOrders.selectSymbols === "Choose"
      ) {
        trades = _filter(trades, (d) =>
          _some(this.symbols, (s) => s.contract === d.Symbol),
        );
      }

      if (this.settingsOrders.ignoreTrades) {
        trades = _filter(trades, (d) => {
          if (
            d.RealizedPnL === null ||
            d.Status === tradeStatus.IS_ONGOING_TRADE ||
            d.Status === tradeStatus.IS_SETUP
          )
            return false;
          if (
            d.RealizedPnL < this.settingsOrders.barMinValue ||
            d.RealizedPnL > this.settingsOrders.barMaxValue
          )
            return true;
          return false;
        });
      }

      let from = "";
      let to = "";

      if (this.settingsOrders.from === "") {
        from = moment("0001-01-01T00:00:00.000Z").startOf("day");
      } else {
        from = moment(this.settingsOrders.from).startOf("day");
      }

      if (this.settingsOrders.to === "") {
        to = moment.max();
      } else {
        to = moment(this.settingsOrders.to).startOf("day");
      }

      if (
        to.isAfter(from) &&
        (this.settingsOrders.to !== "" || this.settingsOrders.from !== "")
      ) {
        trades = trades.filter((item) => {
          const tradeDate = moment(item.OpenTradeAt).startOf("day");
          return tradeDate.isSameOrAfter(from) && tradeDate.isSameOrBefore(to);
        });
      }

      if (this.settingsOrders.filterBy !== tradeStatus.IS_ALL) {
        switch (this.settingsOrders.filterBy) {
          case tradeStatus.IS_WIN_TRADE:
            trades = _filter(trades, (trade) => {
              return (
                trade.Status === tradeStatus.IS_CLOSED_TRADE &&
                trade.RealizedPnL > 0
              );
            });
            break;
          case tradeStatus.IS_LOSS_TRADE:
            trades = _filter(trades, (trade) => {
              return (
                trade.Status === tradeStatus.IS_CLOSED_TRADE &&
                trade.RealizedPnL < 0
              );
            });
            break;
          case tradeStatus.IS_ONGOING_TRADE:
            trades = _filter(trades, (trade) => {
              return trade.Status === tradeStatus.IS_ONGOING_TRADE;
            });
            break;
          case tradeStatus.IS_SETUP:
            trades = _filter(trades, (trade) => {
              return trade.Status === tradeStatus.IS_SETUP;
            });
            break;
        }
      }

      if (!this.settingsOrders.showHiddenTrades) {
        trades = _filter(trades, (trade) => {
          return !trade.IsHidden;
        });
      }

      let count = 1;
      for (const trade of trades) {
        trade.Count = count;
        trade.TotalTags = trade.Tags.length;
        trade.Tags = _orderBy(trade.Tags, ["CreatedAt"], ["desc"]);
        trade.Quantity = this.calculateQuantity(trade);

        const files = [];
        for (const attachment of trade.Attachments) {
          if (attachment.Type === attachmentStatus.IS_FILE) {
            if (process.env.NODE_ENV === "development") {
              files.push({
                id: attachment.Id,
                url: attachment.FilePath,
                tradeId: trade.Id,
              });
            } else {
              const result = this.isValidImage(attachment.FilePath);
              if (result || attachment.Local)
                files.push({
                  id: attachment.Id,
                  url: attachment.FilePath,
                  tradeId: trade.Id,
                });
            }
          }
        }
        trade.Files = files;
        trade.Links = _filter(trade.Attachments, function (c) {
          return c.Type === attachmentStatus.IS_LINK;
        });

        // Trade duration
        const duration = moment.duration(
          moment(trade.CloseTradeAt).diff(moment(trade.OpenTradeAt)),
        );
        const minutes = duration.asMinutes();
        const durationMilliseconds = minutes * 60 * 1000;

        if (_isNil(trade.CloseTradeAt)) {
          trade.TradeDuration = "N/A";
        } else if (durationMilliseconds > 172800000) {
          trade.TradeDuration = humanizeDuration(durationMilliseconds, {
            round: true,
            units: ["d", "h"],
            language: "en",
          });
        } else {
          trade.TradeDuration = humanizeDuration(durationMilliseconds, {
            round: true,
            units: ["h", "m"],
            language: "en",
          });
        }

        trade.RiskRewardRatio = this.calculateRiskRewardRatio(trade);

        count++;
      }

      currentTradingJournal.FiltedTrades = trades;
      currentTradingJournal.uniqueSymbols = this.getUniqueSymbols(
        currentTradingJournal.Trades,
      );

      return currentTradingJournal;
    },

    hasCountableTrades() {
      return this.allCountableTrades.length > 0;
    },

    hasTags() {
      if (!this.hasCountableTrades) return false;
      return (
        _sumBy(this.currentJournal.Trades, (trade) => {
          return trade.Tags.length;
        }) > 0
      );
    },

    hasMultipleTags() {
      if (!this.hasTags) return false;

      const allTags = _flatMap(this.allCountableTrades, (trade) => {
        return trade.Tags;
      });
      const groupedTags = _groupBy(allTags, "Name");

      const tagsArray = _map(groupedTags, (tags, name) => name);
      return tagsArray.length >= 2;
    },

    allCountableTrades() {
      if (_isNil(this.currentJournal) || _isEmpty(this.currentJournal.Trades))
        return [];

      return _filter(this.currentJournal.Trades, function (j) {
        return (
          j.Status !== tradeStatus.IS_ONGOING_TRADE &&
          j.Status !== tradeStatus.IS_SETUP
        );
      });
    },
    paginationList() {
      if (
        _isNil(this.currentJournal) ||
        _isNil(this.currentJournal.FiltedTrades)
      )
        return [];
      const localData = this.currentJournal.FiltedTrades;

      const listArray = [];
      for (let i = 0; i < localData.length; i += this.pageSize) {
        listArray.push(localData.slice(i, i + this.pageSize));
      }

      let _page = 1;
      const list = [];
      _forEach(listArray, function (_list) {
        list.push({ list: _list, page: _page });
        _page++;
      });

      return list;
    },

    pageSize() {
      if (!_isNil(this.settingsOrders.pageSize))
        return this.settingsOrders.pageSize;
      return 10;
    },

    paginationTotalPages() {
      if (_isEmpty(this.paginationList)) return 0;
      const lastItem = this.paginationList[this.paginationList.length - 1];
      return lastItem.page;
    },

    paginationTradesData() {
      if (_isEmpty(this.paginationList)) return [];
      const currentPage = this.currentPage;
      const pageList = _find(this.paginationList, function (o) {
        return o.page === currentPage;
      });

      return pageList.list;
    },

    hasHiddenTrades() {
      if (_isNil(this.currentJournal)) return false;

      return _some(this.currentJournal.Trades, { IsHidden: true });
    },

    hasTrades() {
      if (_isNil(this.currentJournal)) return false;
      else return !_isEmpty(this.currentJournal.Trades);
    },

    isLoggedIn() {
      return (
        this.homeStore.isLoggedIn &&
        !_isNil(this.homeStore.user) &&
        !_isNil(this.homeStore.user.Id)
      );
    },

    filterOutTradesToolTip() {
      if (this.settingsOrders.ignoreTrades) {
        return `Ignore trades between: $${this.settingsOrders.barMinValue} - $${this.settingsOrders.barMaxValue}`;
      } else {
        return "";
      }
    },
  },

  watch: {
    "currentCurrency.symbol": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.datatableFields = tradingJournalLib.default.getDataTableFields(
          this.currentCurrency.symbol,
          this.windowConfig.formatNumber,
        );
      },
    },
    columnFields: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (!_isEqual(newValue, oldValue)) {
          this.windowConfig.setSingleConfig({
            type: "tradingJournalFields",
            value: this.columnFields,
          });
        }
      },
    },
    hasInitialLoadedUser: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.loadTradingJournal();
      },
    },
    "dialogVisibleComponent.createTradeDialogVisible": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.editTrade = {};
        }
      },
    },
    "userSettings.TradingJournalOption.ShowMoreStatistics": {
      async handler(newValue, oldValue) {
        if (
          oldValue === newValue ||
          this.blockUpdateSettings ||
          _isNil(newValue)
        )
          return;
        this.getSettings();
      },
    },
    "userSettings.TradingJournalOption.AlwaysExpandTableSettings": {
      async handler(newValue, oldValue) {
        if (
          oldValue === newValue ||
          this.blockUpdateSettings ||
          _isNil(newValue)
        )
          return;
        this.getSettings();
      },
    },
    "settingsOrders.advanceProgressStats": {
      async handler(newValue, oldValue) {
        if (oldValue === newValue || this.isLoading || !this.loadedSettings)
          return;
        this.saveSettings(false, true);
      },
    },
    "settingsOrders.showFilterSettings": {
      async handler(newValue, oldValue) {
        if (oldValue === newValue || this.isLoading || !this.loadedSetting)
          return;
        this.saveSettings(false, true);
      },
    },
    "homeStore.resetUserSettings": {
      async handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.getSettings();
      },
    },
    "userSettings.TradingJournalOption.Fields": {
      async handler(newValue, oldValue) {
        if (
          oldValue === newValue ||
          this.blockUpdateSettings ||
          _isNil(newValue)
        )
          return;
        this.getSettings();
      },
    },
    isLoggedIn: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue && oldValue) return;

        await this.loadTradingJournal();
      },
    },
    "fields.selectSymbol.value": {
      handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue) return;

        const symbol = _find(this.allSymbols, function (s) {
          return s.contract === newValue;
        });

        if (_isNil(symbol)) return;

        const alreadyExist = _find(this.symbols, function (s) {
          return s.contract === newValue;
        });

        if (!_isNil(alreadyExist)) {
          this.$noty.info("This symbol is already selected.");
        } else {
          this.symbols.push(symbol);

          setTimeout(() => {
            this.fields.selectSymbol.value = "";
          }, 500);
        }
      },
    },

    "settingsOrders.selectSymbols": {
      handler(newValue, oldValue) {
        if (newValue === oldValue || _isNil(oldValue) || this.isLoadingData)
          return;
        if (newValue === "All") {
          this.symbols = [];
        } else if (
          newValue === "Choose" &&
          !_isNil(this.config.tradingJournal) &&
          !_isNil(this.config.tradingJournal.allChosenSymbols) &&
          !_isEmpty(this.config.tradingJournal.allChosenSymbols)
        ) {
          this.symbols = this.config.tradingJournal.allChosenSymbols;
        }
      },
    },

    // "settingsOrders.ignoreTrades": {
    //   handler(newValue, oldValue) {
    //     if (_isNil(oldValue) || oldValue === newValue || this.isLoading) return;
    //   },
    // },

    // "settingsOrders.filterBy": {
    //   handler(newValue, oldValue) {
    //     if (_isNil(oldValue) || oldValue === newValue || this.isLoading) return;
    //   },
    // },

    "settingsOrders.from": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || this.isLoading) return;
        let from = "";
        const to = moment(this.settingsOrders.to).startOf("day");

        if (newValue === "") {
          from = moment("0001-01-01T00:00:00.000Z").startOf("day");
        } else {
          from = moment(newValue).startOf("day");
        }

        if (to.isBefore(from) && newValue !== this.settingsOrders.to) {
          this.settingsOrders.from = "";
        } else if (newValue === this.settingsOrders.to) {
          setTimeout(() => {
            this.settingsOrders.from = oldValue;
          }, 100);
        }
      },
    },

    "settingsOrders.to": {
      async handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue || this.isLoading) return;
        let to = "";
        const from = moment(this.settingsOrders.from).startOf("day");

        if (newValue === "") {
          to = moment.max();
        } else {
          to = moment(newValue).startOf("day");
        }

        if (to.isBefore(from) && newValue !== this.settingsOrders.from) {
          this.settingsOrders.to = "";
        } else if (newValue === this.settingsOrders.from) {
          setTimeout(() => {
            this.settingsOrders.to = oldValue;
          }, 100);
        }
      },
    },

    // "settingsOrders.showHiddenTrades": {
    //   async handler(newValue, oldValue) {
    //   },
    // },

    "currentJournal.Id": {
      async handler(newValue, oldValue) {
        if (newValue === oldValue) return;
      },
    },

    "windowStore.windowOptions.tradingJournalFields": {
      async handler(newValue, oldValue) {
        if (newValue === oldValue || _isEmpty(newValue)) return;
        this.columnFields = _cloneDeep(newValue);
      },
    },

    hasHiddenTrades: {
      async handler(newValue, oldValue) {
        if (newValue === oldValue || _isNil(oldValue) || this.isLoadingData)
          return;

        if (!newValue) {
          this.settingsOrders.showHiddenTrades = false;
        }
      },
    },
  },

  async mounted() {
    await this.loadTradingJournal();
  },

  methods: {
    async loadTradingJournal() {
      await this.getTradingJournalFields();

      this.fields = _cloneDeep(tradingJournalLib.FIELDS_DATA);
      if (
        !_isNil(this.currentJournal) &&
        !_isNil(this.currentJournal.uniqueSymbols)
      )
        this.allSymbols = this.currentJournal.uniqueSymbols;
      else this.allSymbols = [];

      this.datatableFields = tradingJournalLib.default.getDataTableFields(
        this.currentCurrency.symbol,
        this.windowConfig.formatNumber,
      );
      this.resetFromToDates();
      this.getSettings();

      this.isLoading = false;
      this.isLoadingData = false;
    },

    resetFromToDates() {
      const now = new Date();
      const _to =
        moment(now).format("YYYY-MM-DD").toString() + "T00:00:00.000Z";

      this.settingsOrders = {
        ...this.settingsOrders,
        ...{
          from: "",
          to: _to,
        },
      };
    },

    async getSettings() {
      if (_isNil(this.userSettings)) return;

      const settings = this.userSettings.TradingJournalOption;

      this.settingsOrders = {
        ...this.settingsOrders,
        ...{
          advanceProgressStats: settings.ShowMoreStatistics,
          showFilterSettings: settings.AlwaysExpandTableSettings,
        },
      };

      if (settings.Fields.length > 0) {
        const allVisibleFields = _map(settings.Fields, (item, index) => {
          if (!_isNil(item.TradingJournalField)) {
            return item.TradingJournalField.Name;
          } else {
            return "";
          }
        });

        _forEach(this.columnFields, function (field) {
          field.visible = _includes(allVisibleFields, field.name);
        });
      }

      setTimeout(() => {
        this.loadedSettings = true;
      }, 1000);
    },

    async saveSettings(saveFields = false, saveJournalOptions = true) {
      if (
        !this.isLoggedIn ||
        _isNil(this.userSettings) ||
        this.blockUpdateSettings
      )
        return;
      this.blockUpdateSettings = true;

      const newUserSettings = _cloneDeep(
        this.userSettings.TradingJournalOption,
      );

      if (saveJournalOptions) {
        newUserSettings.ShowMoreStatistics =
          this.settingsOrders.advanceProgressStats;
        newUserSettings.AlwaysExpandTableSettings =
          this.settingsOrders.showFilterSettings;
      }

      const body = {
        TradingJournalOption: newUserSettings,
        SaveJournalOptions: saveJournalOptions,
        SaveFields: saveFields,
      };

      if (saveFields) {
        const visibleFields = _filter(
          _cloneDeep(this.columnFields),
          function (o) {
            return o.visible;
          },
        );
        const visibleFieldsNames = _map(visibleFields, (field) => {
          return field.name;
        });

        body.VisibleTradingJournalFields = visibleFieldsNames;
      }

      await this.homeAPIStore.updateTradingJournalSettings(body);

      setTimeout(() => {
        this.blockUpdateSettings = false;
      }, 100);
    },

    showTagDialog(trade) {
      this.currentTrade = trade;
      this.allTags = trade.Tags;
      this.currentTag = {};
      this.dialogVisibleComponent.tagDialog = true;
    },

    openTagDialog(tag, trade) {
      this.currentTag = tag;
      this.allTags = trade.Tags;
      this.dialogVisibleComponent.tagDialog = true;
    },

    async getTradingJournalFields() {
      if (!this.homeStore.serverIsUp) return;
      else if (
        !this.windowStore.windowOptions.hasLoadedFields &&
        _isEmpty(this.windowStore.windowOptions.tradingJournalFields)
      )
        return;

      const payload = {
        params: {},
        endpoint: `/tradingjournal/get-fields`,
        method: "GET",
        getResponse: true,
      };

      const response = await this.homeAPIStore.getRequest(payload);

      if (response.code === "ERR_NETWORK") {
        return;
      }

      if (!_isEmpty(response.data) && !_isNil(response.data)) {
        this.windowConfig.setTradingJournalFields(response.data);
      }
    },

    closeTagDialog() {
      this.currentTag = {};
      this.currentTrade = {};
      this.allTrades = [];
      this.dialogVisibleComponent.tagDialog = false;
    },

    setPage(page) {
      this.currentPage = page;
    },

    formatNumber(number, noMinus = false) {
      if (number >= 1) {
        return this.windowConfig.formatNumber(number, true);
      } else if (noMinus) {
        return this.windowConfig.formatNumber(Math.abs(number), true);
      } else {
        return number;
      }
    },

    convertToDateFormat(date, isUnix = false) {
      if (isUnix) date = date * 1000;
      const localDate = new Date(date);
      const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);
      return `${padL(localDate.getDate())}-${padL(
        localDate.getMonth() + 1,
      )}-${localDate.getFullYear()} ${padL(localDate.getHours())}:${padL(
        localDate.getMinutes(),
      )}`;
    },

    formatDateTime(date) {
      const _date = new Date(date);
      const formattedDate = _date.toLocaleDateString("default", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const formattedTime = _date.toLocaleTimeString("default", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const result = formattedDate + " " + formattedTime;
      return result;
    },

    onValueChange(_field, newValue) {
      const field = _find(this.fields, function (o) {
        return o.key === _field.key;
      });

      if (
        field.field === "input" &&
        (newValue.length > _field.maxLength ||
          (newValue <= 0 && newValue !== ""))
      ) {
        this.fields[field.key].warning = true;
      } else {
        this.fields[field.key].warning = false;
      }

      this.fields[field.key].value = newValue;
    },

    getUniqueSymbols(trades) {
      let allTrades = _cloneDeep(trades);
      allTrades = _orderBy(allTrades, ["OpenTradeAt"], ["asc"]);

      const uniqueSymbols = _reduce(
        allTrades,
        (acc, cur) => {
          const symbolIndex = _findIndex(
            acc,
            (item) => item.contract === cur.Symbol,
          );
          if (symbolIndex === -1) {
            acc.push({ orderId: acc.length + 1, contract: cur.Symbol });
          }
          return acc;
        },
        [],
      );

      if (!_isNil(this.fields.selectSymbol)) {
        const filteredSymbols = _differenceBy(
          uniqueSymbols,
          this.symbols,
          "contract",
        );
        this.fields.selectSymbol.autoCompleteItems = filteredSymbols;
      }

      return uniqueSymbols;
    },

    removeSymbol(symbol) {
      this.symbols = _filter(this.symbols, function (s) {
        return s.contract !== symbol.contract;
      });
    },

    async changeAdvanceStatsVisible(visible) {
      this.settingsOrders.advanceProgressStats = visible;
    },

    changedIgnoreTrades(event) {
      if (!event.target.checked)
        this.settingsOrders.ignoreTrades = event.target.checked;
      else event.target.checked = !event.target.checked;
    },

    saveBreakEvenTrades() {
      this.settingsOrders.ignoreTrades = true;
      this.dialogVisibleComponent.ignoreTradesOptionVisible = false;
    },

    openIgnoreTrades() {
      if (this.settingsOrders.ignoreTrades) return;
      this.dialogVisibleComponent.ignoreTradesOptionVisible = true;
    },

    cancelBreakEvenModal() {
      this.settingsOrders.ignoreTrades = false;
      this.dialogVisibleComponent.ignoreTradesOptionVisible = false;
    },

    updateBarValues(e) {
      if (this.dialogVisibleComponent.updatingFilterDialog) return;
      this.settingsOrders.barMinValue = e.minValue;
      this.settingsOrders.barMaxValue = e.maxValue;
    },

    calculateQuantity(trade) {
      const totalQuantity = _sumBy(trade.Entries, (entry) => {
        if (_isNil(entry.Quantity)) return 0;
        return entry.Quantity;
      });

      if (totalQuantity <= 0) return "N/A";

      return Math.round((totalQuantity + Number.EPSILON) * 10000000) / 10000000;
    },

    resetBarValues() {
      this.dialogVisibleComponent.updatingFilterDialog = true;
      this.settingsOrders.barMinValue = -5;
      this.settingsOrders.barMaxValue = 5;
      this.settingsOrders.barMinimum = -100;
      this.settingsOrders.barMaximum = 100;

      this.settingsOrders.initialMinVal = this.settingsOrders.barMinimum;
      this.settingsOrders.initialMaxVal = this.settingsOrders.barMaximum;
      setTimeout(() => {
        this.dialogVisibleComponent.updatingFilterDialog = false;
      }, 100);
    },

    changeBarValues(event, type) {
      let inputText = event.target.value;
      const maxLength = type === "min" ? 6 : 5;

      if (inputText.length > maxLength) {
        while (inputText.length > maxLength) {
          inputText = inputText.slice(0, -1);
        }
      }

      if (type === "min") {
        this.settingsOrders.initialMinVal = parseInt(inputText);
        this.settingsOrders.barMinimum = parseInt(inputText);

        if (parseInt(inputText) > this.settingsOrders.initialMaxVal) {
        }
      } else if (type === "max") {
        this.settingsOrders.initialMaxVal = parseInt(inputText);
        this.settingsOrders.barMaximum = parseInt(inputText);

        if (parseInt(inputText) < this.settingsOrders.initialMinVal) {
        }
      }
    },

    async addOrSaveOrDeleteTag(tag, isDelete = false) {
      let successText;
      let errorText;
      let endpoint;

      if (isDelete) {
        successText = "Successfully deleted this tag.";
        errorText = `Something went wrong with deleting this tag. Please try it again later.`;
        endpoint = "/tradingjournal/remove-tag?getData=true";
      } else if (_isEmpty(this.currentTag)) {
        successText = "Successfully created the tag.";
        errorText = `Something went wrong with creating this tag. Please try it again later.`;
        endpoint = "/tradingjournal/create-tag?getData=true";
      } else {
        successText = "Successfully updated the tag.";
        errorText = `Something went wrong with updating this tag. Please try it again later.`;
        endpoint = "/tradingjournal/update-tag?getData=true";
      }

      try {
        if (this.isLoggedIn) {
          const payload = {
            params: {},
            body: tag,
            endpoint: endpoint,
            method: "post",
            getResponse: true,
          };

          this.windowConfig.setSingleConfig({
            type: "loadingAPI",
            value: true,
          });
          this.homeAPIStore
            .postRequest(payload)
            .then((response) => {
              this.windowConfig.setSingleConfig({
                type: "loadingAPI",
                value: false,
              });

              if (
                response.status === 200 &&
                !_isNil(response.data.Id) &&
                response.data.Id.length === 36
              ) {
                this.homeAPIStore.setUserState(response.data);
                this.closeTagDialog();
                setTimeout(() => {
                  this.$noty.success(successText);
                }, 1000);
              } else if (response.data.includes("unique tag")) {
                this.$noty.info(
                  `Sorry this tag name does already exist. Please choose an unique name.`,
                );
              } else {
                this.$noty.error(errorText);
              }
            })
            .catch((response) => {
              this.windowConfig.setSingleConfig({
                type: "loadingAPI",
                value: false,
              });
              this.$noty.error(errorText);
            });
        } else {
          const journals = _cloneDeep(this.journals);
          const currentJournalIndex = _findIndex(
            this.journals,
            (o) => o.Id === this.currentJournal.Id,
          );
          const currentTradeIndex = _findIndex(
            journals[currentJournalIndex].Trades,
            (o) => o.Id === tag.TradeId,
          );
          const currentTagIndex = _findIndex(
            journals[currentJournalIndex].Trades[currentTradeIndex].Tags,
            (o) => o.Id === tag.Id,
          );

          if (endpoint === "/tradingjournal/remove-tag?getData=true") {
            journals[currentJournalIndex].Trades[currentTradeIndex].Tags =
              _filter(
                journals[currentJournalIndex].Trades[currentTradeIndex].Tags,
                (o) => o.Id !== tag.Id,
              );
          } else if (endpoint === "/tradingjournal/create-tag?getData=true") {
            tag.Id = this.windowConfig.generateId();
            tag.CreatedAt = this.windowConfig.getCurrentDateTime();

            journals[currentJournalIndex].Trades[currentTradeIndex].Tags.push(
              tag,
            );
          } else {
            journals[currentJournalIndex].Trades[currentTradeIndex].Tags[
              currentTagIndex
            ] = tag;
          }

          this.homeAPIStore.setDemoTrades(journals, false);
          this.closeTagDialog();
          this.$noty.success(successText);
        }
      } catch (_) {
        return;
      }
    },

    hideShowTrade(data, type) {
      if (type !== "hide-show-trade") return;

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: data,
          endpoint: "/tradingjournal/trade/set-visibility",
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
              this.$noty.info(
                `Trade is now ${data.IsHidden ? "showable." : "hidden."}`,
              );
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.$noty.error(
              `Something went wrong with ${
                data.IsHidden ? "showing" : "hiding"
              } this trade. Please try it again later.`,
            );
          });
      } else {
        const journals = _cloneDeep(this.journals);
        const currentSelectedItemIndex = _findIndex(
          this.journals,
          (o) => o.Id === this.currentJournal.Id,
        );
        const currentTradeIndex = _findIndex(
          journals[currentSelectedItemIndex].Trades,
          (o) => o.Id === data.Id,
        );
        journals[currentSelectedItemIndex].Trades[currentTradeIndex].IsHidden =
          !journals[currentSelectedItemIndex].Trades[currentTradeIndex]
            .IsHidden;
        this.homeAPIStore.setDemoTrades(journals, false);
        this.$noty.info(
          `Trade is now ${data.IsHidden ? "showable." : "hidden."}`,
        );
      }
    },

    async deleteTrade(data, type) {
      if (type !== "delete-item") return;

      try {
        if (this.isLoggedIn) {
          const payload = {
            params: {},
            body: data,
            endpoint: "/tradingjournal/trade/remove",
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
                setTimeout(() => {
                  this.$noty.success(
                    `This trade has successfully been deleted.`,
                  );
                }, 1000);
              } else {
                this.$noty.info(response.data);
              }
            })
            .catch((response) => {
              this.$noty.error(
                `Something went wrong with deleting this trade. Please try it again later.`,
              );
            });
        } else {
          const journals = _cloneDeep(this.journals);
          const currentSelectedItemIndex = _findIndex(
            this.journals,
            (o) => o.Id === this.currentJournal.Id,
          );
          journals[currentSelectedItemIndex].Trades = _filter(
            journals[currentSelectedItemIndex].Trades,
            (o) => o.Id !== data.Id,
          );
          this.homeAPIStore.setDemoTrades(journals, false);
          this.$noty.success(`This trade has successfully been deleted.`);
        }
      } catch (ex) {
        return;
      }
    },

    async addAttachment(options) {
      const attachment = {
        TradeId: options.tradeId,
        Link: "",
        Type: options.type,
        FilePath: "",
        File: "",
      };

      if (options.type === attachmentStatus.IS_FILE) {
        attachment.FileExtention = options.data.FileExtension;
        attachment.File = options.data.Base64;
      } else {
        attachment.Link = options.data;
      }

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: attachment,
          endpoint: "/tradingjournal/create-attachment?getData=true",
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
              this.$noty.success(
                `${
                  options.type === 1 ? "Image" : "Link"
                } has successfully been added.`,
              );
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.$noty.error(
              `Something went wrong with ${
                options.type === 1 ? "uploading" : "attaching"
              } this ${
                options.type === 1 ? "image" : "link"
              }. Please try it again later.`,
            );
          });
      } else {
        const journals = _cloneDeep(this.journals);
        const currentJournalIndex = _findIndex(
          this.journals,
          (o) => o.Id === this.currentJournal.Id,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === attachment.TradeId,
        );

        attachment.Id = this.windowConfig.generateId();
        attachment.CreatedAt = this.windowConfig.getCurrentDateTime();

        if (options.type === attachmentStatus.IS_FILE) {
          attachment.FilePath = attachment.File;
          attachment.Local = true;
        }

        journals[currentJournalIndex].Trades[
          currentTradeIndex
        ].Attachments.push(attachment);
        this.homeAPIStore.setDemoTrades(journals, false);
        this.$noty.success(
          `${
            options.type === attachmentStatus.IS_FILE ? "Image" : "Link"
          } has successfully been added.`,
        );
      }
    },

    removeAttachment(options) {
      if (_isNil(options.multiple)) options.multiple = false;

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: { Id: options.id },
          endpoint: "/tradingjournal/remove-attachment",
          method: "post",
          getResponse: true,
        };

        this.windowConfig.setSingleConfig({ type: "loadingAPI", value: true });
        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            this.windowConfig.setSingleConfig({
              type: "loadingAPI",
              value: false,
            });

            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
              const imageText = options.multiple ? "Images" : "Image";
              this.$noty.success(
                `${
                  options.type === attachmentStatus.IS_FILE ? imageText : "Link"
                } has successfully been removed.`,
              );
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.windowConfig.setSingleConfig({
              type: "loadingAPI",
              value: false,
            });
            this.$noty.error(
              `Something went wrong with removing this ${
                options.type === attachmentStatus.IS_FILE ? "image" : "link"
              }. Please try it again later.`,
            );
          });
      } else {
        const journals = _cloneDeep(this.journals);
        const currentJournalIndex = _findIndex(
          this.journals,
          (o) => o.Id === this.currentJournal.Id,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === options.tradeId,
        );
        journals[currentJournalIndex].Trades[currentTradeIndex].Attachments =
          _filter(
            journals[currentJournalIndex].Trades[currentTradeIndex].Attachments,
            (o) => o.Id !== options.id,
          );
        this.homeAPIStore.setDemoTrades(journals, false);
        const imageText = options.multiple ? "Images" : "Image";
        this.$noty.success(
          `${
            options.type === attachmentStatus.IS_FILE ? imageText : "Link"
          } has successfully been removed.`,
        );
      }
    },

    updateAttachment(attachment) {
      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: attachment,
          endpoint: "/tradingjournal/update-attachment?getData=true",
          method: "post",
          getResponse: true,
        };

        this.windowConfig.setSingleConfig({ type: "loadingAPI", value: true });
        this.homeAPIStore
          .postRequest(payload)
          .then((response) => {
            this.windowConfig.setSingleConfig({
              type: "loadingAPI",
              value: false,
            });

            if (
              response.status === 200 &&
              !_isNil(response.data.Id) &&
              response.data.Id.length === 36
            ) {
              this.homeAPIStore.setUserState(response.data);
              this.$noty.success(
                `${
                  attachment.Type === attachmentStatus.IS_FILE
                    ? "Image"
                    : "Link"
                } has successfully been updated.`,
              );
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.windowConfig.setSingleConfig({
              type: "loadingAPI",
              value: false,
            });
            this.$noty.error(
              `Something went wrong with updating this ${
                attachment.Type === attachmentStatus.IS_FILE ? "image" : "link"
              }. Please try it again later.`,
            );
          });
      } else {
        const journals = _cloneDeep(this.journals);
        const currentJournalIndex = _findIndex(
          this.journals,
          (o) => o.Id === this.currentJournal.Id,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === attachment.TradeId,
        );
        const currentAttachmentIndex = _findIndex(
          journals[currentJournalIndex].Trades[currentTradeIndex].Attachments,
          (o) => o.Id === attachment.Id,
        );
        journals[currentJournalIndex].Trades[currentTradeIndex].Attachments[
          currentAttachmentIndex
        ] = attachment;
        this.homeAPIStore.setDemoTrades(journals, false);
        this.$noty.success(
          `${
            attachment.Type === attachmentStatus.IS_FILE ? "Image" : "Link"
          } has successfully been updated.`,
        );
      }
    },

    duplicateTrade(options) {
      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: options,
          endpoint: "/tradingjournal/duplicate-trade",
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
              setTimeout(() => {
                this.$noty.success("Trade has successfully been duplicated.");
              }, 1000);
            } else {
              this.$noty.info(response.data);
            }
          })
          .catch((response) => {
            this.$noty.error(
              `Something went wrong with duplicating this trade. Please try it again later.`,
            );
          });
      } else {
        const journals = _cloneDeep(this.journals);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === this.currentJournal.Id,
        );
        const selectedTrade = _cloneDeep(
          _find(journals[currentJournalIndex].Trades, function (o) {
            return o.Id === options.TradeId;
          }),
        );

        selectedTrade.Id = this.windowConfig.generateId();
        selectedTrade.CreatedAt = this.windowConfig.getCurrentDateTime();

        if (!options.DuplicateTags) {
          selectedTrade.Tags = [];
        }

        if (!options.DuplicateImages) {
          selectedTrade.Attachments = _filter(
            selectedTrade.Attachments,
            (o) => o.Type !== attachmentStatus.IS_FILE,
          );
        }

        if (!options.DuplicateLinks) {
          selectedTrade.Attachments = _filter(
            selectedTrade.Attachments,
            (o) => o.Type !== attachmentStatus.IS_LINK,
          );
        }

        _forEach(options.JournalIds, function (journalId) {
          const currentJournalIndex = _findIndex(
            journals,
            (o) => o.Id === journalId,
          );
          selectedTrade.TradingJournalId = journalId;
          journals[currentJournalIndex].Trades.push(selectedTrade);
        });

        this.homeAPIStore.setDemoTrades(journals, true);
        this.$noty.success("Trade has successfully been duplicated.");
      }
    },
    openTradeDialog(data) {
      this.editTrade = data;
      this.dialogVisibleComponent.createTradeDialogVisible = true;
    },
    changePageSize(size) {
      this.settingsOrders.pageSize = size;
    },

    sleep(delay) {
      const start = new Date().getTime();
      while (new Date().getTime() < start + delay);
    },

    async isValidImage(url) {
      return new Promise((resolve, reject) => {
        try {
          const xhr = new XMLHttpRequest();
          xhr.open("HEAD", url);
          xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
              if (xhr.status === 200) {
                const type = xhr.getResponseHeader("Content-Type");
                if (type.match(/^image/)) {
                  resolve(true);
                } else {
                  resolve(false);
                }
              } else {
                resolve(false);
              }
            }
          };
          xhr.send();
        } catch (_) {
          resolve(false);
        }
      });
    },

    calculateRiskRewardRatio(trade) {
      const riskReward = _sumBy(trade.Entries, (entry) => {
        const { EntryPrice, TakeProfit, Stoploss } = entry;
        if (
          TakeProfit === 0 ||
          _isNil(TakeProfit) ||
          Stoploss === 0 ||
          _isNil(Stoploss)
        )
          return;
        const risk = Math.abs(Stoploss - EntryPrice);
        const reward = Math.abs(TakeProfit - EntryPrice);
        return reward / risk;
      });

      if (_isNil(riskReward)) return "N/A";
      const rr = riskReward / trade.Entries.length;
      return `1 : ${Math.round((rr + Number.EPSILON) * 10) / 10}`;
    },

    refreshChart() {
      this.refreshingChart = true;
      setTimeout(() => {
        this.refreshingChart = false;
      }, 1);
    },
  },
};
</script>
<style scoped lang="scss">
.trading-journal {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;

  .top-bar {
    height: auto;
    padding: 0;
  }

  .container-section {
    width: 100%;
    max-height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;

    .main-menu {
      height: 100%;
    }

    .main-menu {
      width: inherit;

      .mid-section {
        padding: 30px 20px 30px 25px;
        margin-top: 20px;
        width: 100%;
        height: 550px;

        &.large {
          height: 650px;
        }

        &.fit-content {
          height: fit-content;
        }

        &.largest {
          height: 800px;
          &.calendar {
            padding-top: 10px;
          }
        }
      }

      .bottom-section {
        margin-top: 20px;
        width: 100%;
        height: auto;
        padding: 20px;

        .bar {
          padding: 10px 15px 7px 15px;
          display: flex;
          justify-content: space-between;
          &.no-bottom-bar {
            // margin-bottom: 20px;
            height: 40px;
            z-index: 5;
            position: relative;
          }

          .contract-search-bar {
            display: flex;
            gap: 20px;
            align-items: center;
          }
        }

        .settings {
          display: flex;
          justify-content: center;
          gap: 8px;
          flex-wrap: wrap;
          margin: 10px 0;
          padding: 0 20px;
          align-items: center;

          .setting-item {
            display: flex;
            align-items: center;

            &.margin {
              margin-right: 20px;
            }

            label {
              margin-right: 15px;
            }
          }

          .checkboxes {
            .settings-item {
              display: flex;
              align-items: center;

              label {
                margin-bottom: 0 !important;
              }
            }
          }
        }

        .symbols-list {
          display: flex;
          justify-content: center;
          margin: 10px 0px 20px 0px;
          gap: 20px;
          flex-wrap: wrap;
          overflow: auto;
          max-height: 150px;
          .symbol-item {
            border: 1px solid black;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            gap: 10px;
            align-items: center;

            &.is-dark-mode {
              border: 1px solid rgb(118, 118, 118);
            }
          }
        }

        .journal-closed-orders {
          > table {
            background-color: yellow !important;
            height: 500px;
          }
        }
      }

      .trade-distribution-container {
        display: flex;
        margin-top: 20px;
        gap: 20px;

        .card-item {
          width: 50%;
        }

        @media (max-width: 1330px) {
          flex-direction: column;

          .card-item {
            width: 100%;
          }
        }
      }
    }
  }

  .empty-lint {
    height: 20px;
  }
}

.loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 16px;
}

.upper-container-ignore-break-even {
  p {
    font-size: 14px !important;
  }
}

.min-max-container {
  display: flex;
  gap: 30px;
  margin-top: 30px;
  justify-content: space-between;

  input[type="number"] {
    padding-left: 10px;
  }
}

.radio-list {
  width: fit-content;
  height: 0;
  gap: 10px;
  display: flex;
  align-items: center;

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

.search-symbol {
  height: 30px;
}

.no-fields-selected {
  margin-top: 10px;
  font-size: 15px;
  text-align: center;
}

.data-table-icons {
  .icon:last-child {
    margin-left: 5px;
  }
}

.card-item.mobile {
  font-size: 16px;
  text-align: center;
}
</style>
