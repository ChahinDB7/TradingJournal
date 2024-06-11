<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">Select journals</h3>
      <button type="button" class="close-button">
        <Icon large name="cross" @click="$emit('secondary-button')" />
      </button>
    </div>
    <div class="modal-body">
      <p>Which trading journal(s) do you want to add this trade to?</p>
      <hr :class="{ 'is-dark-mode': darkMode }" />
      <div
        class="journals-container is-thumb"
        :class="{ larger: journalsData.length > 4 }"
      >
        <div v-for="(_journal, index) in journalsData" :key="_journal.Id">
          <div
            class="journal"
            :class="{
              'is-dark-mode': darkMode,
              selected: _journal.select,
              'warning-journal': _journal.warning,
            }"
            @click="selectJournal(_journal.Id, index)"
          >
            <div class="name no-select">
              {{ _journal.Name }} ({{ _journal.Currency }})
            </div>
            <ui-checkbox v-if="!isLoading" v-model="_journal.select" />
          </div>
          <hr v-if="_journal.isCurrent" :class="{ 'is-dark-mode': darkMode }" />
        </div>
      </div>
    </div>
    <div
      :class="{ 'is-dark-mode': darkMode }"
      style="padding: 1rem !important"
      class="modal-footer no-padding"
    >
      <button
        class="secondary-button button"
        style="min-width: 150px"
        type="button"
        @click="$emit('secondary-button')"
      >
        Exit
      </button>
      <button
        class="primary-button button"
        style="width: 100%"
        type="button"
        :disabled="!canAddTrade"
        @click="addTrade"
      >
        <span v-if="!isLoading">Continue</span>
        <Loader
          v-else
          :dark-mode="darkMode"
          type="extra-small"
          :with-message="false"
        />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SelectTradingJournalDialogBody",

  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },

    journal: {
      type: Object,
      required: true,
    },

    allJournals: {
      type: Array,
      required: true,
    },

    selectedIds: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    warningJournalIds: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },

  data() {
    return {
      isLoading: false,
      hasMultipleCurrencies: false,
      journalsData: [],
    };
  },

  computed: {
    allSelected() {
      return _filter(this.journalsData, (journal) => {
        return journal.select;
      });
    },

    canAddTrade() {
      if (this.isLoading) return false;
      if (_size(this.allSelected) <= 0) return false;
      if (this.hasMultipleCurrencies) return false;

      const warningFields = _filter(
        this.journalsData,
        (field) => field.warning,
      );
      if (!_isEmpty(warningFields)) return false;

      return true;
    },
  },

  watch: {
    journal: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.$emit("secondary-button");
        this.$emit("clear-current-trade");
      },
    },
    allSelected: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;

        const allCurrencies = _uniq(
          _map(newValue, (item, index) => {
            return item.Currency;
          }),
        );

        this.hasMultipleCurrencies = _isEmpty(allCurrencies)
          ? false
          : allCurrencies.length > 1;

        if (this.hasMultipleCurrencies) {
          this.$noty.error(
            `You can only select journals that share the same currency.`,
          );
        }
      },
    },
  },

  mounted() {
    const currentJournal = _cloneDeep(this.journal);
    const currentJournalId = currentJournal.Id;
    const selectedIds = this.selectedIds;
    const warningJournalIds = this.warningJournalIds;

    this.journalsData = _orderBy(
      _filter(this.allJournals, (journal) => {
        return journal.Id !== currentJournalId;
      }),
      ["CreatedAt"],
      ["desc"],
    );

    this.journalsData.unshift(currentJournal);

    this.journalsData = _map(this.journalsData, (o, index) => {
      return {
        ...o,
        isCurrent: o.Id === currentJournalId,
        select: _includes(selectedIds, o.Id),
        warning: _includes(warningJournalIds, o.Id),
      };
    });
  },

  methods: {
    selectJournal(id, index) {
      this.isLoading = true;
      this.journalsData[index].select = !this.journalsData[index].select;
      this.journalsData[index].warning = false;

      this.isLoading = false;
    },

    addTrade() {
      const selectedIds = _map(this.allSelected, (o, index) => {
        return o.Id;
      });

      this.$emit("primary-button", selectedIds);
    },
  },
};
</script>

<style lang="scss" scoped>
.journals-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-height: 320px;
  overflow-y: auto;
  margin-bottom: 30px;

  &.larger {
    padding-right: 15px;
  }

  .journal {
    display: flex;
    cursor: pointer;
    align-items: center;
    border: 2px solid #f0f0f0;
    padding: 5px 20px 5px 20px;
    border-radius: 10px;
    min-width: 400px;
    height: 52px;
    justify-content: space-between;

    &.is-dark-mode {
      border: 2px solid #1e222d;
    }

    &.selected {
      background-color: #ededed;
      border: 1px solid black;

      &.is-dark-mode {
        border: 1px solid white;
        background-color: #1e222d;
      }
    }

    &.warning-journal {
      border: 1px solid red !important;
    }
  }
}
</style>
