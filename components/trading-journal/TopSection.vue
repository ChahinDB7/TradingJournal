<template>
  <div class="circle-section" :class="{ 'is-dark-mode': darkMode }">
    <div
      class="card-item stats background-transition"
      :class="{ 'is-dark-mode': darkMode }"
    >
      <div
        v-tooltip="{
          content: advanceData ? 'Show less' : 'Show more',
          html: true,
          class: 'scaled',
        }"
        class="trading-journal-card more-details clickable"
        @click="advanceData = !advanceData"
      >
        <Icon v-if="!advanceData" name="plus" />
        <Icon v-else name="minus" />
      </div>
      <div v-if="!journal.OptimizeForCFD" class="trading-journal-card">
        <ClientOnly>
          <ProgressCircle
            :label="`${statistics.winRate}%`"
            value-text="Winrate"
            font-size-label="16px"
            :diameter="110"
            :dark-mode="darkMode"
            :value="{
              total: 100,
              completed: statistics.winRate,
            }"
          />
        </ClientOnly>
      </div>
      <div class="trading-journal-card">
        <label>Total Gross Profits</label>
        <label v-if="!isLoadingCalculation" class="d-flex gap-2">
          <span class="is-positive" :class="{ 'is-dark-mode': darkMode }"
            >{{ currentCurrency.symbol
            }}{{ formatNumber(statistics.totalGrossProfits) }}</span
          >
          <span class="no-wrap d-flex gap-1">
            (<span
              class="is-positive d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon name="trending-up" :width="15" :height="15" direct />
              <div>
                {{ currentCurrency.symbol
                }}{{ formatNumber(statistics.totalProfitsLong) }}
              </div>
            </span>
            <span
              class="is-positive d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon name="trending-down" :width="15" :height="15" direct />
              <div>
                {{ currentCurrency.symbol
                }}{{ formatNumber(statistics.totalProfitsShort) }}
              </div> </span
            >)
          </span>
        </label>
      </div>
      <div class="trading-journal-card">
        <label>Average Net P&L</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.averagePnL > 0,
            'is-negative': statistics.averagePnL < 0,
          }"
          >{{ currentCurrency.symbol
          }}{{ formatNumber(statistics.averagePnL) }}</label
        >
      </div>
      <div class="trading-journal-card">
        <label>Best Performing Tag</label>
        <span
          v-if="!isLoadingCalculation && statistics.bestPerformanceTag"
          class="tag"
          :style="[windowConfig.getTagStyle(statistics.bestPerformanceTag.tag)]"
        >
          {{ statistics.bestPerformanceTag.tag.Name }}
        </span>
        <label v-else> None </label>
      </div>
      <div class="trading-journal-card">
        <label>Worst Performing Tag</label>
        <span
          v-if="!isLoadingCalculation && statistics.worstPerformanceTag"
          class="tag"
          :style="[
            windowConfig.getTagStyle(statistics.worstPerformanceTag.tag),
          ]"
        >
          {{ statistics.worstPerformanceTag.tag.Name }}
        </span>
        <label v-else> None </label>
      </div>
      <div class="trading-journal-card">
        <label>Total Gross Loss</label>
        <label v-if="!isLoadingCalculation" class="d-flex gap-2">
          <span class="is-negative" :class="{ 'is-dark-mode': darkMode }"
            >{{ currentCurrency.symbol
            }}{{ formatNumber(statistics.totalGrossLoss) }}</span
          >
          <span class="no-wrap d-flex gap-1">
            (<span
              class="is-negative d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon name="trending-up" :width="15" :height="15" direct />
              <div>
                {{ currentCurrency.symbol
                }}{{ formatNumber(statistics.totalLossLong) }}
              </div>
            </span>
            <span
              class="is-negative d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon name="trending-down" :width="15" :height="15" direct />
              <div>
                {{ currentCurrency.symbol
                }}{{ formatNumber(statistics.totalLossShort) }}
              </div> </span
            >)
          </span>
        </label>
      </div>
      <div class="trading-journal-card">
        <label>Average Profits of each Trade</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              formatNumber(statistics.averageProfitsEachTrade) !== 0,
          }"
          >{{
            formatNumber(statistics.averageProfitsEachTrade) === 0
              ? "N/A"
              : `${currentCurrency.symbol}${formatNumber(
                  statistics.averageProfitsEachTrade,
                )}`
          }}</label
        >
      </div>
      <div class="trading-journal-card">
        <label>Winning Streak</label>
        <label
          v-if="!isLoadingCalculation"
          class="is-positive"
          :class="{ 'is-dark-mode': darkMode }"
          >{{ statistics.winningStreak }}</label
        >
      </div>
      <div class="trading-journal-card">
        <label>Losing Streak</label>
        <label
          v-if="!isLoadingCalculation"
          class="is-negative"
          :class="{ 'is-dark-mode': darkMode }"
          >{{ statistics.losingStreak }}</label
        >
      </div>
      <div class="trading-journal-card">
        <label>Total Trades</label>
        <label
          v-if="!isLoadingCalculation"
          class="d-flex gap-2"
          :class="{ 'is-dark-mode': darkMode }"
        >
          <span :class="{ 'is-dark-mode': darkMode }" class="d-flex">{{
            statistics.totalTrades
          }}</span>
          <span class="no-wrap d-flex gap-1">
            (<span
              class="is-positive d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon
                name="trending-up"
                :width="15"
                :height="15"
                direct
                current-color
              />
              <div>
                {{ statistics.totalLongTrades }}
              </div>
            </span>
            <span
              class="is-negative d-flex gap-1"
              :class="{ 'is-dark-mode': darkMode }"
            >
              <Icon
                name="trending-down"
                :width="15"
                :height="15"
                direct
                current-color
              />
              <div>
                {{ statistics.totalShortTrades }}
              </div> </span
            >)
          </span>
        </label>
      </div>
      <div class="trading-journal-card">
        <label>Average Loss of each Trade</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-negative': formatNumber(statistics.averageLossEachTrade) !== 0,
          }"
          >{{
            formatNumber(statistics.averageLossEachTrade) === 0
              ? "N/A"
              : `${currentCurrency.symbol}${formatNumber(
                  statistics.averageLossEachTrade,
                )}`
          }}</label
        >
      </div>
      <div class="trading-journal-card">
        <label>Best Performing Day of the Week</label>
        <label v-if="!isLoadingCalculation">
          <label
            >{{
              statistics.bestPerformingDay
                ? statistics.bestPerformingDay.dayOfWeek
                : "N/A"
            }}&nbsp;</label
          >
          <label
            v-if="statistics.bestPerformingDay"
            class="is-positive"
            :class="{ 'is-dark-mode': darkMode }"
            >({{ currentCurrency.symbol
            }}{{
              statistics.bestPerformingDay
                ? formatNumber(statistics.bestPerformingDay.totalPnL)
                : 0
            }})</label
          >
        </label>
      </div>
      <div class="trading-journal-card">
        <label>Worst Performing Day of the Week</label>
        <label v-if="!isLoadingCalculation">
          <label
            >{{
              statistics.worstPerformingDay
                ? statistics.worstPerformingDay.dayOfWeek
                : "N/A"
            }}&nbsp;</label
          >
          <label
            v-if="statistics.worstPerformingDay"
            class="is-negative"
            :class="{ 'is-dark-mode': darkMode }"
            >({{ currentCurrency.symbol
            }}{{
              statistics.worstPerformingDay
                ? formatNumber(statistics.worstPerformingDay.totalPnL)
                : 0
            }})</label
          >
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Total Breakeven Trades</label>
        <label v-if="!isLoadingCalculation">{{
          statistics.totalBreakevenTrades
        }}</label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Trade Duration</label>
        <label v-if="!isLoadingCalculation">{{
          statistics.averageTradeDuration
        }}</label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Weekly Performance</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.averageWeeklyPerformance > 0,
            'is-negative': statistics.averageWeeklyPerformance < 0,
          }"
          >{{ currentCurrency.symbol
          }}{{ formatNumber(statistics.averageWeeklyPerformance) }}</label
        >
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Monthly Performance</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.averageMonthlyPerformance > 0,
            'is-negative': statistics.averageMonthlyPerformance < 0,
          }"
          >{{ currentCurrency.symbol
          }}{{ formatNumber(statistics.averageMonthlyPerformance) }}</label
        >
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Return on Investment (ROI)</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.returnOfInvestment.total > 0,
            'is-negative': statistics.returnOfInvestment.total < 0,
          }"
          >{{ statistics.returnOfInvestment.procent }} ({{
            currentCurrency.symbol
          }}{{ formatNumber(statistics.returnOfInvestment.total) }})</label
        >
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Total Paid Commission</label>
        <label v-if="!isLoadingCalculation"
          >{{ currentCurrency.symbol
          }}{{ formatNumber(statistics.totalPaidFees) }}</label
        >
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Best Performing Symbol</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              statistics.bestPerformanceIntrument !== null &&
              statistics.bestPerformanceIntrument.total > 0,
            'is-negative':
              statistics.bestPerformanceIntrument !== null &&
              statistics.bestPerformanceIntrument.total < 0,
          }"
        >
          <span v-if="statistics.bestPerformanceIntrument !== null"
            >{{ statistics.bestPerformanceIntrument.instrument }} ({{
              currentCurrency.symbol
            }}{{
              formatNumber(statistics.bestPerformanceIntrument.total)
            }})</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Worst Performing Symbol</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              statistics.worstPerformanceIntrument !== null &&
              statistics.worstPerformanceIntrument.total > 0,
            'is-negative':
              statistics.worstPerformanceIntrument !== null &&
              statistics.worstPerformanceIntrument.total < 0,
          }"
        >
          <span v-if="statistics.worstPerformanceIntrument !== null"
            >{{ statistics.worstPerformanceIntrument.instrument }} ({{
              currentCurrency.symbol
            }}{{
              formatNumber(statistics.worstPerformanceIntrument.total)
            }})</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Best Performing Ordertype</label>
        <label v-if="!isLoadingCalculation">{{
          statistics.bestPerformanceOnOrderType
        }}</label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Rating</label>
        <label v-if="!isLoadingCalculation">
          <ClientOnly>
            <StarsRatings
              :star-size="16"
              :value="statistics.averageRating"
              read-only
            />
          </ClientOnly>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Risk / Reward Ratio</label>
        <label v-if="!isLoadingCalculation">
          <div v-if="statistics.averageRiskRewardRatio === null">N/A</div>
          <div v-else>
            <span>{{ statistics.averageRiskRewardRatio.risk }}</span> /
            <span>{{ statistics.averageRiskRewardRatio.reward }}</span>
          </div>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Profit Factor</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              statistics.profitFactor !== null && statistics.profitFactor > 1,
            'is-negative':
              statistics.profitFactor !== null && statistics.profitFactor < 1,
          }"
        >
          <span v-if="statistics.profitFactor !== null">{{
            statistics.profitFactor
          }}</span>
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Maximum Peak</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              statistics.maximumPeak !== null &&
              statistics.maximumPeak.type === 1,
            'is-negative':
              statistics.maximumPeak !== null &&
              statistics.maximumPeak.type === 2,
          }"
        >
          <span v-if="statistics.maximumPeak !== null"
            >{{ currentCurrency.symbol
            }}{{ formatNumber(statistics.maximumPeak.total) }}</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Maximum Drawdown</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive':
              statistics.maximumDrawdown !== null &&
              statistics.maximumDrawdown.type === 1,
            'is-negative':
              statistics.maximumDrawdown !== null &&
              statistics.maximumDrawdown.type === 2,
          }"
        >
          <span v-if="statistics.maximumDrawdown !== null"
            >{{ currentCurrency.symbol
            }}{{ formatNumber(statistics.maximumDrawdown.total) }}</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Best Open Trade Time</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.bestAverageOpenTradeTime !== null,
          }"
        >
          <span v-if="statistics.bestAverageOpenTradeTime !== null">{{
            statistics.bestAverageOpenTradeTime
          }}</span>
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Worst Open Trade Time</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-negative': statistics.worstAverageOpenTradeTime !== null,
          }"
        >
          <span v-if="statistics.worstAverageOpenTradeTime !== null">{{
            statistics.worstAverageOpenTradeTime
          }}</span>
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Trade Frequency Each Week</label>
        <label v-if="!isLoadingCalculation">{{
          statistics.tradeFrequencyWeekly
        }}</label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Trade Frequency Each Month</label>
        <label v-if="!isLoadingCalculation">{{
          statistics.tradeFrequencyMonthly
        }}</label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Reward (%) on Balance</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-positive': statistics.averageRewardOnAccount !== null,
          }"
        >
          <span v-if="statistics.averageRewardOnAccount !== null"
            >{{ statistics.averageRewardOnAccount }}%</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
      <div v-if="advanceData" class="trading-journal-card">
        <label>Average Risk (%) on Balance</label>
        <label
          v-if="!isLoadingCalculation"
          :class="{
            'is-dark-mode': darkMode,
            'is-negative': statistics.averageLossOnAccount !== null,
          }"
        >
          <span v-if="statistics.averageLossOnAccount !== null"
            >{{ statistics.averageLossOnAccount }}%</span
          >
          <span v-else>N/A</span>
        </label>
      </div>
    </div>
    <ClientOnly>
      <div
        v-if="journal.OptimizeForCFD"
        class="card-item progress-card background-transition progress-container"
        :class="{ 'advance-mode': advanceData }"
      >
        <div class="progress-list">
          <ProgressCircle
            :label="`${statistics.totalLongs} / ${allCountableTrades.length}`"
            :dark-mode="darkMode"
            :value="{
              total: allCountableTrades.length,
              completed: statistics.totalLongs,
            }"
            :value-text="
              journal.OptimizeForCFD
                ? 'Long / Short<br>trades'
                : 'Buy / Sell<br>trades'
            "
            font-size-label="16px"
            font-size-value="12px"
          >
          </ProgressCircle>
          <ProgressCircle
            :label="`${statistics.winRate}%`"
            value-text="Winrate"
            font-size-label="16px"
            :dark-mode="darkMode"
            :value="{
              total: 100,
              completed: statistics.winRate,
            }"
          />
        </div>
        <div class="progress-list">
          <ProgressCircle
            :label="`${statistics.longsWinRate}%`"
            :value-text="`${journal.OptimizeForCFD ? 'Longs' : 'Buys'} winrate`"
            font-size-label="16px"
            font-size-value="12px"
            :dark-mode="darkMode"
            :value="{
              total: 100,
              completed: statistics.longsWinRate,
            }"
          />

          <ProgressCircle
            :label="`${statistics.shortsWinRate}%`"
            :value-text="`${
              journal.OptimizeForCFD ? 'Shorts' : 'Sells'
            } winrate`"
            font-size-label="16px"
            font-size-value="12px"
            :dark-mode="darkMode"
            :value="{
              total: 100,
              completed: statistics.shortsWinRate,
            }"
          />
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<script>
import tradeStatusConstants from "~/lib/trade-status-constants";
import journalFormulas from "~/functions/journal-formulas";

export default {
  name: "TopSection",

  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    allCountableTrades: {
      type: Array,
      required: true,
    },

    currentAdvanceStatsVisible: {
      type: Boolean,
      required: false,
      default: false,
    },

    journal: {
      type: Object,
      required: true,
    },

    currentCurrency: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const windowConfig = WindowConfigStore();
    return { windowConfig };
  },
  data() {
    return {
      statistics: {},
      disableAdvanceTooltip: false,
      advanceData: false,
      tradeStatusConstants,
      isLoadingCalculation: true,
      options: {
        color: this.darkMode ? "#FFFFFF" : "#000000",
        "empty-color": "transparant",
        size: this.journal.OptimizeForCFD ? 140 : 100,
        thickness: 5,
        determinate: false,
        "empty-thickness": 3,
        "line-mode": "in 10",
        animation: "loop 700 1000",
        "font-size": "16px",
        "font-color": this.darkMode ? "#FFFFFF" : "#000000",
        dash: "4",
        loading: true,
        "no-data": false,
      },
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    totalRows() {
      if (!this.advanceData) return 3;
      else return 8;
    },
  },

  watch: {
    darkMode(newValue, oldValue) {
      if (newValue === oldValue) return;

      this.options = {
        ...this.options,
        ...{
          color: newValue ? "#FFFFFF" : "#000000",
          "font-color": newValue ? "#FFFFFF" : "#000000",
        },
      };
    },

    advanceData(newValue, oldValue) {
      if (newValue === oldValue || this.currentAdvanceStatsVisible === newValue)
        return;
      this.$emit("change-advance-stats-visible", newValue);
    },

    currentAdvanceStatsVisible(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.advanceData = newValue;
    },

    "journal.Trades"(newValue, oldValue) {
      if (newValue === oldValue) return;
      if (!_isEqual(newValue, oldValue)) {
        this.loadStatistic();
      }
    },
  },

  mounted() {
    this.options.loading = true;
    this.advanceData = this.currentAdvanceStatsVisible;
    this.loadStatistic();
    this.isLoadingCalculation = false;
  },

  methods: {
    loadStatistic() {
      this.options.loading = true;
      this.statistics = journalFormulas.getFormulas(
        this.allCountableTrades,
        this.journal.StartBalance,
      );
      setTimeout(() => {
        this.options.loading = false;
      }, 300);
    },

    changeAdvanceDataProgress() {
      this.disableAdvanceTooltip = true;
      this.advanceData = !this.advanceData;

      setTimeout(() => {
        this.disableAdvanceTooltip = false;
      }, 1);
    },

    formatNumber(number) {
      return this.windowConfig.formatNumber(Math.abs(number), true);
    },
  },
};
</script>

<style scoped lang="scss">
.circle-section {
  width: 100%;
  border-radius: 10px;
  height: auto;
  display: flex;
  flex-direction: row;
  gap: 20px;

  .stats.card-item {
    width: inherit;
    height: 100%;
    flex-direction: row;
    display: flex;
    gap: 10px;
    height: auto;
    padding: 0;
    background-color: transparent !important;
    flex-wrap: wrap;

    .trading-journal-card {
      border-radius: 10px;
      flex-grow: inherit;
      min-width: 200px;
      flex: auto;
      display: flex;
      text-align: center;
      padding: 10px 20px;
      background-color: white;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 14px;

      label {
        margin-bottom: 0 !important;

        &:last-child {
          font-size: 14px;
        }
      }

      &.more-details {
        min-width: unset;
        max-width: 50px;
      }
    }

    &.is-dark-mode {
      .trading-journal-card {
        background-color: #131722;
      }
    }
  }

  .progress-card.card-item {
    min-width: max-content;
    display: flex;
    justify-content: center;
    align-content: center;
    align-items: center;
    flex-direction: column;

    .progress-list {
      display: flex;
      gap: 2rem;
      padding: 1rem;
    }

    &.advance-mode {
      .progress-list {
        flex-direction: column;
      }
    }
  }

  .card-item {
    box-shadow: none;
  }

  @media (max-width: 1000px) {
  }

  @media (max-width: 1200px) {
    flex-direction: column;

    .progress-card.card-item {
      flex-direction: row;

      .progress-list {
        flex-direction: row !important;
      }
    }
  }
}

.no-wrap {
  white-space: nowrap;
}

.tag {
  font-size: 12px;
  padding: 4px 10px;
  margin-top: 7px;
}
</style>
