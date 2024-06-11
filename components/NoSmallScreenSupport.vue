<template>
  <div class="parent">
    <img v-if="darkMode" style="max-height: 350px" :src="darkMobileImage" />
    <img v-else style="max-height: 350px" :src="lightMobileImage" />

    <div class="text">
      <h2>Small screen not yet supported on desktop</h2>
      <p>
        The website is currently under development and this will be available in
        the near future. The website is available currently only for the desktop
        view or the mobile view.
      </p>
    </div>
  </div>
</template>
<script>
import darkMobileImage from "@img/mobile-404-dark.svg?url";
import lightMobileImage from "@img/mobile-404-light.svg?url";

export default {
  name: "NoSmallScreenSupport",

  setup() {
    const windowConfig = WindowConfigStore();

    return {
      darkMobileImage,
      lightMobileImage,
      windowConfig,
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    darkMode() {
      return this.windowStore.windowOptions.darkMode;
    },

    darkModeText() {
      return this.darkMode ? "dark" : "light";
    },
  },

  methods: {
    navigateHome() {
      this.$router.push({ name: "index" });
    },
  },
};
</script>
<style lang="scss" scoped>
.parent {
  display: flex;
  user-select: none;
  margin-top: -40px;
  flex-direction: column;
  height: 100%;
  align-items: center;
  justify-content: center;

  img {
    max-height: 350px;
    user-drag: none;
    -webkit-user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  p {
    text-align: center;
  }

  .text {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 30px;

    h2 {
      font-weight: bold;
      font-size: 20px !important;
    }

    p {
      margin-top: 10px;
      font-size: 12px !important;
      max-width: 500px;
    }
  }

  button {
    margin-top: 10px;
    background-color: black;
    border: 1px solid black;
    color: white;
    border-radius: 15px;
    font-size: 16px;
    width: fit-content;
    padding: 7px 80px;

    &.dark-mode {
      background-color: white;
      color: black;
      border: 1px solid rgb(118, 118, 118);
    }
  }
}
</style>
