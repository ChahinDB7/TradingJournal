<template>
  <div
    :style="{ color: iconColor, display: displayInline ? 'inline' : 'block' }"
    class="icon-container"
    @click="click"
  >
    <component
      :is="component"
      v-if="placement !== ''"
      v-tooltip="{
        content: tooltipText,
        placement,
        html: htmlTooltip,
        shown: alwaysShown,
        class: !noScalingDifference ? 'scaled' : '',
      }"
      :disabled="disabled"
      class="icon"
      :class="[
        { disabled: disabled, clickable: clickable, filled: filled },
        styles,
      ]"
      :style="{
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        strokeWidth: stroke,
      }"
    />
    <component
      :is="component"
      v-else
      v-tooltip="{
        content: tooltipText,
        html: htmlTooltip,
        shown: alwaysShown,
        class: !noScalingDifference ? 'scaled' : '',
      }"
      :disabled="disabled"
      class="icon"
      :class="[
        { disabled: disabled, clickable: clickable, filled: filled },
        styles,
      ]"
      :style="{
        width: `${svgWidth}px`,
        height: `${svgHeight}px`,
        strokeWidth: stroke,
      }"
    />
  </div>
</template>

<script>
import { defineAsyncComponent, markRaw } from "vue";

export default {
  name: "Icon",

  props: {
    name: {
      type: String,
      required: true,
    },

    displayInline: {
      type: Boolean,
      required: false,
      default: false,
    },

    tooltip: {
      type: String,
      required: false,
      default: "",
    },

    styles: {
      type: String,
      required: false,
      default: "",
    },

    placement: {
      type: String,
      required: false,
      default: "",
    },

    container: {
      type: String,
      required: false,
      default: "div",
    },

    setColor: {
      type: String,
      required: false,
      default: "",
    },

    large: {
      type: Boolean,
      required: false,
      default: false,
    },

    popUpStyleProps: {
      type: Object,
      required: false,
      default: () => {
        return {
          width: 150,
          height: 40,
          minusMarginLeft: 0,
          minusMarginTop: 0,
        };
      },
    },

    dontShowOnScale: {
      type: Boolean,
      required: false,
      default: false,
    },

    noScalingDifference: {
      type: Boolean,
      required: false,
      default: false,
    },

    alwaysShown: {
      type: Boolean,
      required: false,
      default: false,
    },

    clickable: {
      type: Boolean,
      required: false,
      default: false,
    },

    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },

    currentColor: {
      type: Boolean,
      required: false,
      default: false,
    },

    filled: {
      type: Boolean,
      required: false,
      default: false,
    },

    htmlTooltip: {
      type: Boolean,
      required: false,
      default: false,
    },

    color: {
      type: Boolean,
      required: false,
      default: false,
    },

    direct: {
      type: Boolean,
      required: false,
      default: false,
    },

    width: {
      type: Number,
      default: 20,
    },

    height: {
      type: Number,
      default: 20,
    },

    stroke: {
      type: Number,
      default: 2,
    },
  },

  setup(props) {
    const icon = ref(null);

    icon.value = markRaw(
      defineAsyncComponent(
        async () => await import(`@icons/${props.name}.svg`),
      ),
    );

    watch(
      () => props.name,
      (newValue, oldValue) => {
        if (newValue === oldValue) return;
        icon.value = markRaw(
          defineAsyncComponent(
            async () => await import(`@icons/${newValue}.svg`),
          ),
        );
      },
    );

    const windowConfig = WindowConfigStore();
    return { windowConfig, component: icon };
  },

  data() {
    return {
      svgWidth: 20,
      svgHeight: 20,
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    tooltipText() {
      if (this.hasDifferentScaling && this.dontShowOnScale) return "";
      return this.tooltip;
    },

    hasDifferentScaling() {
      if (_isNil(this.windowConfig.$state)) return false;
      if (this.noScalingDifference) return false;
      return this.windowStore.windowOptions.windowScaling !== 100;
    },

    iconColor() {
      if (this.setColor !== "") return this.setColor;
      else if (this.currentColor) return "currentColor";
      else return this.darkMode ? "#fff" : "#000";
    },

    darkMode() {
      if (_isNil(this.windowStore) || _isEmpty(this.windowStore)) return true;
      else return this.windowStore.windowOptions.darkMode;
    },
  },

  watch: {
    width(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.svgWidth = newValue;
    },

    height(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.svgHeight = newValue;
    },

    darkMode(newValue, oldValue) {
      if (newValue === oldValue || _isNil(this.svgContent)) return;
      this.justChangeStyle();
    },
  },

  mounted() {
    this.svgWidth = this.width;
    this.svgHeight = this.height;

    if (this.large) {
      this.svgWidth = 24;
      this.svgHeight = 24;
    }
  },
};
</script>
<style lang="scss" scoped>
.icon {
  display: inline-block;
  fill: transparent;
  width: 20px;
  height: 20px;
  stroke: currentColor;
  vertical-align: middle;
  transition:
    fill 200ms ease,
    stroke 200ms ease;

  &.filled {
    fill: currentColor;
    stroke: transparent;
  }

  &.disabled {
    cursor: not-allowed !important;
  }

  &:focus {
    outline: none !important;
  }
}
</style>
