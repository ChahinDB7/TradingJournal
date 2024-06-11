<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">Duplicate a trade</h3>
      <button type="button" class="close-button">
        <Icon large name="cross" @click="$emit('secondary-button')" />
      </button>
    </div>
    <div class="modal-body">
      <p>Which trading journal(s) do you want to duplicate this trade to?</p>
      <hr :class="{ 'is-dark-mode': darkMode }" />
      <div
        class="journals-container is-thumb"
        :class="{ larger: journalsData.length > 4 }"
      >
        <div v-for="(_journal, index) in journalsData" :key="_journal.Id">
          <div
            class="journal"
            :class="{ 'is-dark-mode': darkMode, selected: _journal.select }"
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
      <div class="checklist">
        <div v-if="trade.Files.length > 0">
          <ui-checkbox
            v-if="!isLoading"
            v-model="duplicateImages"
            input-id="duplicate-images"
          />
          <label
            class="label clickable no-select"
            style="margin-left: 5px"
            for="duplicate-images"
          >
            Images
          </label>
        </div>
        <div v-if="trade.Tags.length > 0">
          <ui-checkbox
            v-if="!isLoading"
            v-model="duplicateTags"
            input-id="duplicate-tags"
          />
          <label
            class="label clickable no-select"
            style="margin-left: 5px"
            for="duplicate-tags"
          >
            Tags
          </label>
        </div>
        <div v-if="trade.Links.length > 0">
          <ui-checkbox
            v-if="!isLoading"
            v-model="duplicateLinks"
            input-id="duplicate-links"
          />
          <label
            class="label clickable no-select"
            style="margin-left: 5px"
            for="duplicate-links"
          >
            Links
          </label>
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
        :disabled="!canDuplicate"
        @click="duplicate"
      >
        <span v-if="!apiCallLoading">Duplicate</span>
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
  name: "DuplicateTradeDialogBody",

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

    trade: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      apiCallLoading: false,
      isLoading: false,
      duplicateTags: false,
      duplicateImages: false,
      duplicateLinks: false,
      journalsData: [],
    };
  },

  computed: {
    allSelected() {
      return _filter(this.journalsData, (journal) => {
        return journal.select;
      });
    },

    canDuplicate() {
      if (this.apiCallLoading) return false;
      return _size(this.allSelected) > 0;
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
  },

  mounted() {
    const currentJournal = _cloneDeep(this.journal);
    const currentJournalId = currentJournal.Id;
    this.journalsData = _orderBy(
      _filter(this.allJournals, (journal) => {
        return journal.Id !== currentJournalId;
      }),
      ["CreatedAt"],
      ["desc"],
    );

    this.journalsData.unshift(currentJournal);

    this.journalsData = _map(this.journalsData, (o, index) => {
      return { ...o, isCurrent: o.Id === currentJournalId, select: false };
    });

    if (this.trade.Tags.length > 0) this.duplicateTags = true;
    if (this.trade.Files.length > 0) this.duplicateImages = true;
    if (this.trade.Links.length > 0) this.duplicateLinks = true;
  },

  methods: {
    selectJournal(id, index) {
      this.isLoading = true;
      this.journalsData[index].select = !this.journalsData[index].select;
      this.isLoading = false;
    },

    duplicate() {
      const selectedIds = _map(this.allSelected, (o, index) => {
        return o.Id;
      });

      this.apiCallLoading = true;

      this.$emit("primary-button", {
        JournalIds: selectedIds,
        TradeId: this.trade.Id,
        DuplicateTags: this.duplicateTags,
        DuplicateImages: this.duplicateImages,
        DuplicateLinks: this.duplicateLinks,
      });
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
  }
}

.checklist {
  display: flex;
  gap: 20px;
}
</style>
