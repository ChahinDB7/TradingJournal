export default defineEventHandler(async (event) => {
  return [
    {
      Name: "count",
      Label: "Trade #",
      Visible: false,
      Order: 1,
    },
    {
      Name: "status",
      Label: "Status",
      Visible: true,
      Order: 2,
    },
    {
      Name: "symbol",
      Label: "Symbol",
      Visible: true,
      Order: 3,
    },
    {
      Name: "side",
      Label: "Side",
      Visible: true,
      Order: 4,
    },
    {
      Name: "quantity",
      Label: "Quantity",
      Visible: true,
      Order: 5,
    },
    {
      Name: "entry_price",
      Label: "Entry price",
      Visible: true,
      Order: 6,
    },
    {
      Name: "exit",
      Label: "Exit",
      Visible: true,
      Order: 7,
    },
    {
      Name: "leverage",
      Label: "Leverage",
      Visible: false,
      Order: 8,
    },
    {
      Name: "net_pnl",
      Label: "Net P&L",
      Visible: true,
      Order: 9,
    },
    {
      Name: "order_time",
      Label: "Order time",
      Visible: true,
      Order: 10,
    },
    {
      Name: "close_trade_time",
      Label: "Close time",
      Visible: false,
      Order: 11,
    },
    {
      Name: "trade_duration",
      Label: "Duration",
      Visible: false,
      Order: 12,
    },
    {
      Name: "commission_fees",
      Label: "Commission",
      Visible: false,
      Order: 13,
    },
    {
      Name: "risk_reward_ratio",
      Label: "Risk/reward ratio",
      Visible: false,
      Order: 14,
    },
    {
      Name: "attachments",
      Label: "Attachments",
      Visible: true,
      Order: 15,
    },
    {
      Name: "note",
      Label: "Note",
      Visible: false,
      Order: 16,
    },
    {
      Name: "rating",
      Label: "Rating",
      Visible: false,
      Order: 17,
    },
    {
      Name: "actions",
      Label: "Actions",
      Visible: true,
      Order: 18,
    },
    {
      Name: "tags",
      Label: "Tags",
      Visible: true,
      Order: 19,
    },
  ];
});
