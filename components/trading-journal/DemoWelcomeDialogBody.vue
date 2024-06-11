<template>
  <div>
    <div class="modal-header no-bottom-line">
      <h3 class="title-modal">Welcome to the Trading Journal!</h3>
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
      <div class="text" style="margin: 0 auto">
        <p>You are going to view our demo version of the Trading Journal.</p>
        <p>We have created three example journals for you to check out.</p>
        <p>You can test out every feature in this demo version.</p>
        <p style="margin-bottom: 30px">
          To get the full experience of our amazing Trading Journal then make
          sure to sign up for an account to start your own journal!
        </p>
      </div>
    </div>
    <div class="modal-footer no-padding" :class="{ 'is-dark-mode': darkMode }">
      <button
        type="button"
        style="width: 100%"
        class="secondary-button button"
        @click="$emit('secondary-button', true)"
      >
        Start your own journal!
      </button>
      <button
        type="button"
        style="width: 100%"
        class="primary-button button"
        @click="$emit('primary-button', false)"
      >
        Checkout the demo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DemoWelcomeDialogBody",
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
