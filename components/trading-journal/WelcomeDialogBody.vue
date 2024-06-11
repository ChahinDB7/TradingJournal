<template>
  <div>
    <div class="modal-header no-bottom-line">
      <h3 class="title-modal">Welcome to Cypher Trading!</h3>
      <button type="button" class="close-button">
        <Icon
          large
          name="cross"
          clickable
          @click="$emit('secondary-button', false)"
        />
      </button>
    </div>
    <div class="modal-body">
      <p>
        Our tools are easy to use and are high in quality for new and
        experienced traders.
      </p>
      <p>
        You can take a look at our tutorial or you can proceed to the website.
      </p>
      <p>Cypher Trading the leader in trading tools!</p>
      <p style="margin-bottom: 30px">
        We wish you a pleasant experience with our tools.
      </p>
    </div>
    <div class="modal-footer no-padding" :class="{ 'is-dark-mode': darkMode }">
      <button
        type="button"
        class="secondary-button button"
        @click="$emit('secondary-button', true)"
      >
        See tutorial
      </button>
      <button
        type="button"
        style="width: 100%"
        class="primary-button button"
        @click="$emit('primary-button', false)"
      >
        Continue
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "WelcomeDialogBody",
  props: {
    darkMode: {
      type: Boolean,
      required: true,
      default: false,
    },

    dialogVisible: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const windowConfig = WindowConfigStore();
    return { windowConfig };
  },
  data() {
    return {};
  },
  watch: {
    dialogVisible: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
      },
    },
  },

  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped></style>
