import tradeStatusConstants from "./trade-status-constants";
import moment from "moment";

export default {
  getDataTableFields(currency, formatNumber) {
    return {
      thead: [
        {
          order: 1,
          value: "Trade #",
          sort: "asc",
          columnId: "Count",
          class: "bold",
          key: "count",
        },
        {
          order: 2,
          value: "Status",
          sort: "asc",
          columnId: "Status",
          class: "bold",
          key: "status",
        },
        {
          order: 3,
          value: "Symbol",
          sort: "asc",
          align: "left",
          columnId: "Symbol",
          class: "bold",
          key: "symbol",
        },
        {
          order: 4,
          value: "Side",
          sort: "asc",
          columnId: "Direction",
          class: "bold",
          key: "side",
        },
        {
          order: 5,
          value: "Quantity",
          columnId: "Quantity",
          class: "bold",
          key: "quantity",
        },
        {
          order: 6,
          value: "Entry price",
          columnId: "EntryPrice",
          class: "bold extra-padding custom-padding",
          key: "entry_price",
        },
        {
          order: 7,
          value: "Exit",
          columnId: "ExitPrice",
          class: "bold extra-padding custom-padding",
          key: "exit",
        },
        {
          order: 8,
          value: "Leverage",
          sort: "asc",
          columnId: "Leverage",
          class: "bold",
          key: "leverage",
        },
        {
          order: 9,
          value: "Net P&L",
          sort: "asc",
          columnId: "RealizedPnL",
          class: "bold",
          key: "net_pnl",
        },
        {
          order: 10,
          value: "Order time",
          sort: "desc",
          columnId: "OpenTradeAt",
          class: "bold",
          key: "order_time",
        },
        {
          order: 11,
          value: "Close time",
          sort: "asc",
          columnId: "CloseTradeAt",
          class: "bold",
          key: "close_trade_time",
        },
        {
          order: 12,
          value: "Duration",
          sort: "asc",
          columnId: "TradeDuration",
          class: "bold",
          key: "trade_duration",
        },
        {
          order: 13,
          value: "Commission",
          sort: "asc",
          columnId: "CommissionFees",
          class: "bold",
          key: "commission_fees",
        },
        {
          order: 14,
          value: "Risk : Reward",
          sort: "asc",
          columnId: "RiskRewardRatio",
          class: "bold",
          key: "risk_reward_ratio",
        },
        {
          order: 15,
          value: "Note",
          sort: "asc",
          columnId: "Note",
          class: "bold",
          key: "note",
        },
        {
          order: 16,
          value: "Rating",
          class: "bold",
          key: "rating",
        },
        {
          order: 17,
          value: "",
          field: "Action",
          key: "actions",
        },
        {
          order: 18,
          value: "Attachments",
          class: "bold",
          key: "attachments",
        },
        {
          order: 19,
          value: "Tags",
          sort: "asc",
          columnId: "TotalTags",
          class: "bold",
          key: "tags",
        },
      ],
      tbody: [
        {
          order: 1,
          field: "Count",
          width: 200,
          key: "count",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom status" + isHidden;
          },
        },
        {
          order: 2,
          slot: "status",
          field: "Status",
          width: 200,
          key: "status",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom status" + isHidden;
          },
        },
        {
          order: 3,
          field: "Symbol",
          width: 150,
          fn: (data) => {
            return data.Symbol;
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "symbol",
        },
        {
          order: 4,
          field: "Direction",
          width: 100,
          slot: "direction",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return (
              (data.Direction === "Buy" ? "is-positive" : "is-negative") +
              " zoom" +
              isHidden
            );
          },
          fn: (data) => {
            return data.Direction;
          },
          key: "side",
        },
        {
          order: 5,
          field: "Quantity",
          width: 200,
          fn: (data) => {
            return data.Quantity.toString();
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "quantity",
        },
        {
          order: 6,
          field: "EntryPrice",
          slot: "entry_price",
          width: 250,
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom extra-padding custom-padding" + isHidden;
          },
          key: "entry_price",
        },
        {
          order: 7,
          field: "ExitPrice",
          width: 150,
          slot: "exit_price",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom extra-padding custom-padding" + isHidden;
          },
          key: "exit",
        },
        {
          order: 8,
          field: "Leverage",
          width: 50,
          fn: (data) => {
            return data.Leverage !== 0 ? `${data.Leverage}x` : "N/A";
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "leverage",
        },
        {
          order: 9,
          field: "RealizedPnL",
          width: 150,
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            if (data.Status === tradeStatusConstants.IS_ONGOING_TRADE)
              return "zoom";
            return (
              (data.RealizedPnL > 0
                ? "is-positive"
                : data.RealizedPnL < 0
                ? "is-negative"
                : "") +
              " zoom" +
              isHidden
            );
          },
          fn: (data) => {
            return getRealizedPnL(data, currency, formatNumber);
          },
          key: "net_pnl",
        },
        {
          order: 10,
          field: "OpenTradeAt",
          width: 150,
          fn: (data) => {
            return formatDateTime(data.OpenTradeAt);
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "order_time",
        },
        {
          order: 11,
          field: "CloseTradeAt",
          width: 150,
          fn: (data) => {
            if (_isNil(data.CloseTradeAt)) return "N/A";
            return formatDateTime(data.CloseTradeAt);
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "close_trade_time",
        },
        {
          order: 12,
          field: "TradeDuration",
          width: 150,
          fn: (data) => {
            return data.TradeDuration;
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "trade_duration",
        },
        {
          order: 13,
          field: "CommissionFees",
          width: 150,
          fn: (data) => {
            return `${currency}${formatNumber(data.CommissionFees, true)}`;
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "commission_fees",
        },
        {
          order: 14,
          field: "RiskRewardRatio",
          width: 150,
          fn: (data) => {
            return data.RiskRewardRatio;
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "risk_reward_ratio",
        },
        {
          order: 15,
          field: "Note",
          width: 150,
          slot: "note",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "note",
        },
        {
          order: 16,
          slot: "rating",
          field: "Rating",
          width: 100,
          fn: (data) => {
            return data.Rating;
          },
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "zoom" + isHidden;
          },
          key: "rating",
        },
        {
          order: 17,
          slot: "actions",
          field: "Action",
          width: 100,
          class: (data) => {
            return data.IsHidden ? " is-hidden" : "";
          },
          key: "actions",
        },
        {
          order: 18,
          slot: "attachments",
          field: "Attachments",
          width: 100,
          class: (data) => {
            return data.IsHidden ? " is-hidden" : "";
          },
          key: "attachments",
        },
        {
          order: 19,
          field: "Tags",
          width: 200,
          slot: "tags",
          class: (data) => {
            const isHidden = data.IsHidden ? " is-hidden" : "";
            return "tags" + isHidden;
          },
          key: "tags",
        },
      ],
    };
  },
};

export const COLUMN_FIELDS = {
  count: {
    name: "count",
    label: "Trade #",
    visible: true,
  },
  status: {
    name: "status",
    label: "Status",
    visible: true,
  },
  symbol: {
    name: "symbol",
    label: "Symbol",
    visible: true,
  },
  side: {
    name: "side",
    label: "Side",
    visible: true,
  },
  quantity: {
    name: "quantity",
    label: "Quantity",
    visible: true,
  },
  entry_price: {
    name: "entry_price",
    label: "Entry price",
    visible: true,
  },
  exit: {
    name: "exit",
    label: "Exit",
    visible: true,
  },
  leverage: {
    name: "leverage",
    label: "Leverage",
    visible: false,
  },
  net_pnl: {
    name: "net_pnl",
    label: "Net P&L",
    visible: true,
  },
  order_time: {
    name: "order_time",
    label: "Order time",
    visible: true,
  },
  close_trade_time: {
    name: "close_trade_time",
    label: "Close time",
    visible: false,
  },
  trade_duration: {
    name: "trade_duration",
    label: "Duration",
    visible: false,
  },
  commission_fees: {
    name: "commission_fees",
    label: "Commission",
    visible: false,
  },
  risk_reward_ratio: {
    name: "risk_reward_ratio",
    label: "Risk/reward ratio",
    visible: false,
  },
  attachments: {
    name: "attachments",
    label: "Attachments",
    visible: true,
  },
  note: {
    name: "note",
    label: "Note",
    visible: false,
  },
  rating: {
    name: "rating",
    label: "Rating",
    visible: false,
  },
  actions: {
    name: "actions",
    label: "Actions",
    visible: true,
  },
  tags: {
    name: "tags",
    label: "Tags",
    visible: true,
  },
};

export const FIELDS_DATA = {
  selectSymbol: {
    label: "",
    value: "",
    refreshData: 4,
    field: "auto-complete",
    key: "selectSymbol",
    fixedHeight: "26px",
    isFullCaps: true,
    placeholder: "Select symbol",
    autoCompleteItems: [],
    noFocusIncrease: true,
    disabled: false,
    visible: true,
    warning: false,
    readOnly: false,
    isTradingMode: false,
    rightColumn: false,
    showLabel: false,
    type: "text",
    maxLength: 50,
    required: true,
    minimum: 1,
  },
};

function getRealizedPnL(trade, currency, formatNumber) {
  if (trade.Status === tradeStatusConstants.IS_CLOSED_TRADE) {
    if (trade.RealizedPnL > 0)
      return `${currency}${formatNumber(Math.abs(trade.RealizedPnL), true)}`;
    else return `${currency}${formatNumber(Math.abs(trade.RealizedPnL), true)}`;
  } else if (trade.Status === tradeStatusConstants.IS_ONGOING_TRADE) {
    return `Ongoing`;
  } else if (trade.Status === tradeStatusConstants.IS_SETUP) {
    if (trade.RealizedPnL === 0) return `N/A`;
    return `${currency}${formatNumber(
      Math.abs(trade.RealizedPnL),
      true,
    )} (not affected)`;
  } else {
    return "";
  }
}

function formatDateTime(date) {
  return moment(date).format("DD-MM-YYYY HH:mm");
}
