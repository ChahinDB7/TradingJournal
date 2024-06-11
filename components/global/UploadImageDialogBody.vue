<template>
  <div class="config-body">
    <div class="modal-header">
      <h3 class="title-modal">Upload a image</h3>
      <button type="button" class="close-button">
        <Icon large name="cross" @click="closeModal" />
      </button>
    </div>
    <div class="modal-body">
      <template v-if="!isLoading">
        <div v-if="!canUpload" class="upload-container">
          <p style="font-size: 14px !important">
            You can upload an image file by either dragging and dropping it,
            selecting it from your computer, retrieving it from your clipboard,
            or pasting it into the window.
          </p>
          <DragDropFiles
            can-upload-clipboard
            can-drop-file
            only-single-file-upload
            drop-box
            :dark-mode="darkMode"
            @upload="filesChanged"
          />
        </div>
        <div v-else class="image-container">
          <img
            :src="uploadImage.data.Base64"
            @click="viewer.visibleViewer = !viewer.visibleViewer"
          />
          <div
            class="remove-button"
            :class="{ 'is-dark-mode': darkMode }"
            @click="uploadImage = {}"
          >
            <Icon
              name="trash"
              :width="20"
              :height="20"
              current-color
              clickable
            />
          </div>
        </div>
      </template>
      <Loader v-else :dark-mode="darkMode" :message="'Uploading...'" />
    </div>
    <div
      v-if="!isLoading"
      :class="{ 'is-dark-mode': darkMode }"
      style="padding: 1rem !important"
      class="modal-footer no-padding"
    >
      <button
        class="secondary-button button"
        style="min-width: 150px"
        type="button"
        @click="closeModal"
      >
        Exit
      </button>
      <button
        class="primary-button button"
        style="width: 100%"
        type="button"
        :disabled="!canUpload"
        @click="upload"
      >
        Upload
      </button>
    </div>
    <FileViewer
      ref="viewer"
      :viewer="viewer"
      :images="imageFiles"
      @has-showed-viewer="viewer.visibleViewer = !viewer.visibleViewer"
    />
  </div>
</template>

<script>
export default {
  name: "UploadImageDialogBody",

  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },

    showLoaderOnUpload: {
      type: Boolean,
      required: false,
      default: true,
    },

    journal: {
      type: Object,
      required: false,
      default: null,
    },

    currentTradeId: {
      type: String,
      required: false,
      default: "",
    },
  },

  data() {
    return {
      isLoading: false,
      uploadImage: {},
      viewer: { visibleViewer: false, fileIndex: 0 },
    };
  },

  computed: {
    canUpload() {
      return !_isEmpty(this.uploadImage);
    },

    imageFiles() {
      if (!this.canUpload) return [];

      return [this.uploadImage.data.Base64];
    },
  },

  watch: {
    journal: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        this.closeModal();
      },
    },
  },

  mounted() {},

  methods: {
    upload() {
      if (this.showLoaderOnUpload) this.isLoading = true;
      this.$emit("primary-button", this.uploadImage);
    },

    filesChanged({ Base64, FileExtension, MediaType, FileName }) {
      this.uploadImage = {
        tradeId: this.currentTradeId,
        data: { Base64, FileExtension, MediaType, FileName },
        type: 1,
      };
    },

    closeModal() {
      this.isLoading = false;
      this.$emit("clear-current-id");
      this.$emit("secondary-button");
    },
  },
};
</script>

<style lang="scss" scoped>
.image-container {
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 400px;
    overflow-y: auto;
    cursor: pointer;
    padding-top: 10px;
  }

  .remove-button {
    position: absolute;
    top: 0;
    right: 0;
    border: 1px solid #808080;
    background-color: #e9e9e9;
    border-radius: 20px;
    display: flex;
    z-index: 52455;
    width: 40px;
    height: 40px;
    margin: 10px 6px 0 0;
    cursor: pointer;
    align-items: center;
    font-size: 16px;
    justify-content: center;

    &.is-dark-mode {
      background-color: #121212;
    }
  }
}

.button {
  border-radius: 10px;
  padding: 3px 20px;
}
</style>
