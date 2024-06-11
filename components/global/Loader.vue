<template>
  <div
    id="loader"
    :class="{
      big: type === 'big',
      small: type === 'small',
      'extra-small': type === 'extra-small',
      'mega-small': type === 'mega-small',
      icon: type === 'icon',
    }"
  >
    <svg
      class="image lds-rolling"
      :class="{ hide: !withImage }"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      style="background: none"
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        :style="{ stroke: loaderColor }"
        :stroke-width="strokeWidthInSVGFormat"
        r="35"
        stroke-dasharray="164.93361431346415 56.97787143782138"
        transform="rotate(122.679 50 50)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="linear"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          dur="1s"
          begin="0s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>

    <h2 class="title" :class="{ hide: !withMessage, 'is-dark-mode': darkMode }">
      {{ message }}
    </h2>
  </div>
</template>
<script>
export default {
  name: "Loader",
  props: {
    isLoading: {
      type: Boolean,
      default: true,
    },

    message: {
      type: String,
      default: "De data wordt geladen...",
    },

    type: {
      validator: (value) =>
        _includes(["big", "small", "extra-small", "mega-small", "icon"], value),
      type: String,
      default: "big",
    },

    timeout: {
      type: Number,
      default: 1,
    },

    onNextTick: {
      type: Boolean,
      default: false,
    },

    emitEvents: {
      type: Boolean,
      default: true,
    },

    withMessage: {
      type: Boolean,
      default: true,
    },

    withImage: {
      type: Boolean,
      default: true,
    },

    strokeWidth: {
      validator: (value) => _includes(["thick", "thin"], value),
      type: String,
      default: "thin",
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    size: {
      type: String,
      default: "Normal",
    },
  },

  data() {
    return {
      events: {
        init: {
          name: "init",
        },

        finish: {
          name: "finished",
        },
      },
    };
  },

  computed: {
    loaderColor() {
      return !this.darkMode ? "#000000" : "#FFFFFF";
    },
    strokeWidthInSVGFormat() {
      if (this.strokeWidth === "thick") {
        return "10";
      }

      return "4";
    },
  },

  watch: {
    isLoading(newValue) {
      if (!newValue) {
        this.finish();
      }
    },
  },

  created() {
    this.emit(this.events.init);
  },

  unmounted() {
    this.emit(this.events.finish);
  },

  methods: {
    emit(event, args) {
      if (event.name) {
        this.$emit(event.name, args);
      }

      if (typeof event.callback === "function") {
        event.callback();
      }
    },

    finish() {
      const self = this;

      setTimeout(() => {
        if (self.onNextTick) {
          this.$parent.$nextTick(() => {
            self.emit(self.events.finish);
          });
        } else {
          self.emit(self.events.finish);
        }
      }, self.timeout);
    },
  },
};
</script>

<style scoped lang="css">
#loader {
  height: 100%;
  width: 100%;
  margin: 0 auto;
}

#loader.big {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
}

#loader.big .title {
  font-size: 1em !important;
  margin: 1em;
}

#loader.big .title.hide {
  display: none;
}

#loader.big .image {
  max-width: 200px;
  margin: 0.5em;
}

#loader.big .image.hide {
  display: none;
}

#loader.small,
#loader.extra-small,
#loader.mega-small {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  max-width: 400px;
}

#loader.small .title,
#loader.extra-small .title,
#loader.mega-small .title {
  font-size: 1.2em !important;
  margin: 1em;
}

#loader.small .image {
  width: 55px;
}

#loader.extra-small .image {
  width: 30px;
}

#loader.mega-small .image {
  width: 15px;
}

#loader.icon {
  display: inline-block;
  width: auto;
}

#loader.icon .title {
  display: none;
}

#loader.icon .image {
  display: inline-block;
  width: 30px;
}

.title.is-dark-mode {
  color: white !important;
}

.title.hide {
  display: none;
}
</style>
