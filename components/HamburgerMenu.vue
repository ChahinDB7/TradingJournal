<template>
  <div class="hamburger-menu select">
    <input id="menu__toggle" v-model="menuOpen" type="checkbox" />
    <label class="menu__btn no-margin" for="menu__toggle">
      <span />
    </label>
    <div class="background_box" @click="menuOpen = false" />
    <div class="menu__box">
      <img
        src="@img/logo.png"
        :class="{ clickable: currentRouteName !== 'index' }"
        @click="navigateHome"
      />
      <div class="menu-items">
        <NuxtLink
          :to="{ name: 'index' }"
          class="link"
          :class="{
            active: currentRouteName === 'index',
            'is-dark-mode': darkMode,
            'is-light-mode': !darkMode,
          }"
        >
          <Icon :stroke="1.5" current-color name="report-analytics" large />
          <span>Trading Journal</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HamburgerMenu",
  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },
    serverIsUp: {
      type: Boolean,
      required: true,
    },
    windowOptions: {
      type: Object,
      required: true,
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();

    return { windowConfig };
  },

  data() {
    return {
      menuOpen: false,
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },

  watch: {
    currentRouteName: {
      async handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.menuOpen = false;
      },
    },
  },

  methods: {
    navigateHome() {
      if (this.currentRouteName === "index") return;
      this.$router.push({ name: "index" });
    },
  },
};
</script>

<style scoped lang="scss">
#menu__toggle {
  opacity: 0;
  width: 75px;
  height: 60px;
  position: relative;
  left: -10px;
}
#menu__toggle:checked + .menu__btn > span {
  transform: rotate(45deg);
}
#menu__toggle:checked + .menu__btn > span::before {
  top: 0;
  transform: rotate(0deg);
}
#menu__toggle:checked + .menu__btn > span::after {
  top: 0;
  transform: rotate(90deg);
}
#menu__toggle:checked ~ .menu__box,
#menu__toggle:checked ~ .background_box {
  left: 0 !important;
}

.menu__btn {
  position: fixed;
  z-index: 500000001;
  left: 20px;
  top: 75px;
  width: 45px;
  height: 40px;
  cursor: pointer;
}
.menu__btn > span,
.menu__btn > span::before,
.menu__btn > span::after {
  display: block;
  position: absolute;
  width: 100%;
  height: 4px;
  background-color: white;
  transition-duration: 0.25s;
}
.menu__btn > span::before {
  content: "";
  top: -15px;
}
.menu__btn > span::after {
  content: "";
  top: 15px;
}
.menu__box {
  display: block;
  position: fixed;
  z-index: 500000000;
  top: 0;
  left: -100%;
  width: 300px;
  height: 100%;
  padding: 15px 0;
  margin: 0;
  list-style: none;
  background-color: #131722;
  border-right: 1px solid white;
  transition-duration: 0.25s;

  img {
    max-height: 40px;
    margin-top: 100px;
    width: 100%;
    object-fit: contain;
  }

  .menu-items {
    padding-top: 30px !important;
  }
}
.menu-items {
  display: flex;
  flex-direction: column;
  width: 100%;

  .link {
    float: left;
    white-space: nowrap;
    color: #f2f2f2;
    padding: 7px 16px;
    text-decoration: none;
    font-size: 17px;
    cursor: pointer;
    user-select: none;
    padding-left: 50px;
    display: flex;
    gap: 10px;

    span {
      position: relative;
      top: 2px;
      font-size: 20px;
    }

    &.active {
      background-color: white;
      color: black;
    }
  }
}

.background_box {
  position: fixed;
  right: 0;
  left: -100%;
  opacity: 70%;
  background: black;
  width: 100vw;
  top: 0;
  z-index: 5000000;
  height: 100vh;
}
</style>
