<template>
  <div :class="{ 'is-dark-mode': darkMode }">
    <button
      type="button"
      class="button timezone-button rounded-button"
      @click="dialogVisible = true"
    >
      {{ currentSelect.value }}
    </button>
    <CustomDialog
      v-show="dialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'400px'"
      :big-shadow="false"
      @secondary-button="dialogVisible = false"
    >
      <template #body>
        <div class="modal-header">
          <div style="display: flex">
            <h3 class="title-modal">
              {{ field.title }}
            </h3>
          </div>
          <button type="button" class="close-button">
            <Icon large name="cross" clickable @click="dialogVisible = false" />
          </button>
        </div>
        <div class="modal-body no-padding">
          <div
            class="custom-dropdown-menu-content is-thumb"
            :class="{ 'is-dark-mode': darkMode }"
          >
            <label class="no-select">{{ field.description }}</label>
            <auto-complete
              ref="autocomplete"
              :initial-value="autocompleteSearch"
              :dark-mode="darkMode"
              :items="autoCompleteItems"
              add-padding
              :warning="false"
              :field="{ type: 'text', hasPrefix: false, maxLength: 6 }"
              :no-focus-increase="false"
              font-size="14px"
              placeholder="Search"
              :zero-height="false"
              class="autocomplete"
              :show-clear-icon="true"
              :focus-input="focusInput"
              :show-auto-complete-menu="false"
              :full-caps="true"
              :fixed-menu="true"
              :full-width="true"
              @search-text-changed="onAutoCompleteInput"
              @input="foundItem"
              @set-search-results="setSearchResults"
            />
            <ul :id="id" class="is-thumb list custom-dropdown-menu">
              <li
                v-for="item in searchResults"
                :id="`${id}-${item.value}`"
                :key="item.value"
                class="no-select"
                :class="{ selected: item.selected }"
                @click="selectItem(item, item.selected)"
              >
                <span>{{ item.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
export default {
  name: "ModalAutoCompleteSelector",

  props: {
    darkMode: {
      type: Boolean,
      default: true,
      required: true,
    },
    field: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const windowConfig = WindowConfigStore();
    const homeAPIStore = HomeAPIStore();
    return { windowConfig, homeAPIStore };
  },
  data() {
    return {
      id: this.generateRandomId(),
      dialogVisible: false,
      focusInput: 0,
      toggledMenu: false,
      searchResults: [],
      autocompleteSearch: "",
      showMenu: false,
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

    listItem() {
      return this.field.items;
    },

    currentSelect() {
      if (_isEmpty(this.listItem)) return this.field.defaultItem;

      const currentSelectedItemIndex = _findIndex(
        this.listItem,
        (o) => o.selected,
      );
      return this.listItem[currentSelectedItemIndex];
    },

    autoCompleteItems() {
      if (_isEmpty(this.listItem)) return [];

      return _map(this.listItem, (item, index) => {
        return { contract: item.value, order: index + 1 };
      });
    },
  },

  watch: {
    autocompleteSearch: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        const symbol = _find(this.listItem, function (o) {
          return o.value === newValue;
        });

        if (!_isNil(symbol)) this.selectItem(symbol, false);
      },
    },

    dialogVisible: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;

        if (newValue) {
          this.scrollToElement();
          this.focusInput++;

          if (this.autocompleteSearch === "") {
            this.searchResults = _cloneDeep(this.listItem);
          }
        } else {
          this.autocompleteSearch = "";
        }

        this.windowConfig.setSingleConfig({
          type: "dialogVisible",
          value: newValue,
        });
      },
    },
  },

  mounted() {
    setTimeout(() => {
      const currentValue = this.field.value;
      const currentItem = _find(this.listItem, function (o) {
        return o.value === currentValue;
      });

      if (!_isNil(currentItem)) {
        const currentSelectedItemIndex = _findIndex(
          this.listItem,
          (o) => o.selected,
        );
        this.listItem[currentSelectedItemIndex].selected = false;

        const newSelectedItemIndex = _findIndex(
          this.listItem,
          (o) => o.value === currentItem.value,
        );
        this.listItem[newSelectedItemIndex].selected = true;
      }
    }, 100);
  },

  methods: {
    async selectItem(item, isSelected) {
      if (isSelected) return;
      const currentSelectedItemIndex = _findIndex(
        this.listItem,
        (o) => o.selected,
      );
      this.listItem[currentSelectedItemIndex].selected = false;
      const newSelectedItemIndex = _findIndex(
        this.listItem,
        (o) => o.value === item.value,
      );
      this.listItem[newSelectedItemIndex].selected = true;

      this.$emit("selected-item", this.listItem[newSelectedItemIndex].value);
      this.searchResults = _cloneDeep(this.listItem);
      this.autocompleteSearch = "";
    },

    scrollToElement() {
      setTimeout(() => {
        const options = {
          container: `#${this.id}`,
          easing: "ease-in",
          lazy: false,
          offset: -70,
          force: true,
          onStart: false,
          onDone: false,
          onCancel: false,
          x: false,
          y: true,
        };

        this.$scrollTo(
          `[id='${`${this.id}-${this.currentSelect.value}`}']`,
          200,
          options,
        );
      }, 100);
    },

    setSearchResults(searchResults) {
      const list = this.listItem;
      const reversedArray = _map(searchResults, (item) => {
        const foundItem = _find(list, { value: item.contract });
        return foundItem;
      });

      this.searchResults = reversedArray;
    },

    onAutoCompleteInput(newValue) {
      this.autocompleteSearch = newValue.trim();
    },

    foundItem(item) {
      this.autocompleteSearch = item.trim();
    },

    generateRandomId() {
      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let id = "";

      for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        id += characters.charAt(randomIndex);
      }

      return id;
    },

    showHide(value) {
      if (!value) {
        setTimeout(() => {
          this.showMenu = false;
        }, 100);
      } else {
        this.showMenu = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.timezone-button {
  height: 30px;
  font-size: 14px;
}
.custom-dropdown-menu-content {
  padding: 20px 30px 20px 30px !important;
  border-radius: 10px;
  border-radius: 0;
  width: 100%;
  .autocomplete {
    margin-bottom: 15px;
  }

  ul {
    display: flex;
    flex-direction: row;
    max-height: 200px;
    padding-right: 20px;
    overflow-y: auto;
    flex-wrap: wrap;
    gap: 20px;

    li {
      cursor: pointer;
      padding: 5px;
      font-size: 16px;
      background-color: transparent;
      list-style-type: none;

      &.selected {
        cursor: not-allowed;
        background-color: white;
        border-radius: 5px;
        color: black;
      }
    }
  }
}
</style>
