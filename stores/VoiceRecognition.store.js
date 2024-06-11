import { defineStore, acceptHMRUpdate } from "pinia";
let rec;

function listenValue(r, keyword) {
  if (r.includes("clear")) return "Clear";
  else if (keyword === "Side") {
    r = r.toLowerCase();
    if (
      (r.includes("buy") || r.includes("bye") || r.includes("by")) &&
      !r.includes("sell")
    )
      return "Buy";
    else if (
      (r.includes("sell") || r.includes("so") || r.includes("cell")) &&
      !r.includes("buy")
    )
      return "Sell";
    else return "";
  } else if (keyword === "Use slider") {
    r = r.toLowerCase();
    if (r.includes("on")) return "ON";
    else if (r.includes("off") || r.includes("of")) return "OFF";
    else return "";
  } else {
    let numbers = r.match(/\d/g);
    if (!_isNil(numbers)) {
      numbers = numbers.join("");
      return numbers;
    } else {
      return "";
    }
  }
}

function listenKeyWords(r, tradingMode) {
  r = r.toLowerCase();

  if (!tradingMode) {
    if (r.includes("invested") || r.includes("money")) return "Invested money";
    else if (r.includes("buy")) return "Buy price";
    else if (r.includes("sell")) return "Sell price";
    else if (r.includes("total") || r.includes("shares")) return "Total shares";
  } else if (r.includes("limit") || r.includes("market")) return "Order";
  else if (r.includes("balance") || r.includes("account"))
    return "Account balance";
  else if (r.includes("entry") || r.includes("price") || r.includes("nc"))
    return "Entry price";
  else if (r.includes("take") || r.includes("profit")) return "Take profit";
  else if (r.includes("stop") || r.includes("loss") || r.includes("plus"))
    return "Stop-loss";
  else if (r.includes("trade") || r.includes("size")) return "Trade quantity";
  else if (r.includes("leverage") || r.includes("level")) return "Leverage";
  else if (
    r.includes("side") ||
    r.includes("direction") ||
    r.includes("site") ||
    r.includes("set") ||
    r.includes("south") ||
    r.includes("sad") ||
    r.includes("buy") ||
    r.includes("sell")
  )
    return "Side";
  else if (r.includes("use") || r.includes("slider")) return "Use slider";

  return "";
}

export const VoiceRecognitionStore = defineStore({
  id: "voiceRecognitionStore",
  autoSetters: true,
  state: () => ({
    voiceKeyWord: "",
    voiceValue: "",
    hasVoiceRecognition: false,
    keyWordManually: false,
  }),
  getters: {},
  actions: {
    startVoiceRecognition(tradingMode) {
      if (
        "webkitSpeechRecognition" in window ||
        "webkitSpeechRecognition" in window ||
        "mozSpeechRecognition" in window ||
        "msSpeechRecognition" in window
      ) {
        this.hasVoiceRecognition = true;
        rec = new (window.SpeechRecognition ||
          window.webkitSpeechRecognition ||
          window.mozSpeechRecognition ||
          window.msSpeechRecognition)();
        rec.lang = "en-US";
        rec.continuous = true;
        rec.interimResults = true;
        rec.start();
        rec.onresult = (e) => {
          const resultJSON = e; // full JSON of callback event
          const resultValue = e.returnValue; // was successful?
          const resultString =
            e.results[e.results.length - 1][0].transcript.trim();
          const resultConfidence =
            e.results[e.results.length - 1][0].confidence;

          if (this.voiceKeyWord === "" || _isNil(this.voiceKeyWord)) {
            const keyWord = listenKeyWords(resultString, tradingMode);
            this.voiceKeyWord = keyWord;
            this.keyWordManually = false;
            this.voiceValue = "";
          } else {
            const value = listenValue(resultString, this.voiceKeyWord);
            if (value === "Clear") {
              this.voiceKeyWord = "";
              this.voiceValue = "";
              return;
            }

            this.voiceValue = value;
            if (this.voiceKeyWord && value !== "") {
              const seconds = !this.keyWordManually ? 2000 : 500;
              setTimeout(() => {
                this.voiceKeyWord = "";
                this.voiceValue = "";
              }, seconds);
            }
          }
        };
      } else {
        this.hasVoiceRecognition = false;
        rec = {};
      }
    },

    stopVoiceRecognition() {
      if ("webkitSpeechRecognition" in window && !_isNil(rec)) {
        rec.stop();
        rec = null;
        this.voiceKeyWord = "";
        this.voiceValue = "";
      }
    },

    setKeyWord(payload) {
      this.voiceKeyWord = payload.keyword;
      this.keyWordManually = payload.manually;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(VoiceRecognitionStore, import.meta.hot),
  );
}
