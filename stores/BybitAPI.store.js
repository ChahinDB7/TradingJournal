import { defineStore, acceptHMRUpdate } from "pinia";
import axios from "axios";
import CryptoJS from "crypto-js";
const url = "https://api.bybit.com";
let stopLoadingOrders = false;

function getSignature(parameters, secret) {
  let orderedParams = "";
  Object.keys(parameters)
    .sort()
    .forEach(function (key) {
      orderedParams += key + "=" + parameters[key] + "&";
    });
  orderedParams = orderedParams.substring(0, orderedParams.length - 1);

  let sign = CryptoJS.HmacSHA256(orderedParams, secret);
  sign = CryptoJS.enc.Hex.stringify(sign);
  return { sign, params: orderedParams };
}

async function fetchTimeOffset() {
  const start = Date.now();
  const response = await fetch(url + `/v2/public/time`);
  const serverTime = (await response.json()).time_now;
  const end = Date.now();
  const severTimeMs = serverTime * 1000;
  const avgDrift = (end - start) / 2;
  const timeOffset = Math.ceil(severTimeMs - end + avgDrift);
  return Date.now() + (timeOffset || 0);
}

async function makeRequest(payload, symbol = null) {
  let endpoint = `${url}${payload.endpoint}`;
  const _timestamp = await fetchTimeOffset();
  if (symbol) payload.params.symbol = symbol;
  payload.params.timestamp = _timestamp;
  payload.params.api_key = payload.api.key;
  const signature = getSignature(payload.params, payload.api.private_key);
  const sign = signature.sign;

  if (payload.method === "POST") payload.params.sign = sign;
  else endpoint = endpoint + "?" + signature.params + "&sign=" + sign;

  return { endpoint, params: payload.params };
}

export const BybitAPIStore = defineStore({
  id: "bybitAPIStore",
  state: () => ({
    activeOrders: [],
    currentPositions: [],
    conditionalOrders: [],
    closedPnlOrders: [],
    closedPnlOrdersJournal: [],
    checkingSymbol: "",
    currentSymbolOrder: 1,
  }),
  getters: {},
  actions: {
    async placeOrder(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async placeConditionalOrder(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async replaceOrder(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async getActiveOrders(payload) {
      let orders = [];
      const symbols = payload.params.symbol;
      for (const _symbol of symbols) {
        const config = await makeRequest(payload, _symbol);
        await axios.get(config.endpoint, config.params).then((res) => {
          if (res.data.ret_code === 0 && res.data.ret_msg === "OK") {
            if (!_isNil(res.data.result.data)) {
              orders.push(...res.data.result.data);
            }
          }
        });
      }

      orders = _filter(orders, function (o) {
        return o.price !== 0;
      });

      this.activeOrders = orders;
    },

    async getConditionalOrders(payload) {
      let orders = [];
      const symbols = payload.params.symbol;
      const stopOrderStatus = payload.params.stop_order_status;
      for (const _symbol of symbols) {
        for (const orderStatus of stopOrderStatus) {
          const config = await makeRequest(payload, _symbol);
          payload.params.stop_order_status = orderStatus;
          await axios.get(config.endpoint, config.params).then((res) => {
            if (res.data.ret_code === 0 && res.data.ret_msg === "OK") {
              if (
                !_isNil(res.data.result.data) &&
                !_isEmpty(res.data.result.data)
              ) {
                orders.push(...res.data.result.data);
              }
            }
          });
        }
      }

      this.conditionalOrders = orders;
    },

    async getTrades(payload) {
      let orders = [];
      const symbols = payload.params.symbol;
      for (const _symbol of symbols) {
        const config = await makeRequest(payload, _symbol);
        await axios.get(config.endpoint, config.params).then((res) => {
          if (res.data.ret_code === 0 && res.data.ret_msg === "OK") {
            if (!_isNil(res.data.result) && !_isEmpty(res.data.result)) {
              if (payload.endpoint === "/v2/private/position/list") {
                orders.push(res.data.result);
              } else {
                orders.push(...res.data.result);
              }
            }
          }
        });
      }

      orders = _filter(orders, function (o) {
        return o.entry_price !== 0 && o.entry_price !== "0";
      });

      this.currentPositions = orders;
    },

    async getAllCoinsTradesList(payload) {
      let orders = [];
      let currentPage = 1;
      const symbols = payload.params.symbol;
      const totalSymbols = symbols.length;
      let count = 1;
      for (const _symbol of symbols) {
        this.checkingSymbol = _symbol.contract;
        this.currentSymbolOrder = count;
        let noMorePages = false;
        currentPage = 1;
        while (!noMorePages) {
          payload.params.page = currentPage;
          const config = await makeRequest(payload, _symbol.contract);

          await axios.get(config.endpoint, config.params).then((res) => {
            if (res.data.ret_code === 0 && res.data.ret_msg === "OK") {
              if (
                !_isNil(res.data.result.data) &&
                !_isEmpty(res.data.result.data)
              ) {
                for (const order of res.data.result.data) {
                  order.isInverse = _symbol.isInverse ? true : false;
                  orders.push(order);
                }

                currentPage++;
              } else {
                noMorePages = true;
              }
            } else {
              noMorePages = true;
            }
          });
        }

        if (stopLoadingOrders) break;
        count++;
      }

      orders = _orderBy(orders, ["created_at"], ["desc"]);
      this.closedPnlOrdersJournal = orders;
      stopLoadingOrders = false;
    },

    async getClosedTradesList(payload) {
      let orders = [];
      let currentPage = 1;
      let noMorePages = false;
      while (!noMorePages) {
        payload.params.page = currentPage;
        const config = await makeRequest(payload);
        await axios.get(config.endpoint, config.params).then((res) => {
          if (res.data.ret_code === 0 && res.data.ret_msg === "OK") {
            if (
              !_isNil(res.data.result.data) &&
              !_isEmpty(res.data.result.data)
            ) {
              orders.push({ page: currentPage, list: res.data.result.data });
              currentPage++;
            } else {
              noMorePages = true;
            }
          }
        });
      }

      this.closedPnlOrders = orders;
    },

    async getAccountBalance(payload) {
      const config = await makeRequest(payload);
      return await axios.get(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async cancelActiveOrder(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async cancelCondtionalOrder(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async setLeverage(payload) {
      const config = await makeRequest(payload);
      return await axios.post(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async getLatestClosedPnlTrade(payload) {
      const closedPnLTrade = [];
      const symbols = payload.params.symbol;
      for (const _symbol of symbols) {
        const config = await makeRequest(payload, _symbol);
        await axios.get(config.endpoint, config.params).then((res) => {
          if (
            res.data.ret_code === 0 &&
            res.data.ret_msg === "OK" &&
            !_isEmpty(res.data.result.data)
          ) {
            if (!_isNil(res.data.result.data)) {
              closedPnLTrade.push(res.data.result.data[0]);
            }
          }
        });
      }

      try {
        const latestOrder = _maxBy(closedPnLTrade, "created_at");
        if (!_isNil(latestOrder) && !_isEmpty(latestOrder)) {
          return latestOrder.leverage;
        }
      } catch (_) {}
      return 1;
    },

    async checkAPI(payload) {
      const config = await makeRequest(payload);
      return await axios.get(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    async getCurrentPrice(payload) {
      const config = await makeRequest(payload);
      return await axios.get(config.endpoint, config.params).then((res) => {
        return res.data;
      });
    },

    stopLoadingOrders() {
      stopLoadingOrders = true;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(BybitAPIStore, import.meta.hot));
}
