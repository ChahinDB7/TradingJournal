import { defineStore, acceptHMRUpdate } from "pinia";

import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: import.meta.env.PROD ? 10000 : 400000,
});

import { useCookies } from "vue3-cookies";
const { cookies } = useCookies();

import CryptoJS from "crypto-js";

instance.defaults.withCredentials = true;
instance.defaults.validateStatus = function (status) {
  return status >= 200 && status < 500;
};

instance.defaults.retry = 2;

function makeRequest(payload) {
  let orderedParams = "";
  let endpoint = `${payload.endpoint}`;
  Object.keys(payload.params)
    .sort()
    .forEach(function (key) {
      orderedParams += key + "=" + payload.params[key] + "&";
    });
  orderedParams = orderedParams.substring(0, orderedParams.length - 1);

  if (payload.method === "GET" && orderedParams.length > 0)
    endpoint = endpoint + "?" + orderedParams;
  else if (payload.method === "GET") endpoint;

  const t = Math.floor(Date.now() / 1000 / 10) * 10;
  const _key = import.meta.env.VITE_API_KEY;

  let contentType = "application/json";
  if (!_isNil(payload.contentType)) contentType = payload.contentType;

  let responseType = "json";
  if (!_isNil(payload.responseType)) responseType = payload.responseType;

  return {
    endpoint,
    params: payload.params,
    _ttt: t,
    key: _key,
    contentType,
    responseType,
  };
}

export const HomeAPIStore = defineStore({
  id: "homeAPIStore",
  state: () => ({
    serverIsUp: true,
    blockCalculatorForexFeatures: false,
    blockCalculatorCryptoFeatures: false,
    hasLoadedForex: false,
    hasLoadedCrypto: false,
    forexRates: {},
    cryptoRates: {},
    isLoggedIn: false,
    tutorial: [],
    resetUserSettings: 0,
    announcements: [],
    hasSetInitialDemoTrades: false,
    initialDemoTrades: [],
    demoTrades: [],
    reloadPageSettings: false,
    user: {},
  }),
  getters: {},
  actions: {
    setForexRates(payload) {
      this.blockCalculatorForexFeatures = payload.Message !== "success";
      this.hasLoadedForex = true;
      this.forexRates = payload.Data;
    },

    setCryptoRates(payload) {
      this.blockCalculatorCryptoFeatures = payload.Message !== "success";
      this.hasLoadedCrypto = true;
      this.cryptoRates = payload.Data;
    },

    setCounResettUserSettings() {
      this.resetUserSettings++;
    },

    setTutorial(payload) {
      this.tutorial = payload;
    },

    setAnnouncments(payload) {
      this.announcements = payload;
    },

    setDemoTrades(payload, format = true) {
      if (!_isEmpty(payload)) {
        this.reloadPageSettings = true;

        if (format) {
          payload = _orderBy(payload, ["CreatedAt"], ["asc"]);

          _forEach(payload, function (journal) {
            if (!_isNil(journal.Trades) && !_isEmpty(journal.Trades)) {
              journal.Trades = _orderBy(
                journal.Trades,
                ["OpenTradeAt"],
                ["desc"],
              );
            }
          });
        }

        setTimeout(() => {
          this.reloadPageSettings = false;
        }, 1);

        this.demoTrades = payload;

        if (!this.hasSetInitialDemoTrades) {
          this.hasSetInitialDemoTrades = true;
          this.initialDemoTrades = payload;
        }
      }
    },

    setServerState(payload) {
      this.serverIsUp = payload;
    },

    setLoginState(payload) {
      this.isLoggedIn = payload;
    },

    setBearerToken(token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    },

    setJournalState(payload) {
      _forEach(this.user.TradingJournal, function (journal) {
        if (payload.Id === journal.Id) journal.IsMain = true;
        else journal.IsMain = false;
      });
    },

    setUserState(payload) {
      if (_isEqual(payload, this.user)) {
        return;
      }

      this.reloadPageSettings = true;

      if (!_isEmpty(payload)) {
        payload.TradingJournal = _orderBy(
          payload.TradingJournal,
          ["CreatedAt"],
          ["asc"],
        );

        _forEach(payload.TradingJournal, function (journal) {
          if (!_isNil(journal.Trades) && !_isEmpty(journal.Trades)) {
            journal.Trades = _orderBy(
              journal.Trades,
              ["OpenTradeAt"],
              ["desc"],
            );
          }
        });

        if (!_isNil(payload.UserOption) && !_isEmpty(payload.UserOption)) {
          payload.UserOption.FormattedFavoriteTickers = _cloneDeep(
            _map(payload.UserOption.FavoriteTickers, (symbol, index) => {
              return symbol.TradingViewSymbol.Symbol;
            }),
          );
        }
      }

      this.user = payload;

      setTimeout(() => {
        this.reloadPageSettings = false;
      }, 1);
    },

    updateSettings(body) {
      const payload = {
        params: {},
        body,
        endpoint: "/usersettings/update-settings",
        method: "post",
        getResponse: true,
      };

      this.postRequest(payload)
        .then((response) => {
          if (
            response.status === 200 &&
            !_isNil(response.data.Id) &&
            response.data.Id.length === 36
          ) {
            this.setUserState(response.data);
          } else {
            this.$noty.error(
              `Something went wrong on the server. Settings couldn't be updated. Please try it again later.`,
            );
          }
        })
        .catch((response) => {
          this.$noty.error(
            `Something went wrong on the server. Settings couldn't be updated. Please try it again later.`,
          );
        });
    },

    async updateCalculatorSettings(body) {
      const payload = {
        params: {},
        body,
        endpoint: "/usersettings/update-calculator-settings",
        method: "post",
        getResponse: true,
      };

      const response = await this.postRequest(payload);

      if (
        response.status === 200 &&
        !_isNil(response.data.Id) &&
        response.data.Id.length === 36
      ) {
        this.setUserState(response.data);
      } else {
        this.$noty.error(
          `Something went wrong on the server. Settings couldn't be updated. Please try it again later.`,
        );
      }
    },
    async updateTradingJournalSettings(body) {
      const payload = {
        params: {},
        body,
        endpoint: "/usersettings/update-trading-journal-settings",
        method: "post",
        getResponse: true,
      };

      const response = await this.postRequest(payload);

      if (
        response.status === 200 &&
        !_isNil(response.data.Id) &&
        response.data.Id.length === 36
      ) {
        this.setUserState(response.data);
      } else {
        this.$noty.error(
          `Something went wrong on the server. Settings couldn't be updated. Please try it again later.`,
        );
      }
    },

    async getRequest(payload) {
      const getResponse = payload.getResponse;
      let config = { ...makeRequest(payload), getResponse };
      let data = await this.doGetRequest(config);
      if ((_isEmpty(data) || _isNil(data)) && payload.doubleCheck) {
        this.sleep(1000);
        config = { ...makeRequest(payload), getResponse };
        data = await this.doGetRequest(config);
      }

      return data;
    },

    async postRequest(payload) {
      const body = payload.body;
      let config = { ...makeRequest(payload), body };
      let data = await this.doPostRequest(config);

      return data;
    },

    async deleteRequest(payload) {
      const body = payload.body;
      let config = { ...makeRequest(payload), body };
      let data = await this.doDeleteRequest(config);

      return data;
    },

    async doGetRequest(config) {
      const token = this.getToken();
      return await instance
        .get(config.endpoint, {
          responseType: config.responseType,
          headers: {
            [token.SIGN_KEY]: [token.SIGN_VALUE],
            "X-ray-x": config.key,
            "utc-fetch-time": config._ttt,
            "Content-Type": config.contentType,
          },
        })
        .then((response) => {
          if (config.getResponse) {
            return response;
          }
          return response.data;
        })
        .catch((res) => {
          return res;
        });
    },

    async doPostRequest(config) {
      const token = this.getToken();

      return await instance
        .post(config.endpoint, config.body, {
          responseType: config.responseType,
          headers: {
            [token.SIGN_KEY]: [token.SIGN_VALUE],
            "X-ray-x": config.key,
            "utc-fetch-time": config._ttt,
            "Content-Type": config.contentType,
          },
        })
        .then((response) => {
          return response;
        })
        .catch((res) => {
          return res;
        });
    },

    async doDeleteRequest(config) {
      const token = this.getToken();
      return await instance
        .delete(config.endpoint, config.body, {
          responseType: config.responseType,
          headers: {
            [token.SIGN_KEY]: [token.SIGN_VALUE],
            "X-ray-x": config.key,
            "utc-fetch-time": config._ttt,
            "Content-Type": config.contentType,
          },
        })
        .then((response) => {
          return response;
        })
        .catch(() => {
          return {};
        });
    },

    getHostFromURL(url) {
      const parsedUrl = new URL(url);
      const { hostname } = parsedUrl;
      const domain = hostname
        .replace("www.", "")
        .split(".")
        .slice(-2)
        .join(".");
      return domain;
    },

    getToken() {
      let currentUrl = window.location.href;
      const host = this.getHostFromURL(currentUrl);
      let enc = new TextEncoder();
      let bytes = enc.encode(host.toString());
      let hash = CryptoJS.SHA256(CryptoJS.lib.WordArray.create(bytes));
      const signed = hash.toString();
      let SIGN_KEY = signed.slice(0, 10);
      let SIGN_VALUE = signed.slice(-10);
      return { SIGN_KEY, SIGN_VALUE };
    },

    sleep(delay) {
      const start = new Date().getTime();
      while (new Date().getTime() < start + delay);
    },

    // this.homeAPIStore.setCookie("name", value, { maxAge: 1209600, path: "/", httpOnly: false, secure: false });
    setCookie(name, value, options) {
      cookies.set(name, value, options);
    },

    removeCookie(name) {
      cookies.remove(name);
    },

    getCookie(name) {
      return cookies.get(name);
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(HomeAPIStore, import.meta.hot));
}
