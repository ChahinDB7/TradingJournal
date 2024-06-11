<template>
  <div
    class="input-wrapper"
    :class="{ 'no-margin': noMargin, 'full-width': fullWidth }"
  >
    <div
      class="select no-select clickable"
      :class="{ 'white-filled': white, small: small }"
      @click.stop="onContextMenu"
      @contextmenu="onContextMenu($event)"
    >
      <slot name="placeholder" />
      <div
        v-if="inBuildPlaceholder"
        class="label"
        :class="{ 'has-value': hasValue }"
      >
        <Icon
          name="calendar"
          :width="20"
          class="calendar"
          set-color="#767676"
        />

        <span v-if="!hasValue">
          {{ placeholder }}
        </span>
        <div v-else>
          <div>{{ convertDateLabel(date) }}</div>
        </div>
      </div>
    </div>
    <ContextActivator
      v-model:value="optionsComponent.show"
      :options="optionsComponent"
    >
      <div class="datetime">
        <VDatePicker
          v-model.string="date"
          borderless
          mode="date"
          :masks="masks"
          expanded
        />
        <button type="button" class="button reset" @click="reset">Reset</button>
      </div>
    </ContextActivator>
  </div>
</template>

<script>
export default {
  name: "DateSelector",
  props: {
    value: {
      type: String,
      Number,
      required: false,
      default: "",
    },

    noMargin: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },

    inBuildPlaceholder: {
      type: Boolean,
      required: false,
      default: true,
    },

    placeholder: {
      type: String,
      required: true,
    },

    small: {
      type: Boolean,
      required: false,
      default: false,
    },

    white: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup() {
    const masks = ref({
      modelValue: "YYYY-MM-DD",
    });

    return {
      masks,
    };
  },

  data() {
    return {
      optionsComponent: {
        show: false,
        iconFontClass: "iconfont",
        customClass: "class-a",
        zIndex: 300000,
        minWidth: 230,
        x: 500,
        y: 200,
      },
      date: this.value,
    };
  },

  computed: {
    hasValue() {
      return this.date !== "" && this.date !== null;
    },
  },

  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.date = newValue;
      }
    },
    date(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue === "") {
          newValue = null;
        }
        this.$emit("update:value", newValue);
        this.$emit("change", newValue);
        this.optionsComponent.show = false;
      }
    },
  },
  methods: {
    onContextMenu(e) {
      e.preventDefault();
      this.optionsComponent.x = e.x;
      this.optionsComponent.y = e.y;
      this.optionsComponent.show = true;
    },

    reset() {
      this.date = null;
    },

    convertDateLabel(date) {
      if (_isNil(date)) return "";
      const parsedDate = this.$moment(date);
      return parsedDate.format("DD-MM-YYYY");
    },
  },
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  &.full-width {
    .select {
      width: 100%;
    }
  }
}
.select {
  display: flex;
  position: relative;
  flex-direction: row !important;
  width: fit-content;
  padding: 0px 20px;
  font-size: 16px;
  align-items: center;
  min-width: 110px;
  height: 50px;
  position: relative;
  color: black;
  justify-content: space-between;
  border-radius: 50px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;
  gap: 15px;

  &.small {
    height: 40px;
  }

  .label {
    display: flex;
    width: 100%;
    gap: 0.6rem;
    color: #767676;

    justify-content: center;
    align-items: flex-end;
    &.has-value {
      color: black;
    }

    .icon-container.calendar {
      position: relative;
      top: -1px;
      color: white;
    }
  }

  &.white-filled {
    background-color: white;
  }
}

.datetime {
  margin: 10px 10px 10px 10px;
}

.reset.button {
  width: 100%;
  border-radius: 30px;
  padding: 5px 0;
}
</style>
