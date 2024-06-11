<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">
        {{ isCreation ? "Add a tag" : "Edit current tag" }}
      </h3>
      <button type="button" class="close-button">
        <Icon large name="cross" clickable @click="$emit('secondary-button')" />
      </button>
    </div>
    <div class="modal-body">
      <Loader
        v-if="windowStore.windowOptions['loadingAPI']"
        :dark-mode="darkMode"
        :message="isCreation ? 'Adding tag...' : 'Updating tag...'"
      />
      <template v-else-if="!isLoading">
        <table style="width: 100%">
          <tr v-for="input in fields" :key="input.key" style="display: flex">
            <div
              v-if="input.visible"
              :title="input.info"
              style="width: 200px; height: 50px"
            >
              <label :for="input.key" class="no-select">{{
                input.label
              }}</label>
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

        <p style="margin: 5px 2px">Note (optional)</p>
        <ClientOnly>
          <VueEditor
            id="editor"
            ref="editor"
            v-model="tagNoteText"
            :class="{ 'is-dark-mode': darkMode }"
            class="editor not-max-width"
            :editor-options="editorOption"
            @input="sanitizeInput"
          />
        </ClientOnly>
      </template>
      <Loader v-else :dark-mode="darkMode" message="Getting information..." />
    </div>
    <div
      v-if="!windowStore.windowOptions['loadingAPI'] && !isLoading"
      :class="{ 'is-dark-mode': darkMode }"
      class="modal-footer"
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
        :disabled="!canAddOrReplaceTag"
        @click="addOrSaveTag"
      >
        {{ isCreation ? "Add" : "Save" }}
      </button>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from "sanitize-html";

export default {
  name: "TradeTagDialog",

  props: {
    allTags: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    currentTrade: {
      type: Object,
      required: true,
    },

    darkMode: {
      type: Boolean,
      required: true,
      default: false,
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

    currentTag: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();
    return { windowConfig };
  },

  data() {
    return {
      isLoading: true,
      isLoadingData: true,
      isUniqueTagName: true,
      fields: {
        name: {
          label: "Tag:",
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
          maxLength: 50,
          required: true,
          minimum: 1,
        },
        color: {
          label: "Tag color:",
          value: this.darkMode ? "#FFFFFF" : "#000000",
          field: "color-picker",
          key: "color",
          disabled: false,
          visible: true,
          warning: false,
          readOnly: false,
          isApiConfiguration: true,
          isTradingMode: false,
          rightColumn: false,
          showLabel: false,
          type: "text",
          maxLength: 50,
          required: true,
          minimum: 1,
        },
      },
      tagNoteText: "",
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              "strike",
              { size: ["small", false, "large", "huge"] },
              { list: "ordered" },
              { list: "bullet" },
              "clean",
              { align: ["", "center", "right", "justify"] },
            ],
          ],
        },
      },
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    canAddOrReplaceTag() {
      if (!this.isUniqueTagName) return false;
      return (
        this.fields.name.value.length > 0 && this.fields.color.value.length > 0
      );
    },

    isCreation() {
      return _isEmpty(this.currentTag);
    },
  },

  watch: {},

  mounted() {
    if (!this.isCreation) {
      this.fields.name.value = this.currentTag.Name;
      this.fields.color.value = this.currentTag.Color;
      this.tagNoteText = this.currentTag.Note;
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
      setTimeout(() => {
        this.isLoadingData = false;
      }, 2000);
    } else {
      this.isLoading = false;
      this.isLoadingData = false;
    }
  },

  methods: {
    addOrSaveTag() {
      const tag = {
        ...this.currentTag,
        ...{
          Name: this.fields.name.value,
          Color: this.fields.color.value,
          RGB: this.convertToRGB(this.fields.color.value),
          Note: this.tagNoteText,
        },
      };

      if (this.isCreation) tag.TradeId = this.currentTrade.Id;

      this.$emit("primary-button", tag);
    },

    convertToRGB(hex) {
      const r = parseInt(hex.substr(1, 2), 16);
      const g = parseInt(hex.substr(3, 2), 16);
      const b = parseInt(hex.substr(5, 2), 16);
      return r + ", " + g + ", " + b;
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
      if (!this.isLoadingData) await this.checkWarning();
    },

    async checkWarning() {
      const currentTagText = this.fields.name.value;
      const tag = _find(this.allTags, function (o) {
        return o.Name === currentTagText;
      });

      const currentTagName = !_isNil(this.currentTag)
        ? this.currentTag.Name
        : "";
      if (!_isNil(tag) && tag.Name !== currentTagName) {
        this.isUniqueTagName = false;
        await this.$noty.info(
          "This tag already exists. You can't create a tag with duplicated tag names.",
        );
      } else {
        this.isUniqueTagName = true;
      }
    },

    sanitizeInput(event) {
      this.tagNoteText = sanitizeHtml(event);
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
</style>
