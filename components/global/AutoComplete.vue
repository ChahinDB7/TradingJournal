<template>
  <div :class="{ no_border_radius: noBorderRadius, 'zero-height': zeroHeight }">
    <div
      class="auto-complete-field"
      :class="{ 'is-number-field': field.type === 'number' }"
    >
      <div
        v-if="hasPrefix"
        class="prefix-text"
        :class="{
          'is-dark-mode': darkMode,
          'has-select':
            (field.key === 'buyPrice' || field.key === 'entryPrice') &&
            showSelectCurrency,
        }"
      >
        <span class="text">{{ field.prefixText }}</span>
      </div>
      <input
        v-if="fixedHeight"
        :id="id"
        :ref="id"
        v-model="searchValue"
        :type="field.type"
        :maxlength="field.maxLength"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        :style="{ height: fixedHeight, fontSize: fontSize, width: '100%' }"
        :required="required"
        :class="[
          classItems,
          {
            'full-width': fullWidth,
            'input-with-numbers': field.type === 'number',
            'input-with-prefix': hasPrefix,
            'no-focus-increase': noFocusIncrease,
            'is-dark-mode': darkMode,
            padding: addPadding,
            'warning-input': warning && !showResult && !open,
          },
        ]"
        @focus="inputFocus(true)"
        @focusout="inputFocus(false)"
        @input="onInput"
      />
      <input
        v-else
        :id="id"
        :ref="id"
        v-model="searchValue"
        :type="field.type"
        :maxlength="field.maxLength"
        :placeholder="placeholder"
        :disabled="disabled"
        autocomplete="off"
        :required="required"
        :style="{ fontSize: fontSize, width: '100%' }"
        :class="[
          classItems,
          {
            'full-width': fullWidth,
            'input-with-numbers': field.type === 'number',
            'input-with-prefix': hasPrefix,
            'no-focus-increase': noFocusIncrease,
            'is-dark-mode': darkMode,
            padding: addPadding,
            'warning-input': warning && !showResult && !open,
          },
        ]"
        @focus="inputFocus(true)"
        @focusout="inputFocus(false)"
        @input="onInput"
      />
      <Icon
        v-if="showClearIcon"
        name="clear"
        large
        clickable
        :stroke="1.25"
        class="clear-field"
        @click="clearField"
      />
    </div>

    <template v-if="showAutoCompleteMenu">
      <div
        v-if="(showResult || open) && !foundValue && searchResults.length > 0"
        class="btn-group open"
        :class="{ 'fixed-menu': fixedMenu }"
        @mouseenter="showResult = true"
      >
        <div
          :id="inputId"
          class="dropdown-menu is-thumb"
          :class="{ 'is-dark-mode': darkMode }"
        >
          <div
            v-for="(result, index) in searchResults"
            :key="index"
            class="dropdown-item form-control"
            @mousedown="mouseDown"
            @click="setItem(result)"
          >
            {{ result.contract !== undefined ? result.contract : result }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: "AutoComplete",

  props: {
    id: {
      type: String,
      required: false,
      default: "auto-complete",
    },

    focusInput: {
      type: Number,
      required: false,
      default: 0,
    },

    initialValue: {
      type: String,
      required: false,
      default: "",
    },

    fixedHeight: {
      type: String,
      required: false,
      default: "",
    },

    zeroHeight: {
      type: Boolean,
      required: false,
      default: true,
    },

    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },

    showClearIcon: {
      type: Boolean,
      required: false,
      default: true,
    },

    fixedMenu: {
      type: Boolean,
      required: false,
      default: false,
    },

    showAutoCompleteMenu: {
      type: Boolean,
      required: false,
      default: true,
    },

    classItems: {
      type: String,
      required: false,
      default: "",
    },

    field: {
      type: Object,
      required: true,
    },

    items: {
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

    fullCaps: {
      type: Boolean,
      required: true,
    },

    addPadding: {
      type: Boolean,
      required: false,
    },

    required: {
      type: Boolean,
      required: false,
    },

    noBorderRadius: {
      type: Boolean,
      required: false,
    },

    placeholder: {
      type: String,
      default: "",
    },

    fontSize: {
      type: String,
      required: false,
      default: "16px",
    },

    disabled: {
      type: Boolean,
      required: false,
    },

    warning: {
      type: Boolean,
      required: true,
    },

    noFocusIncrease: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      open: false,
      showResult: false,
      inputId: "",
      foundValue: false,
      searchValue: "",
      searchResults: [],
      settingFocus: false,
    };
  },

  computed: {
    hasFoundValue() {
      const searchValue = this.searchValue;
      const symbol = _find(this.items, function (s) {
        return s === searchValue;
      });

      return !_isNil(symbol);
    },

    hasPrefix() {
      if (_isNil(this.field.hasPrefix)) return false;
      return this.field.hasPrefix;
    },
  },

  watch: {
    initialValue(value) {
      this.searchValue = value;
      this.checkSearchValue();
    },

    items: {
      handler(newValue, oldValue) {
        if (_isNil(oldValue) || oldValue === newValue) return;
        this.showResult = false;
        this.checkSearchValue();
      },
    },

    focusInput: {
      handler(newValue, oldValue) {
        if (oldValue === newValue || newValue === 0) return;
        setTimeout(() => {
          this.$refs[this.id].focus();
        }, 100);
      },
    },

    searchValue() {
      this.checkSearchValue();
    },
  },

  mounted() {
    this.inputId = Math.floor(Math.random() * 10000000000);

    if (this.initialValue) {
      this.searchValue = this.initialValue;
    }
  },

  methods: {
    checkSearchValue() {
      if (this.hasFoundValue) return;
      const searchValue = this.searchValue;

      this.searchResults = _filter(this.items, function (item) {
        const likePattern = `%${searchValue}%`;
        const regexp = new RegExp(likePattern.replaceAll("%", ".*"), "gi");
        const result = !_isNil(item.contract)
          ? item.contract.toString().match(regexp)
          : item.match(regexp);
        return result;
      });

      this.$emit("set-search-results", this.searchResults);

      const symbol = _find(this.items, function (s) {
        return s === searchValue;
      });

      if (
        !_isNil(symbol) &&
        this.searchResults.length === 1 &&
        this.searchValue !== ""
      ) {
        this.$emit("input", symbol);
        this.foundValue = true;
      } else {
        this.$emit("input", this.searchValue);
        this.foundValue = false;
      }
    },

    clearField() {
      if (this.searchValue === "") return;
      this.searchValue = "";
      this.checkSearchValue();
      this.$refs[this.id].focus();
      this.open = true;
    },

    inputFocus(focus) {
      setTimeout(() => {
        this.open = false;
      }, 30);

      if (!focus) {
        setTimeout(() => {
          this.showResult = false;
        }, 30);
        return;
      }

      this.showResult = focus;
    },

    onInput() {
      this.checkSearchValue();
      if (this.foundValue) return;
      const stringValue = this.fullCaps
        ? this.searchValue.toUpperCase()
        : this.searchValue;
      this.$emit("search-text-changed", stringValue);
    },

    setItem(value) {
      if (!_isNil(value) && !_isNil(value.contract)) value = value.contract;
      const stringValue = this.fullCaps ? value.toUpperCase() : value;
      this.searchValue = stringValue.trim();
      this.$emit("input", stringValue.toUpperCase());
      this.foundValue = true;
    },

    mouseDown(e) {
      this.setItem(e.target.innerHTML);
    },
  },
};
</script>

<style scoped lang="scss">
input.padding {
  padding-right: 5px !important;
}

.zero-height {
  height: 0px;
}

.full-width {
  width: 100%;
}

.open > .dropdown-menu {
  display: block !important;
}

.btn-group {
  margin-top: -26px;
  width: 101%;

  .dropdown-menu {
    width: 100%;
    padding: 12px 0;
    max-height: 200px;
    flex-wrap: wrap;
    overflow-y: auto;
    background-color: #e9e9e9;
    border: 1px solid #808080;
    border-top-left-radius: unset !important;
    border-top-right-radius: unset !important;

    .dropdown-item {
      font-size: 14px !important;
      height: auto !important;
      border: none !important;
      cursor: pointer;
      color: black;

      &:hover {
        zoom: 115%;
        background-color: #d6d4d4;
        color: black;
        border: 1px solid #767676 !important;
      }
    }

    &.is-dark-mode {
      background-color: #131722;
      border: 1px solid #767676 !important;

      .dropdown-item {
        color: white;

        &:hover {
          background-color: black;
          color: white;
          border: 1px solid #767676 !important;
        }
      }
    }
  }

  &.fixed-menu {
    position: fixed;
    margin-top: 0;

    .dropdown-menu {
      width: fit-content;
      position: fixed;
      min-width: 150px;
    }
  }
}

.auto-complete-field {
  display: flex;

  .clear-field {
    width: 0;
    z-index: 510;
    cursor: pointer;
    position: relative !important;
    right: 36px !important;
    top: 1px !important;
  }

  input:focus {
    border: none;
    outline: 1px solid #707070;
  }
}

input.warning-input {
  box-shadow: 0px 0px 0px 1px rgb(240 0 0);
  border: none !important;
}

input[type="number"],
input[type="text"],
input[type="password"] {
  font-size: 16px;
  border: 1px solid rgb(118, 118, 118);
  height: 30px !important;

  &.mini-input {
    height: 25px !important;
  }
}

input.input-with-prefix {
  padding-left: 30px;
  padding-right: 8px;

  &.is-larger-prefix {
    padding-left: 65px;
  }
}

.prefix-text {
  position: absolute;
  margin-top: 3px;
  margin-left: 10px;
  z-index: 510;
  color: #707070;

  &.has-select {
    margin-left: 105px;
  }

  &.is-dark-mode {
    color: #c4c4c4;
  }
}
</style>
