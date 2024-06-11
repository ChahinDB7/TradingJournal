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
        <div v-else class="date">
          <div>
            {{ convertDateLabel(date.start) }}
          </div>
          <Icon name="arrow-right" />

          <div>
            {{ convertDateLabel(date.end) }}
          </div>
        </div>
      </div>
    </div>
    <ContextActivator
      v-model:value="optionsComponent.show"
      :options="optionsComponent"
    >
      <div class="datetime">
        <VDatePicker
          v-if="!isRange"
          v-model.string="range.start"
          borderless
          mode="date"
          :masks="masks"
          expanded
          :style="{ display: isRange ? 'hidden' : 'block' }"
        />
        <VDatePicker
          v-if="isRange"
          v-model.range="range"
          borderless
          mode="date"
          expanded
        />

        <label
          :for="rangeId"
          class="no-select no margin d-flex gap-3 align-center pb-2 switch-range"
        >
          Range {{ isRange }}

          <label class="switch no-margin" :class="{ 'is-dark-mode': darkMode }">
            <input :id="rangeId" v-model="isRange" type="checkbox" />
            <span class="slider round" />
          </label>
        </label>

        <button type="button" class="button reset" @click="reset">Reset</button>
      </div>
    </ContextActivator>
  </div>
</template>

<script>
import uuidv4 from "uuid/v4";

export default {
  name: "DateRangeSelector",
  props: {
    value: {
      type: String,
      Number,
      required: false,
      default: "",
    },

    darkMode: {
      type: Boolean,
      required: true,
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

  setup(props) {
    const range = ref(props.value);
    const date = ref("");

    const isRange = ref(true);

    return {
      rangeId: uuidv4(),
      range,
      date,
      isRange,
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
      refreshing: false,
    };
  },

  computed: {
    hasValue() {
      return !_isNil(this.range.start) && !_isNil(this.range.end);
    },
  },

  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.date = newValue;
      }
    },
    range(newValue, oldValue) {
      if (newValue !== oldValue) {
        const value = {
          start: this.convertDate(newValue.start),
          end: this.convertDate(newValue.end),
        };

        this.$emit("update:value", value);
        this.$emit("change", value);
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
      this.range = {
        start: null,
        end: null,
      };
    },

    convertDate(date) {
      if (_isNil(date)) return null;
      const parsedDate = this.$moment(date);
      return parsedDate.format("YYYY-MM-DD");
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
  min-width: 120px;
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

    .date {
      display: flex;
      gap: 0.5rem;
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

.switch-range {
  width: fit-content;
  margin: auto;
}
</style>
