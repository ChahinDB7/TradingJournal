<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">Duplicate Journal</h3>
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
            <label :for="input.key" class="no-select">{{ input.label }}</label>
            <Icon
              v-if="input.hasHelpButton"
              name="help"
              :tooltip="input.helpText"
              clickable
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
        :disabled="!canDuplicateJournal"
        @click="duplicateJournal"
      >
        <span v-if="!loadingCall">Create</span>
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
import moment from "moment";

export default {
  name: "DuplicateJournalDialogBody",

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

  data() {
    return {
      isUniqueJournalText: true,
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
      },
    };
  },

  computed: {
    canDuplicateJournal() {
      if (!this.isUniqueJournalText) return false;
      if (this.fields.name.value.length < 4) return false;

      const warningFields = _filter(this.fields, (field) => field.warning);
      return _isEmpty(warningFields);
    },
  },

  watch: {},

  mounted() {
    const now = moment();
    const monthYear = now.format("MMMM YYYY");
    this.fields.name.value = monthYear;

    const journal = _find(this.allJournals, function (o) {
      return o.Name === monthYear;
    });

    if (!_isNil(journal)) {
      this.isUniqueJournalText = false;
      this.$noty.info("This name already exist. Please choose an unique name.");
    } else {
      this.isUniqueJournalText = true;
    }
  },

  methods: {
    duplicateJournal() {
      this.$emit("primary-button", this.fields.name.value);
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
        const currentJournalName = this.fields.name.value;
        const journal = _find(this.allJournals, function (o) {
          return o.Name === currentJournalName;
        });

        if (!_isNil(journal)) {
          this.isUniqueJournalText = false;
          await this.$noty.info(
            "This name already exist. Please choose an unique name.",
          );
        } else {
          this.isUniqueJournalText = true;
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
