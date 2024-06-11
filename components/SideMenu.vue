<template>
  <div class="sidebar" :class="{ small: smallMenu }">
    <div class="menu no-select">
      <Icon
        :width="22"
        :height="20"
        name="menu"
        clickable
        set-color="#FFFFFF"
        :class="{ 'is-dark-mode': darkMode }"
        @click="$emit('set-small-menu', !smallMenu)"
      />
      <img
        v-if="!smallMenu"
        src="@img/logo.png"
        :class="{ clickable: currentRouteName !== 'index' }"
        @click="navigateHome"
      />
    </div>
    <div class="menu-items">
      <NuxtLink
        v-tooltip="{
          placement: 'right-start',
          content: smallMenu ? 'Trading Journal' : '',
        }"
        :to="{ name: 'index' }"
        class="link"
        :class="{
          active: currentRouteName === 'index',
          'is-dark-mode': darkMode,
          'is-light-mode': !darkMode,
        }"
      >
        <Icon :stroke="1.5" current-color name="report-analytics" large />
        <span v-if="!smallMenu">Trading Journal</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideMenu",

  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },
    serverIsUp: {
      type: Boolean,
      required: true,
    },
    isLoggedIn: {
      type: Boolean,
      required: true,
    },
    smallMenu: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {};
  },

  computed: {
    currentRouteName() {
      return this.$route.name;
    },
  },

  mounted() {},

  methods: {
    navigateHome() {
      if (this.currentRouteName === "index") return;
      this.$router.push({ name: "index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  .menu {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 20px 25px 40px 25px;

    img {
      max-height: 34px;
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
      padding-left: 30px;
      display: flex;
      gap: 10px;

      span {
        position: relative;
        top: 2px;
      }

      &.active {
        background-color: white;
        color: black;
      }
    }
  }

  &.small {
    .menu {
      padding: 10px;
      justify-content: center;
    }

    .menu-items {
      .link {
        padding: 10px 0;
        display: flex;
        justify-content: center;

        &:not(:last-child) {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
