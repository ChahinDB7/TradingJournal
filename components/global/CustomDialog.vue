<template>
  <div
    class="modal-custom fade fadeIn background"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
    @click.self="closeEvent"
  >
    <div
      class="modal-dialog"
      role="document"
      :style="`${
        autoWidth.minWidth !== 'unset'
          ? 'min-width: ' +
            autoWidth.minWidth +
            '; max-width: ' +
            autoWidth.maxWidth +
            '; width: auto;'
          : 'width:' + dialogWidth + ';'
      }`"
      :class="{
        center: modalPostion === 'center',
        bottomLeft: modalPostion === 'bottomLeft',
        topCenter: modalPostion === 'topCenter',
      }"
    >
      <div
        class="modal-content"
        :class="{
          'is-dark-mode': darkMode,
          'big-shadow': bigShadow,
          'no-background': noBackground,
        }"
      >
        <div class="body">
          <slot name="body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "CustomDialog",

  props: {
    darkMode: {
      type: Boolean,
      required: true,
      default: false,
    },

    removeEventListenting: {
      type: Boolean,
      required: false,
      default: false,
    },

    noBackground: {
      type: Boolean,
      required: false,
      default: false,
    },

    blockBackgroundClick: {
      type: Boolean,
      required: false,
      default: false,
    },

    modalPostion: {
      type: String,
      required: false,
      default: "center",
    },

    autoWidth: {
      type: Object,
      required: false,
      default: () => {
        return {
          minWidth: "unset",
          maxWidth: "unset",
        };
      },
    },

    dialogWidth: {
      type: String,
      required: false,
      default: "800px",
    },

    bigShadow: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  mounted() {
    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    handleKeyDown(event) {
      if (this.removeEventListenting) return;

      if (event.key === "Escape") {
        this.close();
      }
    },
    close() {
      this.$emit("secondary-button");
    },
    closeEvent() {
      if (this.blockBackgroundClick) return;
      this.close();
    },
  },
};
</script>

<style lang="scss">
.fade:not(.show) {
  opacity: 1 !important;
}

.modal-custom {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 0;
  z-index: 550;
  -webkit-overflow-scrolling: touch;
  outline: 0;
}

.background {
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  width: auto !important;
}

.modal-dialog {
  height: fit-content;
  margin: auto !important;
  position: absolute !important;

  @media (min-width: 2000px) {
    zoom: 110%;
  }
}

.center {
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.bottomLeft {
  left: 0;
  bottom: 0;
  margin: 30px !important;
}

.topCenter {
  top: 50px;
  left: 0;
  right: 0;
}

.modal-content {
  border-radius: 20px !important;
  position: relative;
  background: #fff !important;
  background-clip: padding-box;
  outline: 0;
  padding: 30px;
  width: 100%;
  min-width: 355px;
  box-shadow: 0px 0px 3px 0px rgb(189 189 189);

  &.big-shadow {
    box-shadow: 0px 0px 10px 0px rgba(189, 189, 189, 1);
  }
  &.is-dark-mode {
    background-color: #131722 !important;
  }

  &.no-background {
    padding: 0 !important;
    box-shadow: none !important;
    background-color: transparent !important;
  }
}

@media (max-width: 700px) {
  .modal-dialog {
    width: 309px;
    height: 510px;
  }

  .title-modal {
    margin-bottom: 15px;
  }
}

.fade-in {
  animation-name: fade-in;
  animation-duration: 0.2s;
  animation-fill-mode: both;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.body {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.modal-header {
  min-height: 50px;
  padding: 0.4rem 1rem 1rem 1rem !important;
  border-bottom: 1px solid #dee2e6 !important;
  h3 {
    margin-bottom: 0 !important;
    font-size: 22px !important;
  }

  &.no-bottom-line {
    border-bottom: none !important;
  }

  &.no-header {
    display: flex;
    height: 0;
    min-height: 25px;
    border-bottom: 0 !important;
    padding: 0 16px !important;
    justify-content: flex-end;
  }
}

.modal-body {
  position: relative !important;
  padding: 1rem !important;

  &.no-padding {
    padding: 0 !important;
  }

  &.no-header {
    padding: 0px 16px 7px 16px !important;
  }
}

.modal-footer {
  gap: 10px;
  border: none;
  height: 40px;
  display: flex;
  flex-wrap: nowrap !important;
  padding: 16px !important;

  &.no-padding {
    padding: 0 !important;

    button {
      margin: 0 !important;
    }
  }
}

.modal-footer .button {
  display: block;
  height: 30px;
  font-size: 14px;
}

.header-image {
  height: 150px;
}

.title {
  color: #101828;
  font-weight: 700;
}

.text-body {
  margin-top: 10px;
  color: #101828;
  font-weight: 500;
}

.close-button {
  width: fit-content;
  align-self: self-end;
  background-color: transparent !important;
  border: none;
  font-size: 20px;
  color: black;
}

.close-button.is-dark-mode {
  color: white !important;
}

.secondary-button {
  min-width: 200px;
  margin-right: 10px !important;
}

.secondary-button.small {
  min-width: 125px !important;
}

@media (max-width: 700px) {
  .title-modal {
    font-size: 20px;
  }

  .text-modal {
    font-size: 14px;
  }

  .modal-footer {
    padding: 10px;
    height: 85px;
    flex-direction: column;
    justify-content: center;
  }

  button {
    width: 100% !important;
    padding: 6px 50px !important;
  }

  .secondary-button {
    margin-bottom: 15px !important;
    padding: 4px 30px !important;
  }
}

@media (min-width: 576px) {
  .modal-dialog {
    max-width: 100%;
  }
}
</style>
