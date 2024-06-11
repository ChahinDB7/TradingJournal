import moment from "moment";
import humanizeDuration from "humanize-duration";
import dayOfWeekTranslation from "@/lib/day-of-week-translations";
import orderTypeTranslation from "@/lib/order-type-translations";
import entryStatusConstants from "@/lib/entry-status-constants";

export default {
  getFormulas(allTrades, startBalance) {
    const winTrades = _filter(allTrades, function (o) {
      return o.RealizedPnL > 0;
    });

    const lossTrades = _filter(allTrades, function (o) {
      return o.RealizedPnL < 0;
    });

    const longsTradesWins = _filter(winTrades, function (o) {
      return o.Direction === "Buy";
    });

    const shortTradesWins = _filter(winTrades, function (o) {
      return o.Direction === "Sell";
    });

    const longsTrades = _filter(allTrades, function (o) {
      return o.Direction === "Buy";
    });

    const shortTrades = _filter(allTrades, function (o) {
      return o.Direction === "Sell";
    });

    const data = {
      allTrades,
      winTrades,
      lossTrades,
      longsTrades,
      shortTrades,
      longsTradesWins,
      shortTradesWins,
      startBalance,
    };

    return {
      // Progress ellipse
      winRate: this.winRate(data),
      longsWinRate: this.longsWinRate(data),
      shortsWinRate: this.shortsWinRate(data),
      totalLongs: this.totalLongs(data),
      totalLongsProcent: this.totalLongsProcent(data),

      // Basic data
      totalGrossProfits: this.totalGrossProfits(data),
      totalGrossLoss: this.totalGrossLoss(data),

      averageProfitsEachTrade: this.averageProfitsEachTrade(data),
      averageLossEachTrade: this.averageLossEachTrade(data),

      totalProfitsLong: this.totalProfitsLong(data),
      totalProfitsShort: this.totalProfitsShort(data),

      totalLossLong: this.totalLossLong(data),
      totalLossShort: this.totalLossShort(data),

      winningStreak: this.winningStreak(data),
      losingStreak: this.losingStreak(data),

      averagePnL: this.averagePnL(data),

      bestPerformingDay: this.bestPerformingDay(data),
      worstPerformingDay: this.worstPerformingDay(data),

      totalTrades: this.totalTrades(data),
      totalLongTrades: this.totalLongTrades(data),
      totalShortTrades: this.totalShortTrades(data),

      bestPerformanceTag: this.bestPerformanceTag(data),
      worstPerformanceTag: this.worstPerformanceTag(data),

      // Advance data
      totalBreakevenTrades: this.totalBreakevenTrades(data),
      averageTradeDuration: this.averageTradeDuration(data),

      averageWeeklyPerformance: this.averageWeeklyPerformance(data),
      averageMonthlyPerformance: this.averageMonthlyPerformance(data),

      returnOfInvestment: this.returnOfInvestment(data),
      totalPaidFees: this.totalPaidFees(data),

      bestPerformanceIntrument: this.bestPerformanceIntrument(data),
      worstPerformanceIntrument: this.worstPerformanceIntrument(data),

      bestPerformanceOnOrderType: this.bestPerformanceOnOrderType(data),
      averageTradeSize: this.averageTradeSize(data),
      averageRiskRewardRatio: this.averageRiskRewardRatio(data),
      profitFactor: this.profitFactor(data),

      maximumPeak: this.calculatePeakAndDrawdown(data, 1),
      maximumDrawdown: this.calculatePeakAndDrawdown(data, 2),

      bestAverageOpenTradeTime: this.bestAverageOpenTradeTime(data),
      worstAverageOpenTradeTime: this.worstAverageOpenTradeTime(data),

      tradeFrequencyWeekly: this.tradeFrequencyWeekly(data),
      tradeFrequencyMonthly: this.tradeFrequencyMonthly(data),

      averageRewardOnAccount: this.averageRewardOnAccount(data),
      averageLossOnAccount: this.averageLossOnAccount(data),

      averageRating: this.averageRating(data),
    };
  },

  winRate(data) {
    let winRate = (data.winTrades.length / data.allTrades.length) * 100;
    return parseInt(winRate);
  },

  longsWinRate(data) {
    let longsWinrate =
      (data.longsTradesWins.length / data.longsTrades.length) * 100;
    if (isNaN(longsWinrate)) longsWinrate = 0;
    return parseInt(longsWinrate);
  },

  shortsWinRate(data) {
    let shortsWinRate =
      (data.shortTradesWins.length / data.shortTrades.length) * 100;
    if (isNaN(shortsWinRate)) shortsWinRate = 0;
    return parseInt(shortsWinRate);
  },

  totalLongs(data) {
    return data.longsTrades.length;
  },

  totalLongsProcent(data) {
    const totalLongsProcent =
      (data.longsTrades.length / data.allTrades.length) * 100;
    return parseInt(totalLongsProcent);
  },

  totalGrossProfits(data) {
    const totalGrossProfits = _sumBy(data.winTrades, (trade) => {
      return trade.RealizedPnL;
    });

    return totalGrossProfits;
  },

  averageProfitsEachTrade(data) {
    const totalPnLWins = _sumBy(data.winTrades, (trade) => {
      return trade.RealizedPnL;
    });

    if (_isEmpty(data.winTrades)) return 0;

    const averageProfitsEachTrade = totalPnLWins / data.winTrades.length;
    return averageProfitsEachTrade;
  },

  totalProfitsLong(data) {
    const totalProfitsLong = _sumBy(data.winTrades, (trade) => {
      if (trade.Direction === "Sell") return 0;
      return trade.RealizedPnL;
    });

    if (_isNil(totalProfitsLong)) return 0;
    return totalProfitsLong;
  },

  totalProfitsShort(data) {
    const totalProfitsShort = _sumBy(data.winTrades, (trade) => {
      if (trade.Direction === "Buy") return 0;
      return trade.RealizedPnL;
    });

    if (_isNil(totalProfitsShort)) return 0;
    return totalProfitsShort;
  },

  totalTrades(data) {
    const totalTrades = data.allTrades.length;

    return totalTrades;
  },

  totalLongTrades(data) {
    const totalLongTrades = data.longsTrades.length;

    return totalLongTrades;
  },

  totalShortTrades(data) {
    const totalShortTrades = data.shortTrades.length;

    return totalShortTrades;
  },

  bestPerformanceTag(data) {
    let bestPerformanceTag = null;

    const filterOutAllTradesWithoutTags = _filter(data.allTrades, function (c) {
      return c.Tags.length > 0;
    });

    if (filterOutAllTradesWithoutTags.length > 0) {
      const result = _groupBy(
        filterOutAllTradesWithoutTags,
        (obj) => obj.Tags[0].Name,
      );
      const sums = Object.keys(result).map((tag) => ({
        tag: result[tag][0].Tags[0],
        sum: _sumBy(result[tag], "RealizedPnL"),
      }));
      const positiveSums = sums.filter((sum) => sum.sum > 0);
      const maxPositiveSum = _maxBy(positiveSums, (sum) => sum.sum);
      if (maxPositiveSum) bestPerformanceTag = maxPositiveSum;
    }

    return bestPerformanceTag;
  },

  worstPerformanceTag(data) {
    let worstPerformanceTag = null;

    const filterOutAllTradesWithoutTags = _filter(data.allTrades, function (c) {
      return c.Tags.length > 0;
    });

    if (filterOutAllTradesWithoutTags.length > 0) {
      const result = _groupBy(
        filterOutAllTradesWithoutTags,
        (obj) => obj.Tags[0].Name,
      );
      const sums = Object.keys(result).map((tag) => ({
        tag: result[tag][0].Tags[0],
        sum: _sumBy(result[tag], "RealizedPnL"),
      }));
      const negativeSums = sums.filter((sum) => sum.sum < 0);
      const maxNegativeSum = _minBy(negativeSums, (sum) => sum.sum);
      if (maxNegativeSum) worstPerformanceTag = maxNegativeSum;
    }

    return worstPerformanceTag;
  },

  totalGrossLoss(data) {
    const totalGrossLoss = _sumBy(data.lossTrades, (trade) => {
      return trade.RealizedPnL;
    });

    if (_isNil(totalGrossLoss)) return 0;
    return totalGrossLoss;
  },

  averageLossEachTrade(data) {
    const totalPnLLoss = _sumBy(data.lossTrades, (trade) => {
      return trade.RealizedPnL;
    });

    if (_isEmpty(data.lossTrades)) return 0;

    const averageLossEachTrade = totalPnLLoss / data.lossTrades.length;
    return averageLossEachTrade;
  },

  totalLossLong(data) {
    const totalLossLong = _sumBy(data.lossTrades, (trade) => {
      if (trade.Direction === "Sell") return 0;
      return trade.RealizedPnL;
    });

    if (_isNil(totalLossLong)) return 0;
    return totalLossLong;
  },

  totalLossShort(data) {
    const totalLossShort = _sumBy(data.lossTrades, (trade) => {
      if (trade.Direction === "Buy") return 0;
      return trade.RealizedPnL;
    });

    return totalLossShort;
  },

  winningStreak(data) {
    let winStreak = 0;
    let currentWStreak = 0;

    _forEach(data.allTrades, function (trade) {
      if (trade.RealizedPnL > 0) {
        currentWStreak++;
      } else {
        winStreak = Math.max(winStreak, currentWStreak);
        currentWStreak = 0;
      }
    });

    const winningStreak = Math.max(winStreak, currentWStreak);

    return winningStreak;
  },

  losingStreak(data) {
    let lossStreak = 0;
    let currentLStreak = 0;
    _forEach(data.allTrades, function (trade) {
      if (trade.RealizedPnL < 0) {
        currentLStreak++;
      } else {
        lossStreak = Math.max(lossStreak, currentLStreak);
        currentLStreak = 0;
      }
    });

    const losingStreak = Math.max(lossStreak, currentLStreak);

    return losingStreak;
  },

  averagePnL(data) {
    const totalPnL = _sumBy(data.allTrades, (trade) => {
      return trade.RealizedPnL;
    });

    const averagePnL = totalPnL / data.allTrades.length;

    return averagePnL;
  },

  bestPerformingDay(data) {
    const mappedOrdersWithPeriod = _map(data.winTrades, (trade) => {
      let _date = new Date(trade.OpenTradeAt);
      let timestamp = _date.getTime();

      const date = moment(timestamp * 1000).format("L");
      const dayNumber = moment(date).isoWeekday();
      const translationDayOfWeek = dayOfWeekTranslation[dayNumber];
      return {
        Pnl: trade.RealizedPnL,
        date,
        dayNumber,
        translationDayOfWeek,
      };
    });

    const ordersSorted = _map(
      _groupBy(mappedOrdersWithPeriod, function (obj) {
        return obj.dayNumber;
      }),
      (order, index) => ({ dayNumber: index, orders: order }),
    );
    const mappedOrdersSorted = _map(ordersSorted, (order) => {
      const totalPnL = _sumBy(order.orders, (order) => {
        let close_pnl = parseFloat(order.Pnl);
        if ((Math.round(close_pnl * 100) / 100).toFixed(2) === "0.00")
          close_pnl = 0;
        return close_pnl;
      });
      return {
        dayOfWeek: dayOfWeekTranslation[order.dayNumber],
        totalPnL: totalPnL,
      };
    });

    return _maxBy(mappedOrdersSorted, function (o) {
      return o.totalPnL;
    });
  },

  worstPerformingDay(data) {
    const mappedOrdersWithPeriod = _map(data.lossTrades, (trade) => {
      let _date = new Date(trade.OpenTradeAt);
      let timestamp = _date.getTime();

      const date = moment(timestamp * 1000).format("L");
      const dayNumber = moment(date).isoWeekday();
      const translationDayOfWeek = dayOfWeekTranslation[dayNumber];
      return {
        Pnl: trade.RealizedPnL,
        date,
        dayNumber,
        translationDayOfWeek,
      };
    });

    const ordersSorted = _map(
      _groupBy(mappedOrdersWithPeriod, function (obj) {
        return obj.dayNumber;
      }),
      (order, index) => ({ dayNumber: index, orders: order }),
    );
    const mappedOrdersSorted = _map(ordersSorted, (order) => {
      const totalPnL = _sumBy(order.orders, (order) => {
        let close_pnl = parseFloat(order.Pnl);
        if ((Math.round(close_pnl * 100) / 100).toFixed(2) === "0.00")
          close_pnl = 0;
        return close_pnl;
      });
      return {
        dayOfWeek: dayOfWeekTranslation[order.dayNumber],
        totalPnL: totalPnL,
      };
    });

    return _minBy(mappedOrdersSorted, function (o) {
      return o.totalPnL;
    });
  },

  totalBreakevenTrades(data) {
    const breakEvenEntries = _flatMap(data.allTrades, "Entries").filter(
      (entry) => entry.Status === entryStatusConstants.IS_BREAK_EVEN,
    );
    return breakEvenEntries.length;
  },

  averageTradeDuration(data) {
    const totalMintes = [];

    const tradesHasOpenAndCloseDates = _filter(
      data.allTrades,
      function (trade) {
        return !_isNil(trade.OpenTradeAt) && !_isNil(trade.CloseTradeAt);
      },
    );

    _forEach(tradesHasOpenAndCloseDates, function (trade) {
      const duration = moment.duration(
        moment(trade.CloseTradeAt).diff(moment(trade.OpenTradeAt)),
      );
      const minutes = duration.asMinutes();
      const item = { minutes, tradeId: trade.Id };
      totalMintes.push(item);
    });

    const totalMinutes = _sumBy(totalMintes, (t) => {
      return t.minutes;
    });

    let average = totalMinutes / tradesHasOpenAndCloseDates.length;
    const averageMilliseconds = average * 60 * 1000;

    if (averageMilliseconds > 172800000) {
      return humanizeDuration(averageMilliseconds, {
        round: true,
        units: ["d", "h"],
        language: "en",
      });
    } else {
      return humanizeDuration(averageMilliseconds, {
        round: true,
        units: ["h", "m"],
        language: "en",
      });
    }
  },

  averageWeeklyPerformance(data) {
    const groupedOrders = _groupBy(data.allTrades, (order) =>
      moment(order.CloseTradeAt).isoWeek(),
    );

    const results = _map(groupedOrders, (orders, weekNumber) => {
      const total = _sumBy(orders, "RealizedPnL");
      return { weekNumber, total };
    });

    const totalRealizedPnL = _sumBy(results, (weeklyPerformance) => {
      return weeklyPerformance.total;
    });

    const averageWeeklyPerformance = totalRealizedPnL / results.length;
    return averageWeeklyPerformance;
  },

  averageMonthlyPerformance(data) {
    const groupedOrders = _groupBy(data.allTrades, (order) =>
      moment(order.CloseTradeAt).month(),
    );

    const results = _map(groupedOrders, (orders, monthNumber) => {
      const total = _sumBy(orders, "RealizedPnL");
      return { monthNumber: parseInt(monthNumber) + 1, total };
    });

    const totalRealizedPnL = _sumBy(results, (monthlyPerformance) => {
      return monthlyPerformance.total;
    });

    const averageMonthlyPerformance = totalRealizedPnL / results.length;
    return averageMonthlyPerformance;
  },

  returnOfInvestment(data) {
    const totalPnL = _sumBy(data.allTrades, (trade) => {
      return trade.RealizedPnL;
    });

    const percentage = (totalPnL / data.startBalance) * 100;

    return {
      procent: `${Math.round((percentage + Number.EPSILON) * 100) / 100}%`,
      total: totalPnL,
    };
  },

  totalPaidFees(data) {
    const totalFees = _sumBy(data.allTrades, (t) => {
      return t.CommissionFees;
    });

    return totalFees;
  },

  bestPerformanceIntrument(data) {
    const ordersByInstrument = _groupBy(data.allTrades, "Symbol");

    const realizedPnLByInstrument = _map(
      ordersByInstrument,
      (orders, instrument) => {
        const total = _sumBy(orders, "RealizedPnL");
        return { total, instrument };
      },
    );

    const bestPerformanceIntrument = _maxBy(realizedPnLByInstrument, "total");

    if (
      _isEmpty(bestPerformanceIntrument) ||
      bestPerformanceIntrument.total < 0
    )
      return null;

    return bestPerformanceIntrument;
  },

  worstPerformanceIntrument(data) {
    const ordersByInstrument = _groupBy(data.allTrades, "Symbol");

    const realizedPnLByInstrument = _map(
      ordersByInstrument,
      (orders, instrument) => {
        const total = _sumBy(orders, "RealizedPnL");
        return { total, instrument };
      },
    );

    const worstPerformanceIntrument = _minBy(realizedPnLByInstrument, "total");

    if (
      _isEmpty(worstPerformanceIntrument) ||
      worstPerformanceIntrument.total > 0
    )
      return null;

    return worstPerformanceIntrument;
  },

  bestPerformanceOnOrderType(data) {
    const orderType1Total = _sumBy(
      _flatMap(data.allTrades, "Entries"),
      (entry) => {
        return entry.OrderType === 1 ? entry.RealizedPnL : 0;
      },
    );

    const orderType2Total = _sumBy(
      _flatMap(data.allTrades, "Entries"),
      (entry) => {
        return entry.OrderType === 2 ? entry.RealizedPnL : 0;
      },
    );

    const higherOrderType = orderType1Total > orderType2Total ? 1 : 2;

    return orderTypeTranslation[higherOrderType] + " order";
  },

  averageTradeSize(data) {
    return 0;
  },

  averageRiskRewardRatio(data) {
    const riskRewardRatios = _map(data.allTrades, (order) => {
      const riskReward = _sumBy(order.Entries, (entry) => {
        const { EntryPrice, TakeProfit, Stoploss } = entry;
        if (
          TakeProfit === 0 ||
          _isNil(TakeProfit) ||
          Stoploss === 0 ||
          _isNil(Stoploss)
        )
          return;
        const risk = Math.abs(Stoploss - EntryPrice);
        const reward = Math.abs(TakeProfit - EntryPrice);
        return reward / risk;
      });

      return riskReward / order.Entries.length;
    });

    const total = _sumBy(riskRewardRatios, (rr) => {
      return rr;
    });

    if (_isNil(total)) return null;

    const averageReward = total / riskRewardRatios.length;
    const reward = Math.round((averageReward + Number.EPSILON) * 10) / 10;

    if (_isNaN(reward)) return null;

    return { risk: 1, reward };
  },

  profitFactor(data) {
    const totalProfits = _sumBy(data.winTrades, (trade) => {
      return trade.RealizedPnL;
    });

    const totaLoss = Math.abs(
      _sumBy(data.lossTrades, (trade) => {
        return trade.RealizedPnL;
      }),
    );

    if (totalProfits <= 0 || totaLoss <= 0) return null;
    const profitFactor = totalProfits / totaLoss;
    return profitFactor.toFixed(2);
  },

  calculatePeakAndDrawdown(data, type) {
    let highestPeak = data.startBalance;
    let mostDrawdown = data.startBalance;
    let currentBalance = data.startBalance;
    const trades = _orderBy(data.allTrades, ["CreatedAt"], ["asc"]);

    for (const trade of trades) {
      currentBalance += trade.RealizedPnL;
      if (currentBalance > highestPeak) {
        highestPeak = currentBalance;
      }
      if (currentBalance < mostDrawdown) {
        mostDrawdown = currentBalance;
      }
    }

    return { type: type, total: type === 1 ? highestPeak : mostDrawdown };
  },

  tradeFrequencyWeekly(data) {
    const groupedByWeek = _groupBy(data.allTrades, (order) =>
      moment(order.CloseTradeAt).format("YYYY-WW"),
    );

    const result = _map(groupedByWeek, (orders, week) => ({
      week,
      trades: orders.length,
    }));

    const totalTaken = _sumBy(result, "trades");

    const frequencyWeek = totalTaken / result.length;

    return Math.round((frequencyWeek + Number.EPSILON) * 100) / 100;
  },

  tradeFrequencyMonthly(data) {
    // Group trades by month
    const groupedByMonth = _groupBy(data.allTrades, (order) =>
      moment(order.CloseTradeAt).month(),
    );

    // Convert the grouped data into the desired format
    const result = _map(groupedByMonth, (orders, monthNumber) => ({
      monthNumber: parseInt(monthNumber) + 1,
      trades: orders.length,
    }));

    // Calculate total trades
    const totalTaken = _sumBy(result, "trades");

    // Calculate frequency per month
    const frequencyMonth = totalTaken / result.length;

    return Math.round((frequencyMonth + Number.EPSILON) * 100) / 100;
  },

  averageRewardOnAccount(data) {
    const trades = _orderBy(data.allTrades, ["CreatedAt"], ["asc"]);
    let balance = data.startBalance;
    const profitList = [];

    _forEach(trades, function (trade) {
      if (trade.RealizedPnL > 0) {
        const procent = (trade.RealizedPnL / balance) * 100;
        profitList.push(procent);
      }

      balance += trade.RealizedPnL;
    });

    if (_isEmpty(profitList)) return null;

    const totalProcentProfit = Math.abs(
      _sumBy(profitList, (risk) => {
        return risk;
      }),
    );

    const procent = totalProcentProfit / profitList.length;

    return Math.round((procent + Number.EPSILON) * 10) / 10;
  },

  averageLossOnAccount(data) {
    const trades = _orderBy(data.allTrades, ["CreatedAt"], ["asc"]);
    let balance = data.startBalance;
    const riskList = [];

    _forEach(trades, function (trade) {
      if (trade.RealizedPnL < 0) {
        const procent = (trade.RealizedPnL / balance) * 100;
        riskList.push(procent);
      }

      balance += trade.RealizedPnL;
    });

    if (_isEmpty(riskList)) return null;

    const totalProcentRisk = Math.abs(
      _sumBy(riskList, (risk) => {
        return risk;
      }),
    );

    const procent = totalProcentRisk / riskList.length;

    return Math.round((procent + Number.EPSILON) * 10) / 10;
  },

  averageRating(data) {
    const totalRating = Math.abs(
      _sumBy(data.allTrades, (trade) => {
        return trade.Rating;
      }),
    );

    const averageRating = totalRating / data.allTrades.length;
    const rating = Math.round((averageRating + Number.EPSILON) * 10) / 10;
    return Math.round(rating * 10) / 10;
  },

  bestAverageOpenTradeTime(data) {
    const timePnLSorted = this.getTradesBetween30Minutes(data.allTrades);

    const max = _maxBy(timePnLSorted, (trade) => {
      const totalPnL = trade.Relation.reduce(
        (acc, rel) => acc + rel.PnL,
        trade.PnL,
      );
      return totalPnL;
    });

    if (_isNil(max)) return null;
    if (max.PnL < 0) return null;

    return moment(max.time, "HH:mm").format("HH:mm"); // return moment(max.time, 'HH:mm').format('h:mm A');
  },

  worstAverageOpenTradeTime(data) {
    const tradesWithTotals = this.getTradesBetween30Minutes(data.allTrades);

    const min = _minBy(tradesWithTotals, (trade) => {
      const totalPnL = trade.Relation.reduce(
        (acc, rel) => acc + rel.PnL,
        trade.PnL,
      );
      return totalPnL;
    });

    if (_isNil(min)) return null;
    if (min.PnL > 0) return null;

    return moment(min.time, "HH:mm").format("HH:mm"); // return moment(min.time, 'HH:mm').format('h:mm A');
  },

  getTradesBetween30Minutes(data) {
    const timeRegex = /(\d{2}):(\d{2}):(\d{2})/;
    const times = _map(data, (trade) => {
      const [, hours, minutes] = trade.OpenTradeAt.match(timeRegex);
      return { time: `${hours}:${minutes}`, PnL: trade.RealizedPnL };
    });

    const timePnLSorted = _map(times, (trade) => {
      const otherTrades = _filter(
        times,
        (otherTrade) =>
          trade !== otherTrade &&
          this.getMinutesBetweenTimes(trade.time, otherTrade.time) <= 30,
      );
      const relationPnLs = _map(otherTrades, "PnL");
      const relationTotalPnL = _sum(relationPnLs);
      const totalPnL = trade.PnL + relationTotalPnL;

      return {
        time: trade.time,
        PnL: trade.PnL,
        Relation: _map(otherTrades, (otherTrade) => ({
          time: otherTrade.time,
          PnL: otherTrade.PnL,
          totalPnL:
            otherTrade.PnL +
            _sum(
              _map(
                _filter(otherTrades, (t) => t !== otherTrade),
                "PnL",
              ),
            ),
        })),
        totalPnL: totalPnL,
      };
    });

    return timePnLSorted;
  },

  getMinutesBetweenTimes(time1, time2) {
    const [hour1, minute1] = time1.split(":");
    const [hour2, minute2] = time2.split(":");
    const time1Minutes = parseInt(hour1) * 60 + parseInt(minute1);
    const time2Minutes = parseInt(hour2) * 60 + parseInt(minute2);
    return Math.abs(time2Minutes - time1Minutes);
  },
};
