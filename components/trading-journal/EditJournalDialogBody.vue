<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">Edit Journal</h3>
      <button type="button" class="close-button">
        <Icon large name="cross" clickable @click="$emit('secondary-button')" />
      </button>
    </div>
    <div class="modal-body">
      <table style="width: 100%">
        <tr v-for="input in fields" :key="input.key" style="display: flex">
          <div
            v-if="input.visible"
            :title="input.info"
            class="label-field"
            :class="{ 'has-help-button': input.hasHelpButton }"
          >
            <label :for="input.key" class="no-select">{{ input.label }} </label>
            <Icon
              v-if="input.hasHelpButton"
              name="help"
              clickable
              :pop-up-style-props="input.popUpStyleProps"
              :tooltip="input.helpText"
              :height="15"
              :width="15"
              html-tooltip
              class="help-button small"
            />
          </div>
          <div
            v-if="input.visible"
            :class="{
              checkbox: input.field === 'checkbox',
              'is-dark-mode': darkMode,
              'is-slider-field': input.field === 'slider',
            }"
            class="input-field"
            style="width: 210px"
          >
            <InputFields
              :dark-mode="darkMode"
              :field="input"
              :fixed-height="false"
              :is-from-execute-modal="true"
              :selected-checkboxes="selectedCheckboxes"
              @on-value-change="onValueChange"
            />
          </div>
        </tr>
      </table>
    </div>
    <div :class="{ 'is-dark-mode': darkMode }" class="modal-footer no-padding">
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
        :disabled="!canSaveJournal.bool"
        @click="saveJournal"
      >
        <span v-if="!loadingCall">Save</span>
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
  name: "EditJournalDialogBody",

  props: {
    allJournals: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    darkMode: {
      type: Boolean,
      required: true,
      default: false,
    },

    loadingCall: {
      type: Boolean,
      required: true,
    },

    journal: {
      type: Object,
      required: true,
    },

    selectedCheckboxes: {
      type: Object,
      required: false,
      default: () => {
        return {
          calculateWithShares: false,
          tradingMode: true,
          useCryptocurrency: false,
        };
      },
    },
  },
  setup() {
    const windowConfig = WindowConfigStore();
    const homeAPIStore = HomeAPIStore();

    return { windowConfig, homeAPIStore };
  },
  data() {
    return {
      isUniqueJournalText: true,
      isLoaded: false,
      fields: {
        name: {
          label: "Name:",
          value: "",
          field: "input",
          key: "name",
          disabled: false,
          visible: true,
          warning: false,
          readOnly: false,
          isApiConfiguration: true,
          isTradingMode: false,
          rightColumn: false,
          showLabel: false,
          type: "text",
          maxLength: 25,
          required: true,
          minimum: 1,
        },
        startBalance: {
          label: "Start balance:",
          value: "",
          field: "input",
          key: "startBalance",
          disabled: false,
          visible: true,
          warning: false,
          readOnly: false,
          isApiConfiguration: true,
          isTradingMode: false,
          rightColumn: false,
          showLabel: false,
          hasPrefix: true,
          prefixText: "$",
          type: "number",
          maxLength: 7,
          required: true,
          minimum: 1,
        },
        currency: {
          id: 1,
          label: "Currency:",
          value: "USD",
          field: "dropdown",
          key: "currency",
          items: [
            { id: 1, text: "USD" },
            { id: 2, text: "EUR" },
            { id: 3, text: "GBP" },
            { id: 4, text: "JPY" },
            { id: 5, text: "CAD" },
            { id: 6, text: "AUD" },
            { id: 7, text: "CHF" },
            { id: 8, text: "NZD" },
          ],
          disabled: false,
          visible: true,
          fixedHeight: true,
          warning: false,
          isTradingMode: false,
          rightColumn: false,
          showLabel: false,
          type: "number",
          maxLength: 25,
          minimum: 1,
        },
        optimizeForCFD: {
          label: "Optimize journal for CFD:",
          value: true,
          field: "switch",
          key: "optimizeForCFD",
          disabled: false,
          visible: true,
          warning: false,
          hasHelpButton: true,
          helpText:
            '<div style="text-align: center;">CFD trading allows you to speculate on price movements<br> of financial assets without owning them, where you can go "Long"<br> if you expect the price to rise or "Short" if you expect it to fall,<br> with Long trades being referred to as "Longs"<br> and Short trades being referred to as "Shorts".</div>',
          readOnly: false,
          popUpStyleProps: {
            width: 280,
            height: 240,
          },
          isApiConfiguration: true,
          isTradingMode: false,
          rightColumn: false,
          showLabel: false,
          type: "text",
          maxLength: 7,
          required: true,
          minimum: 1,
        },
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

    canSaveJournal() {
      if (!this.isUniqueJournalText) return { bool: false, state: 1 };
      if (
        this.fields.name.value.length < 4 ||
        this.fields.startBalance.value.length === 0
      )
        return { bool: false, state: 2 };
      const warningFields = _filter(this.fields, (field) => field.warning);
      if (!_isEmpty(warningFields)) return { bool: false, state: 3 };

      if (
        this.journal.Name === this.fields.name.value &&
        this.journal.StartBalance ===
          parseFloat(this.fields.startBalance.value) &&
        (this.journal.OptimizeForCFD ? 1 : 0) !==
          (this.fields.optimizeForCFD.value ? 1 : 0)
      )
        return { bool: true, state: 4 };
      if (this.journal.Currency !== this.fields.currency.value)
        return { bool: true, state: 5 };
      if (
        this.journal.Name !== this.fields.name.value ||
        this.journal.StartBalance !== parseFloat(this.fields.startBalance.value)
      )
        return { bool: true, state: 6 };

      return { bool: false, state: 7 };
    },
  },

  watch: {
    "fields.currency.value": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;

        let symbol = "$";
        const currency = _find(this.windowStore.currencies, function (o) {
          return o.text === newValue;
        });

        if (!_isNil(currency)) symbol = currency.symbol;

        this.fields.startBalance.prefixText = symbol;

        if (this.fields.startBalance.value !== "" && this.isLoaded) {
          const rate = this.homeStore.forexRates[`${oldValue}${newValue}`];
          if (_isNil(rate)) return;

          const accountBalance = parseFloat(
            this.fields.startBalance.value.replace(",", "."),
          );
          this.fields.startBalance.value = (
            Math.round((accountBalance * rate + Number.EPSILON) * 100) / 100
          ).toString();
        }
      },
    },
  },

  mounted() {
    this.fields.name.value = this.journal.Name;
    this.fields.currency.value = this.journal.Currency;
    this.fields.startBalance.value = this.journal.StartBalance.toString();
    this.fields.optimizeForCFD.value = this.journal.OptimizeForCFD;

    setTimeout(() => {
      this.isLoaded = true;
    }, 300);
  },

  methods: {
    saveJournal() {
      const journal = {
        ...this.journal,
        ...{
          Name: this.fields.name.value,
          StartBalance: parseFloat(this.fields.startBalance.value),
          Currency: this.fields.currency.value,
          OptimizeForCFD: this.fields.optimizeForCFD.value,
        },
      };

      this.$emit("primary-button", journal);
    },

    async onValueChange(_field, newValue) {
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

      // Check warning
      await this.checkWarning(_field.key);
    },

    async checkWarning(key) {
      if (key === "name") {
        const currentName = this.fields.name.value;
        const journal = _find(this.allJournals, function (o) {
          return o.Name === currentName;
        });

        if (!_isNil(journal)) {
          if (journal.Name === this.journal.Name) {
            this.isUniqueJournalText = true;
          } else {
            this.isUniqueJournalText = false;
            await this.$noty.info(
              "This name already exist. Please choose an unique name.",
            );
          }
        } else {
          this.isUniqueJournalText = true;
        }
      } else if (key === "startBalance") {
        try {
          const _startBalance = this.fields.startBalance.value;
          const startBalance = parseFloat(_startBalance.replace(",", "."));
          if (startBalance === 0 || isNaN(startBalance))
            this.fields.startBalance.warning = true;
          else this.fields.startBalance.warning = startBalance < 0;
        } catch (_) {
          this.fields.startBalance.warning = true;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.input-field {
  &.checkbox {
    padding-top: 5px;
  }
}

.label-field {
  width: 250px;
  height: 50px;
  &.has-help-button {
    display: flex;
    gap: 10px;
  }
}
</style>
