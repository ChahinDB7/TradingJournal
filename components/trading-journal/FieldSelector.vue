<template>
  <ClientOnly>
    <b-dropdown
      class="custom-dropdown field-selector"
      right
      :class="{ 'is-dark-mode': darkMode, fixed: fixed }"
      @hide="$emit('hide')"
    >
      <template #button-content>
        <Icon name="filter" large />
      </template>

      <ul
        class="custom-dropdown-menu-content custom is-thumb"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <li v-for="field in data" :key="field.name" class="checkbox no-select">
          <input
            :id="id + '-input-' + field.name"
            v-model="field.visible"
            type="checkbox"
            style="margin-right: 13px"
            @change="changeFields"
          />
          <label class="no-select no-margin" :for="id + '-input-' + field.name">
            {{ field.label }}
          </label>
        </li>
      </ul>
    </b-dropdown>
  </ClientOnly>
</template>

<script>
export default {
  name: "FieldSelector",

  props: {
    fields: {
      type: Object,
      required: true,
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    fixed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      id: this.generateRandomId(),
      data: {},
      dropdown: {
        show: false,
      },
    };
  },
  watch: {
    fields: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.data = newValue;
      },
    },
  },
  mounted() {
    this.data = this.fields;
  },
  methods: {
    changeFields() {
      this.$emit("set-fields", this.data);
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
  },
};
</script>

<style lang="scss" scoped>
.custom-dropdown-menu-content {
  background-color: white;
  padding: 20px 30px 20px 30px !important;
  border-radius: 10px;
  z-index: 50000;
  position: absolute;
  min-width: max-content;
  border: 1px solid rgb(95, 93, 93);

  .checkbox {
    list-style-type: none;
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    label {
      cursor: pointer;
    }
  }

  &.is-dark-mode {
    border: 1px solid rgb(118, 118, 118);
    background-color: #131722 !important;

    .checkbox label {
      color: white;
    }
  }
}
</style>
<style lang="scss">
.custom-dropdown {
  .dropdown-toggle {
    display: flex !important;
    align-items: center !important;
    background: transparent !important;
    border: none !important;
    padding: 0 !important;
    padding-left: 3px !important;
    box-shadow: none !important;
    color: black !important;
  }

  &.is-dark-mode {
    .dropdown-toggle {
      color: white !important;
    }
  }

  .dropdown-menu.dropdown-menu-right {
    background-color: transparent !important;
    padding: 0 !important;
    width: max-content !important;
    border: none !important;
  }
}
</style>
