import priceStatusConstants from "./price-status-constants";

export const INPUTFIELD_DATA = {
  investedMoney: {
    id: 1,
    label: "Money to invest:",
    value: "",
    field: "input",
    key: "investedMoney",
    disabled: false,
    hasPrefix: true,
    prefixText: "$",
    visible: true,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: false,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Invested money",
    nextFieldFocus: "buyPrice",
    onlyMode: ["Normal"],
  },
  totalShares: {
    id: 2,
    label: "Total shares:",
    value: "",
    field: "input",
    key: "totalShares",
    required: true,
    disabled: false,
    visible: false,
    warning: false,
    readOnly: false,
    isTradingMode: false,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Total shares",
    nextFieldFocus: "buyPrice",
    onlyMode: ["Normal"],
  },
  buyPrice: {
    id: 3,
    label: "Buy price:",
    value: "",
    field: "input",
    key: "buyPrice",
    disabled: false,
    hasPrefix: true,
    required: true,
    refreshButton: false,
    prefixText: "$",
    hasButton: true,
    buttonText: "AVG",
    buttonToolTip: "Calculate the average price on multiple entry levels.",
    popUpStyleProps: {
      width: 200,
      height: 50,
    },
    visible: true,
    warning: false,
    readOnly: false,
    isTradingMode: false,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Buy price",
    nextFieldFocus: "sellPrice",
    onlyMode: ["Normal"],
  },
  sellPrice: {
    id: 4,
    label: "Sell price:",
    value: "",
    field: "input",
    key: "sellPrice",
    disabled: false,
    hasPrefix: true,
    prefixText: "$",
    visible: true,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: false,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Sell price",
    nextFieldFocus: "investedMoney",
    onlyMode: ["Normal"],
  },
  accountBalance: {
    id: 5,
    label: "Account balance:",
    value: "",
    field: "input",
    key: "accountBalance",
    disabled: false,
    hasPrefix: true,
    prefixText: "$",
    required: false,
    visible: false,
    warning: false,
    readOnly: false,
    isTradingMode: true,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Account balance",
    nextFieldFocus: "tradeSize",
    onlyMode: ["Crypto", "Forex"],
  },
  tradeSize: {
    id: 6,
    label: "Trade quantity:",
    value: "",
    field: "input",
    key: "tradeSize",
    disabled: false,
    hasPrefix: false,
    prefixText: "$",
    visible: false,
    warning: false,
    readOnly: false,
    required: true,
    isTradingMode: true,
    rightColumn: false,
    sliderMaximum: 100,
    sliderMinimum: 0.1,
    sliderStep: 0.1,
    sliderValue: 1,
    sliderDynamicWidth: true,
    textValue: "",
    labelText: "%",
    showLabel: true,
    type: "number",
    classes: ["normal-slider"],
    maxLength: 14,
    minimum: 1,
    keyWord: "Trade quantity",
    isForex: false,
    hasRadioButtons: true,
    typeModeSelected: "Lots",
    typesMode: {
      Lots: { text: "Lots", value: "1" },
      Units: { text: "Units", value: "100000" },
    },
    nextFieldFocus: "entryPrice",
    onlyMode: ["Crypto", "Forex"],
  },
  entryPrice: {
    id: 7,
    label: "Entry price:",
    value: "",
    field: "input",
    key: "entryPrice",
    disabled: false,
    hasPrefix: true,
    prefixText: "$",
    hasButton: true,
    required: true,
    buttonText: "AVG",
    buttonToolTip: "Calculate the average price on multiple entry levels.",
    popUpStyleProps: {
      width: 200,
      height: 50,
    },
    visible: false,
    warning: false,
    readOnly: false,
    refreshButton: false,
    isTradingMode: true,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Entry price",
    nextFieldFocus: "takeProfit",
    onlyMode: ["Crypto", "Forex"],
  },
  takeProfit: {
    id: 8,
    label: "Take-profit:",
    value: "",
    field: "input",
    key: "takeProfit",
    disabled: false,
    hasPrefix: false,
    prefixText: "$",
    hasSuffix: false,
    suffixText: "pips",
    labelCheckbox: {
      label: "Pips",
      id: "pips-take-profit",
      value: false,
    },
    visible: false,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: true,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Take profit",
    nextFieldFocus: "stopLoss",
    onlyMode: ["Crypto", "Forex"],
  },
  riskRewardRatio: {
    id: 9,
    label: "Risk/reward ratio:",
    value: "",
    field: "riskRewardRatio",
    key: "riskRewardRatio",
    disabled: false,
    hasPrefix: false,
    prefixText: "$",
    visible: false,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: true,
    rightColumn: false,
    showLabel: true,
    type: "number",
    maxLength: 4,
    minimum: 1,
    keyWord: "Take profit",
    nextFieldFocus: "stopLoss",
    onlyMode: ["Crypto", "Forex"],
  },
  tradeDirection: {
    id: 10,
    label: "Side:",
    value: "Buy",
    field: "dropdown",
    key: "tradeDirection",
    items: [
      { id: 1, text: "Buy" },
      { id: 2, text: "Sell" },
    ],
    disabled: false,
    visible: false,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: true,
    rightColumn: true,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Side",
    onlyMode: ["Crypto", "Forex"],
  },
  checkboxProperties: {
    id: 11,
    label: "Use slider",
    value: { first: false, second: false },
    field: "double-checkbox",
    key: "checkboxProperties",
    disabled: false,
    visible: false,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: true,
    rightColumn: true,
    showLabel: false,
    secondLabel: "Apply leverage",
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Use slider",
    onlyMode: ["Crypto"],
  },
  contractSize: {
    id: 12,
    label: "Contract size:",
    value: "100000",
    field: "input",
    key: "contractSize",
    disabled: false,
    hasPrefix: false,
    visible: false,
    noRender: true,
    warning: false,
    readOnly: false,
    isTradingMode: true,
    required: true,
    rightColumn: true,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Contract size",
    helpButton: true,
    helpButtonText: `This is the contract/lot size of a specific quote. This is very important to fill in the correct information otherwise the profit/loss result won't be correct.`,
    imageFiles: [
      "https://cyphertrading.io/assets/mtHelp.png",
      "https://cyphertrading.io/assets/cTraderHelp.png",
    ],
    stylePopUp: {
      fontSize: "12px",
      height: "119px",
      width: " 273px",
      marginLeft: "-125px",
      marginTop: "-122px",
      invincibleWidth: "265px",
      invincibleHeight: "14px",
      invincibleMarginTop: "-9px",
      invincibleMarginLeft: "-119px",
    },
    onlyMode: ["Forex"],
  },
  leverageAmount: {
    id: 13,
    label: "Leverage:",
    value: 1,
    field: "slider",
    items: [
      { id: 1, text: "1:1" },
      { id: 2, text: "1:2" },
      { id: 5, text: "1:5" },
      { id: 10, text: "1:10" },
      { id: 20, text: "1:20" },
      { id: 25, text: "1:25" },
      { id: 30, text: "1:30" },
      { id: 40, text: "1:40" },
      { id: 50, text: "1:50" },
      { id: 75, text: "1:75" },
      { id: 100, text: "1:100" },
      { id: 125, text: "1:125" },
      { id: 150, text: "1:150" },
      { id: 200, text: "1:200" },
      { id: 250, text: "1:250" },
      { id: 300, text: "1:300" },
      { id: 400, text: "1:400" },
      { id: 500, text: "1:500" },
      { id: 600, text: "1:600" },
      { id: 1000, text: "1:1000" },
    ],
    key: "leverageAmount",
    disabled: false,
    visible: false,
    warning: false,
    readOnly: false,
    required: true,
    isTradingMode: true,
    rightColumn: true,
    sliderMaximum: 125,
    sliderMinimum: 1,
    sliderStep: 1,
    labelText: "x",
    showLabel: true,
    type: "number",
    maxLength: 14,
    previouslyValue: 1,
    minimum: 1,
    helpButton: true,
    helpButtonText: `Leverage won't affect the profit/loss result.`,
    keyWord: "Leverage",
    stylePopUp: {
      fontSize: "12px",
      height: "87px",
      width: " 221px",
      marginLeft: "-100px",
      marginTop: "-93px",
      invincibleWidth: "213px",
      invincibleHeight: "14px",
      invincibleMarginTop: "-9px",
      invincibleMarginLeft: "-96px",
    },
    onlyMode: ["Crypto", "Forex"],
  },
  stopLoss: {
    id: 14,
    label: "Stop-loss:",
    value: "",
    field: "input",
    key: "stopLoss",
    disabled: false,
    hasPrefix: false,
    prefixText: "$",
    hasSuffix: false,
    suffixText: "pips",
    labelCheckbox: {
      label: "Pips",
      id: "pips-stop-loss",
      value: false,
    },
    visible: false,
    warning: false,
    required: true,
    readOnly: false,
    isTradingMode: true,
    rightColumn: true,
    showLabel: true,
    type: "number",
    maxLength: 14,
    minimum: 1,
    keyWord: "Stop-loss",
    nextFieldFocus: "accountBalance",
    onlyMode: ["Crypto", "Forex"],
  },
};

export const CALCULATION_RESULT_DATA = {
  totalAmount: {
    label: "Total amount of shares:",
    id: "totalAmount",
    value: 0,
    isTradingMode: false,
    addPrefix: "",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: true,
    cleanValue: 0,
  },
  totalValue: {
    label: "Total value of shares:",
    id: "totalValue",
    value: 0,
    isTradingMode: false,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: true,
    cleanValue: 0,
  },
  totalProfitProcent: {
    label: "Profit/loss in %:",
    id: "totalProfitProcent",
    value: 0,
    isTradingMode: false,
    addPrefix: "Procent",
    hasInfoButton: false,
    status: priceStatusConstants.IS_POSITIVE,
    visible: true,
    cleanValue: 0,
  },
  totalProfitLossInvested: {
    label: "Profit/loss with invested money:",
    id: "totalProfitLossInvested",
    value: 0,
    isTradingMode: false,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.IS_POSITIVE,
    visible: true,
    cleanValue: 0,
  },
  totalProfitLossOnly: {
    label: "Profit/loss only:",
    id: "totalProfitLossOnly",
    value: 0,
    isTradingMode: false,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.IS_POSITIVE,
    visible: true,
    cleanValue: 0,
  },
  takeProfit: {
    label: "Take-profit:",
    id: "takeProfit",
    value: 0,
    isTradingMode: true,
    addPrefix: "",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: false,
    cleanValue: 0,
  },
  riskRewardRatio: {
    label: "Risk/reward ratio:",
    id: "riskRewardRatio",
    value: 0,
    isTradingMode: true,
    addPrefix: "",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: true,
    cleanValue: 0,
  },
  tradeQuantity: {
    label: "Contract size:",
    id: "tradeQuantity",
    value: 0,
    isTradingMode: true,
    addPrefix: "",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: true,
    cleanValue: 0,
  },
  estimatedLiquidationPrice: {
    label: "Estimated liquidation price:",
    id: "estimatedLiquidationPrice",
    value: 0,
    isTradingMode: true,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: false,
    cleanValue: 0,
  },
  requiredMargin: {
    label: "Required margin:",
    id: "requiredMargin",
    value: 0,
    isTradingMode: true,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.NORMAL,
    visible: false,
    cleanValue: 0,
  },
  totalProfitsTakeProfit: {
    label: "Profits with target:",
    id: "totalProfitsTakeProfit",
    value: 0,
    isTradingMode: true,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.IS_POSITIVE,
    visible: true,
    cleanValue: 0,
  },
  totalLossOnStoploss: {
    label: "Loss with stop-loss:",
    id: "totalLossOnStoploss",
    value: 0,
    isTradingMode: true,
    addPrefix: "Currency",
    hasInfoButton: false,
    status: priceStatusConstants.IS_NEGATIVE,
    visible: true,
    cleanValue: 0,
  },
  accountBalanceAfterTrade: {
    label: "Account balance after trade:",
    id: "accountBalanceAfterTrade",
    value: 0,
    isTradingMode: true,
    addPrefix: "",
    hasInfoButton: false,
    status: priceStatusConstants.IS_BOTH,
    visible: true,
    cleanValue: 0,
  },
};

export const FOREX_SYMBOLS = [
  {
    value: "EURUSD",
    contractSize: 100000,
    selected: true,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "EURGBP",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "EURCAD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "EURCHF",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "EURNZD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "EURJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "EURAUD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "USDJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "USDCAD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "USDCHF",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "AUDUSD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "AUDCHF",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "AUDCAD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "AUDJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "AUDNZD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "GBPUSD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "GBPJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "GBPNZD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "GBPCHF",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "GBPAUD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "GBPCAD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "NZDUSD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "NZDCAD",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "NZDJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "NZDCHF",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.0001,
    leadingZeros: 100000,
  },
  {
    value: "CHFJPY",
    contractSize: 100000,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 1000,
  },
  {
    value: "XAUUSD",
    contractSize: 100,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 100,
  },
  {
    value: "XAUEUR",
    contractSize: 100,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 100,
  },
  {
    value: "US500",
    contractSize: 100,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 100,
  },
  {
    value: "NAS100",
    contractSize: 1,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 100,
  },
  {
    value: "US30",
    contractSize: 1,
    selected: false,
    minimum_change: 0.01,
    leadingZeros: 100,
  },
];

export const CRYPTO_SYMBOLS = [
  {
    value: "BTC",
    src: "bitcoin.png",
    pair: "BTCUSD",
    selected: true,
    leadingZeros: 100,
  },
  {
    value: "ETH",
    src: "ethereum.png",
    pair: "ETHUSD",
    selected: false,
    leadingZeros: 100,
  },
  {
    value: "ADA",
    src: "cardano.png",
    pair: "ADAUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "LTC",
    src: "litecoin.png",
    pair: "LTCUSD",
    selected: false,
    leadingZeros: 100000,
  },
  {
    value: "DOT",
    src: "polkadot.png",
    pair: "DOTUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "DOGE",
    src: "dogecoin.png",
    pair: "DOGEUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "LINK",
    src: "chainlink.png",
    pair: "LINKUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "ALGO",
    src: "algorand.png",
    pair: "ALGOUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "XRP",
    src: "xrp.png",
    pair: "XRPUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "UNI",
    src: "uniswap.png",
    pair: "UNIUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "XLM",
    src: "stellar.png",
    pair: "XLMUSD",
    selected: false,
    leadingZeros: 100000,
  },
  {
    value: "AAVE",
    src: "aave.png",
    pair: "AAVEUSD",
    selected: false,
    leadingZeros: 10000,
  },
  {
    value: "FIL",
    src: "fil.png",
    pair: "FILUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "MXC",
    src: "mxc.png",
    pair: "MXCUSD",
    selected: false,
    leadingZeros: 100000,
  },
  {
    value: "QNT",
    src: "qnt.png",
    pair: "QNTUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "SOL",
    src: "sol.png",
    pair: "SOLUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "ETC",
    src: "etc.png",
    pair: "ETCUSD",
    selected: false,
    leadingZeros: 1000,
  },
  {
    value: "EOS",
    src: "eos.png",
    pair: "EOSUSD",
    selected: false,
    leadingZeros: 10000,
  },
];