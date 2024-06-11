<template>
  <div
    id="app"
    class="background-transition"
    :class="{
      'is-dark-mode': darkMode,
      'light-mode': !darkMode,
      'is-loaded': hasInitialLoadedUser,
    }"
  >
    <div
      v-if="
        !windowOptions.isMobile &&
        windowOptions.windowWidth <= 1000 &&
        currentRouteName !== null &&
        !loadingPage
      "
      class="full-height"
    >
      <NoSmallScreenSupport />
    </div>
    <div
      v-else
      class="grid-container"
      :class="{ small: windowOptions.smallMenu }"
    >
      <div class="grid-container-navbar">
        <Header
          id="header"
          :has-initial-loaded-user="hasInitialLoadedUser"
          :user-settings="userSettings"
          :window-options="windowOptions"
          :server-is-up="homeStore.serverIsUp"
          :is-logged-in="isLoggedIn"
          @open-settings="
            visibleModals.settingsVisible = !visibleModals.settingsVisible
          "
          @account-user="openAccount"
          @open-tutorial="
            visibleModals.tutorialVisible = !visibleModals.tutorialVisible
          "
          @open-announcements="
            visibleModals.announcementVisible =
              !visibleModals.announcementVisible
          "
          @open-partners="
            visibleModals.partnersVisible = !visibleModals.partnersVisible
          "
        />
      </div>
      <div
        class="grid-container-sidebar background-transition"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <SideMenu
          :dark-mode="darkMode"
          :small-menu="smallMenu"
          :is-logged-in="isLoggedIn"
          :server-is-up="homeStore.serverIsUp"
          @set-small-menu="windowOptions.smallMenu = $event"
        />
      </div>
      <div ref="content-block" class="grid-container-content is-thumb">
        <div
          class="content"
          :style="{ zoom: `${windowStore.windowOptions['windowScaling']}%` }"
        >
          <HorizontalLiveTracker
            v-if="
              windowStore.windowOptions['showTickerWidget'] &&
              !isLoading &&
              hasInitialLoadedUser
            "
            :user-settings="userSettings"
            :dark-mode="darkMode"
          />
          <div
            v-if="isScrolled"
            class="scroll-to-top background-transition"
            :class="{ 'is-dark-mode': darkMode }"
            @click="scrollToTop"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-chevrons-up"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M7 11l5 -5l5 5" />
              <path d="M7 17l5 -5l5 5" />
            </svg>
          </div>
          <div
            class="container block"
            :class="{
              'less-margin':
                hasInitialLoadedUser &&
                windowStore.windowOptions['showTickerWidget'],
              'no-margin': false,
            }"
          >
            <NuxtPage
              :settings-visible="visibleModals.settingsVisible"
              :login-visible="visibleModals.loginVisible"
              :welcome-visible="visibleModals.welcomeVisible"
              :is-loading="isLoading"
              :has-initial-loaded-user="hasInitialLoadedUser"
              :user="homeAPIStore.user"
              :user-settings="userSettings"
              :window-options="windowOptions"
              :dark-mode="darkMode"
              @reload-demo-trades="getDemoTrades"
              @open-settings="openSettings"
              @close-settings="visibleModals.settingsVisible = false"
              @close-login="setLoginDialog(false)"
              @open-login="openLoginDialog"
            />
            <ModalsContainer />

            <!-- <PageNotFound v-show="currentRouteName === null" /> -->
            <CustomDialog
              v-if="visibleModals.welcomeVisible"
              :dark-mode="darkMode"
              :dialog-width="'600px'"
              @secondary-button="visibleModals.welcomeVisible = false"
            >
              <template #body>
                <WelcomeDialogBody
                  :dark-mode="darkMode"
                  :dialog-visible="visibleModals.welcomeVisible"
                  @show-modal="visibleModals.welcomeVisible = true"
                  @primary-button="closeWelcome"
                  @secondary-button="closeWelcome"
                />
              </template>
            </CustomDialog>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  setup() {
    const windowConfig = WindowConfigStore();
    const homeAPIStore = HomeAPIStore();
    return { windowConfig, homeAPIStore };
  },

  data() {
    return {
      refreshSettings: false,
      loadingPage: true,
      isLoading: true,
      hasInitialLoadedUser: false,
      openAccountSettings: false,
      visibleModals: {
        settingsVisible: false,
        loginVisible: false,
        openSignUpPage: false,
        loginDialogBlockEvent: false,
        settingsDialogBlockEvent: false,
        tutorialVisible: false,
        partnersVisible: false,
        announcementVisible: false,
        welcomeVisible: false,
      },
      tutorialLastTabIndex: 0,
      announcementsLastTabIndex: 0,
      partnersLastTabIndex: 0,
      windowOptions: {
        smallMenu: false,
        windowWidth: 0,
        scrollY: 0,
        isMobile: false,
      },
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    homeStore() {
      if (_isNil(this.homeAPIStore.$state)) return {};
      return this.homeAPIStore.$state;
    },

    darkMode() {
      return this.windowStore.windowOptions.darkMode;
    },

    smallScreen() {
      return this.windowOptions.windowWidth <= 1000;
    },

    currentRouteName() {
      return this.$route.name;
    },

    isLoggedIn() {
      return (
        this.homeStore.isLoggedIn &&
        !_isNil(this.homeStore.user) &&
        !_isNil(this.homeStore.user.Id)
      );
    },

    userSettings() {
      if (!this.isLoggedIn) return null;
      return this.homeStore.user.UserOption;
    },
    showSettings() {
      return !_isNil(this.userSettings);
    },
    smallMenu() {
      if (_isNil(this.windowOptions.smallMenu)) return false;
      return this.windowOptions.smallMenu;
    },
    currentRouteTitle() {
      const currentRouteName = this.currentRouteName;

      const router = _find(this.$router.options.routes, function (o) {
        return o.name === currentRouteName;
      });

      if (_isNil(router)) return "";

      return router.title;
    },

    isScrolled() {
      return this.windowOptions.scrollY >= 700;
    },
  },

  watch: {
    darkMode: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
      },
    },
    "windowOptions.windowWidth": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (newValue <= 1000) {
          this.windowOptions.smallMenu = true;
        }

        this.windowConfig.setSingleConfig({
          type: "windowOptions",
          value: this.windowOptions,
        });
      },
    },
    "windowOptions.smallMenu": {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(oldValue)) return;
        if (newValue) localStorage.setItem("small-menu", newValue);
        else localStorage.removeItem("small-menu");

        this.windowConfig.setSingleConfig({
          type: "smallMenu",
          value: newValue,
        });
        this.windowConfig.setSingleConfig({
          type: "windowOptions",
          value: this.windowOptions,
        });
      },
    },
    "windowOptions.scrollY": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.windowConfig.setSingleConfig({
          type: "windowOptions",
          value: this.windowOptions,
        });
      },
    },
    "windowOptions.isMobile": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.windowConfig.setSingleConfig({
          type: "windowOptions",
          value: this.windowOptions,
        });
      },
    },
    "homeStore.tutorial": {
      handler(newValue, oldValue) {
        if (oldValue === newValue || newValue.length === 0) return;

        if (
          !localStorage.getItem("showed-welcome") &&
          !this.visibleModals.loginVisible &&
          !this.visibleModals.announcementVisible
        ) {
          this.visibleModals.welcomeVisible = true;
        }
      },
    },
    hasInitialLoadedUser: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (newValue && !_isNil(this.userSettings)) {
          if (this.windowOptions.isMobile) return;
          this.windowConfig.setSingleConfig({
            type: "windowScaling",
            value: this.userSettings.WindowScaling,
          });
        }
      },
    },
    "userSettings.WindowScaling": {
      handler(newValue, oldValue) {
        if (oldValue === newValue || _isNil(newValue)) return;
        if (this.windowOptions.isMobile) return;
        this.windowConfig.setSingleConfig({
          type: "windowScaling",
          value: newValue,
        });
      },
    },
    "windowStore.windowOptions.windowScaling": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        // this.setTooltipScale(`${newValue}%`);
      },
    },
    userSettings: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        this.refreshSettings = true;

        setTimeout(() => {
          this.refreshSettings = false;
        }, 100);
      },
    },
    isLoggedIn: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (newValue && !_isNil(this.homeStore.user)) {
          this.hasInitialLoadedUser = true;
        }
      },
    },
    currentRouteTitle: {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (newValue === "") {
          newValue = "Cypher Trading";
        }
        document.title = `${newValue} - Cypher Trading`;
      },
    },

    "visibleModals.loginVisible": {
      handler(newValue, oldValue) {
        if (oldValue === newValue) return;
        if (!newValue) {
          this.visibleModals.openSignUpPage = false;
        }

        if (newValue && this.visibleModals.settingsVisible && this.isLoggedIn) {
          this.openAccountSettings = true;
          this.visibleModals.loginVisible = false;
          setTimeout(() => {
            this.openAccountSettings = false;
          }, 100);
        }
      },
    },
  },

  async mounted() {
    this.$nextTick(() => {
      this.getUser();

      this.getPrices("/forex", "forex").then((response) => {
        if (response !== null) this.homeAPIStore.setForexRates(response);
      });

      this.getPrices("/crypto", "crypto").then((response) => {
        if (response !== null) this.homeAPIStore.setCryptoRates(response);
      });

      this.$refs["content-block"].addEventListener("scroll", this.onScroll);

      window.addEventListener("resize", this.onResize);
      this.windowOptions.windowWidth = window.innerWidth;
      this.loadingPage = false;

      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a,
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4),
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      this.windowOptions.isMobile = check;
      if (check)
        this.windowConfig.setSingleConfig({
          type: "windowScaling",
          value: 100,
        });
    });

    if (localStorage.getItem("small-menu")) {
      this.windowOptions.smallMenu = true;
    }
  },

  methods: {
    setTooltipScale(scale) {
      const dynamicStyle = `.v-popper__popper.scaled { zoom: ${scale.replace(
        "%",
        "",
      )}%; }`;

      const existingStyle = document.getElementById("dynamic-styles");
      if (existingStyle) {
        existingStyle.parentNode.removeChild(existingStyle);
      }

      const style = document.createElement("style");
      style.id = "dynamic-styles";
      style.innerHTML = dynamicStyle;
      document.head.appendChild(style);
    },

    onResize() {
      this.windowOptions.windowWidth = window.innerWidth;
    },

    openSettings(tabIndex = 0) {
      this.settingsLastTabIndex = tabIndex;
      this.visibleModals.settingsVisible = true;
    },

    async getPrices(endpoint, label) {
      if (!this.homeStore.serverIsUp) return;

      const payload = {
        params: {},
        endpoint: `/datarates${endpoint}`,
        method: "GET",
        doubleCheck: true,
        getResponse: true,
      };

      const response = await this.homeAPIStore.getRequest(payload);

      if (response.code === "ERR_NETWORK") {
        this.$noty.error(
          `There was an error gathering the current ${label} rates. Please try it again later.`,
        );
        return null;
      }

      if (
        (_isEmpty(response.data) || _isNil(response.data)) &&
        _isNil(response.exception)
      ) {
        this.$noty.error(
          `There was an error gathering the current ${label} rates. Please try it again later.`,
        );
        this.windowConfig.setSingleConfig({
          type: "currentMode",
          value: "Normal",
        });
      } else {
        return response.data;
      }

      return null;
    },

    async getTradingJournalFields() {
      if (!this.homeStore.serverIsUp) return;

      const payload = {
        params: {},
        endpoint: `/tradingjournal/get-fields`,
        method: "GET",
        getResponse: true,
      };

      const response = await this.homeAPIStore.getRequest(payload);

      if (response.code === "ERR_NETWORK") {
        return;
      }

      if (!_isEmpty(response.data) && !_isNil(response.data)) {
        this.windowConfig.setTradingJournalFields(response.data);
      }
    },

    openAccount() {
      if (this.isLoggedIn) {
        this.visibleModals.loginVisible = !this.visibleModals.loginVisible;
        this.visibleModals.settingsVisible =
          !this.visibleModals.settingsVisible;
      } else {
        this.visibleModals.loginVisible = !this.visibleModals.loginVisible;
      }
    },

    getUser() {
      const payload = {
        params: {},
        endpoint: "/user",
        method: "GET",
        getResponse: true,
        doubleCheck: true,
      };

      if (process.env.NODE_ENV === "development") {
        const token = this.homeAPIStore.getCookie("token");
        if (token) this.homeAPIStore.setBearerToken(token);
      }

      const token = sessionStorage.getItem("token");
      if (token) this.homeAPIStore.setBearerToken(token);

      this.homeAPIStore
        .getRequest(payload)
        .then((response) => {
          let collectOtherAPIData = true;

          if (response.code === "ERR_NETWORK") {
            collectOtherAPIData = false;
            this.$noty.error(
              `Something went wrong with the server. Some features will be limited.`,
            );
            this.homeAPIStore.setServerState(false);
            this.homeAPIStore.setLoginState(false);
          } else if (
            response.status === 200 &&
            !_isNil(response.data.Id) &&
            response.data.Id.length === 36
          ) {
            this.homeAPIStore.setLoginState(true);
            this.homeAPIStore.setUserState(response.data);
          }

          if (collectOtherAPIData) {
            this.getDemoTrades();
            this.getTradingJournalFields();
          }
        })
        .catch((response) => {
          this.homeAPIStore.setLoginState(false);
        })
        .finally(() => {
          this.hasInitialLoadedUser = true;
          this.isLoading = false;
        });
    },

    getDemoTrades(refresh = false) {
      if (refresh) {
        if (
          _isEqual(this.homeStore.initialDemoTrades, this.homeStore.demoTrades)
        ) {
          return;
        }
      }

      const payload = {
        params: {},
        endpoint: "/tradingjournal/demo-trades",
        method: "GET",
        getResponse: true,
      };

      this.homeAPIStore
        .getRequest(payload)
        .then((response) => {
          if (response.status === 200) {
            this.homeAPIStore.setDemoTrades(response.data);

            if (refresh) {
              this.$noty.success(`The Trading Journal has been refreshed.`);
            }
          }
        })
        .catch((response) => {
          this.homeAPIStore.setDemoTrades([], false);
        });
    },

    openLoginDialog(isCreate = false) {
      this.visibleModals.openSignUpPage = isCreate;
      this.setLoginDialog(true);
    },

    setLoginDialog(visible) {
      this.visibleModals.loginVisible = visible;
    },

    closeSettings(lastTabIndex) {
      this.settingsLastTabIndex = lastTabIndex;
      this.visibleModals.settingsVisible = false;
    },

    closeTutorial(lastTabIndex) {
      this.tutorialLastTabIndex = lastTabIndex;
      this.visibleModals.tutorialVisible = false;
    },

    closeAnnouncements(lastTabIndex) {
      this.announcementsLastTabIndex = lastTabIndex;
      this.visibleModals.announcementVisible = false;
    },

    closePartners(lastTabIndex) {
      this.partnersLastTabIndex = lastTabIndex;
      this.visibleModals.partnersVisible = false;
    },

    closeWelcome(showTutorial = false) {
      this.visibleModals.welcomeVisible = false;
      localStorage.setItem("showed-welcome", true);

      if (showTutorial) {
        this.visibleModals.tutorialVisible = true;
      }
    },

    scrollToTop() {
      this.$refs["content-block"].scrollTo({ top: 0, behavior: "smooth" });
    },

    onScroll() {
      this.windowOptions.scrollY = this.$refs["content-block"].scrollTop;
    },
  },
};
</script>

<style lang="scss">
.block {
  margin-top: 20px !important;
  max-width: 94% !important;
  display: flex !important;
  justify-content: center !important;

  &.no-margin {
    margin-left: 0;
    margin-right: 0;
    width: 100%;
    max-width: unset !important;
  }
}

#app {
  font-family: "Arial";
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #121212;
  height: 100dvh;
  scroll-behavior: smooth;
  background: #e9e9e9;
  flex: 1 1 auto;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  max-width: 100%;
  position: relative;

  &.is-dark-mode {
    background-color: #1e222d !important;
    color: white !important;
  }

  .grid-container {
    display: grid;
    height: 100dvh;
    overflow-y: hidden;
    grid-template-columns: 225px auto;
    transition: grid-template-columns 0.2s ease;
    grid-template-areas:
      "sidebar navbar"
      "sidebar content";

    .grid-container-navbar {
      grid-area: navbar;
      max-height: auto;
    }

    .grid-container-sidebar {
      grid-area: sidebar;
      height: inherit;
      background-color: #121212;
      border-right: 1px solid #808080;

      &.is-dark-mode {
        border-right: 1px solid white;
        background-color: #131722;
      }
    }

    .grid-container-content {
      height: 100%;
      grid-area: 2 / 2 / span 2;
      overflow-y: auto;
    }

    &.small {
      grid-template-columns: 55px auto;
    }
  }

  @media (max-width: 1000px) {
    .grid-container-sidebar {
      display: none;
    }
    .grid-container {
      grid-template-areas:
        "sidebar navbar"
        "content content";

      grid-template-columns: 0 auto !important;
      grid-template-rows: 150px auto !important;
    }

    .grid-container-content {
      .content {
        .ticker-widget {
          div > div > div > div {
            height: auto !important;

            iframe {
              height: auto !important;
            }
          }
        }
      }
    }
  }
}

.scroll-to-top {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 0 20px 15px 0;
  border-radius: 10px;
  background-color: #ffffff;
  border: 1px solid #aeaeae;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.is-dark-mode {
    background-color: #131722;
    border: 1px solid rgb(118, 118, 118);
  }
}

.full-height {
  height: 100dvh;
}
</style>
