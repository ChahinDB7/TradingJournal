<template>
  <div>
    <ClientOnly>
      <RadialProgress
        :diameter="diameter"
        :completed-steps="value.completed"
        :total-steps="value.total"
        :stroke-width="6"
        :inner-stroke-width="6"
        :inner-stroke-color="darkMode ? '#1f222c' : '#e9e9e9'"
        :start-color="darkMode ? '#FFF' : '#000'"
        :stop-color="darkMode ? '#FFF' : '#000'"
      >
        <div class="content">
          <div v-if="label" class="labbel" :style="{ fontSize: fontSizeLabel }">
            {{ label }}
          </div>
          <div
            v-if="valueText"
            class="label"
            :style="{ fontSize: fontSizeValue }"
            v-html="valueText"
          />
          <slot name="default" />
        </div>
      </RadialProgress>
    </ClientOnly>
  </div>
</template>
<script>
export default {
  name: "ProgressCircle",
  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },

    value: {
      type: Object,
      required: true,
    },

    valueText: {
      type: String,
      required: false,
      default: null,
    },

    label: {
      type: String,
      required: false,
      default: null,
    },

    diameter: {
      type: Number,
      default: 125,
      required: false,
    },

    fontSizeLabel: {
      type: String,
      required: false,
      default: "14px",
    },

    fontSizeValue: {
      type: String,
      required: false,
      default: "14px",
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-align: center;
}
</style>
