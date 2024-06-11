<template>
  <div
    ref="dropbox"
    :class="{
      'file-drop-box': canDropFile && dropBox,
      'is-dragging-file-background': isDraggingFile,
      'is-dark-mode': darkMode,
    }"
    @drop="dragFile"
    @dragover.prevent="dragOver"
    @drop.prevent="dragStop"
    @dragleave.prevent="dragStop"
  >
    <input
      ref="filePicker"
      type="file"
      class="hidden"
      :accept="allowedExtensions"
      @change="checkFile($event.target.files[0])"
    />
    <div>
      <div
        v-if="!isDraggingFile"
        class="align"
        :class="{
          'remove-width': !canDropFile,
          'has-link-button': canAttachLink,
        }"
      >
        <button
          type="button"
          class="button add-padding"
          :class="{ 'is-dark-mode': darkMode }"
          @click="focusUploader"
        >
          {{ uploadText }}
        </button>
        <button
          v-if="canAttachLink"
          type="button"
          class="button add-padding"
          :class="{ 'is-dark-mode': darkMode }"
        >
          Attach link
        </button>
        <button
          v-if="canUploadClipboard"
          type="button"
          class="button add-padding"
          :class="{ 'is-dark-mode': darkMode }"
          @click="fromClipboard"
        >
          From clipboard
        </button>
      </div>
      <div v-else class="align" />
    </div>
  </div>
</template>

<script>
export default {
  name: "DragDropFiles",

  props: {
    id: {
      type: String,
      required: false,
      default: "upload-multiple-files",
    },

    canDropFile: {
      type: Boolean,
      required: false,
      default: false,
    },

    onlySingleFileUpload: {
      type: Boolean,
      required: false,
      default: false,
    },

    dropBox: {
      type: Boolean,
      required: false,
      default: false,
    },

    canAttachLink: {
      type: Boolean,
      required: false,
      default: false,
    },

    canUploadClipboard: {
      type: Boolean,
      required: false,
      default: false,
    },

    darkMode: {
      type: Boolean,
      required: false,
      default: true,
    },

    allowedExtensions: {
      type: Array,
      required: false,
      default: () => [".png", ".jpg", ".jpeg"],
    },
  },

  data() {
    return {
      isDraggingFile: false,
    };
  },

  computed: {
    uploadText() {
      let appendText = "";
      if (!this.onlySingleFileUpload) {
        appendText += "s";
      }

      if (this.canDropFile) {
        return "Upload" + appendText;
      }

      return "Upload" + appendText;
    },
  },

  mounted() {
    if (this.canDropFile) {
      document.addEventListener("paste", this.retrieveImageFromClipboardAsBlob);
    }
  },

  beforeUnmount() {
    document.removeEventListener(
      "paste",
      this.retrieveImageFromClipboardAsBlob,
    );
  },

  methods: {
    async retrieveImageFromClipboardAsBlob(pasteEvent, callback) {
      if (!pasteEvent.clipboardData) {
        if (typeof callback === "function") {
          this.$noty.error("No image found in clipboard!");
          callback(undefined);
        }
      }

      const items = pasteEvent.clipboardData.items;

      if (!items) {
        if (typeof callback === "function") {
          this.$noty.error("No image found in clipboard!");
          callback(undefined);
        }
      }

      let hasFoundImage = false;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") === -1) continue;
        const blob = items[i].getAsFile();

        if (typeof callback === "function") {
          this.$noty.error("No image found in clipboard!");
          callback(blob);
        }

        const type = items[i].type;
        const [mime, subtype] = type.split("/");

        const base64data = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });

        if (base64data == null || hasFoundImage) continue;

        if (!this.allowedExtensions.includes(`.${subtype}`)) {
          this.$noty.error("Image type is not allowed!");
          continue;
        }

        this.$emit("upload", {
          Base64: base64data,
          FileExtension: subtype,
          MediaType: mime,
          FileName: `file.${subtype}`,
        });
        hasFoundImage = true;
      }

      if (!hasFoundImage) {
        this.$noty.error("No image found in clipboard!");
      }
    },
    uploadFile(event) {
      _forEach(event.target.files, (file) => {
        this.checkFile(file);
      });
    },

    dragFile(e) {
      if (this.canDropFile) {
        const files = e.dataTransfer.files;

        _forEach(files, (file) => {
          this.checkFile(file);
        });

        e.dataTransfer.clearData();
      }
    },

    focusUploader() {
      this.$refs.filePicker.click();
    },

    dragOver() {
      if (this.canDropFile) {
        this.isDraggingFile = true;
      }
    },

    dragStop() {
      if (this.canDropFile) {
        this.isDraggingFile = false;
      }
    },

    async fromClipboard() {
      try {
        const clipboardItems = await navigator.clipboard.read();

        for (const clipboardItem of clipboardItems) {
          for (const type of clipboardItem.types) {
            if (type.startsWith("image/")) {
              const [mime, subtype] = type.split("/");

              const blob = await clipboardItem.getType(type);
              if (!this.allowedExtensions.includes(`.${subtype}`)) {
                this.$noty.error("File type is not allowed!");
                return;
              }
              const base64data = await blob
                .arrayBuffer()
                .then((buffer) =>
                  btoa(
                    new Uint8Array(buffer).reduce(
                      (data, byte) => data + String.fromCharCode(byte),
                      "",
                    ),
                  ),
                );
              const base64Image = `data:${blob.type};base64,${base64data}`;
              this.$emit("upload", {
                Base64: base64Image,
                FileExtension: subtype,
                MediaType: mime,
                FileName: `file.${subtype}`,
              });
              return;
            }
          }
        }
        this.$noty.error("No image found in clipboard!");
      } catch (_) {
        this.$noty.error("No image found in clipboard!");
      }
    },

    checkFile(file) {
      this.$refs.filePicker.value = null;

      const mediaType = file.type.split("/")[0];
      const fileExtension = file.type.split("/")[1];
      const maxFileSize = 50;
      let isSupported = false;
      if (mediaType === "image") {
        isSupported = true;
      } else if (mediaType === "video") {
        isSupported = false;
      } else if (mediaType === "application") {
        isSupported = true;
      }

      if (isSupported) {
        const filesize = (file.size / 1024 / 1024).toFixed(4); // Filesize is returned in MB.
        if (filesize < maxFileSize) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            const base64Image = reader.result;
            const FileName = file.name;
            const FileExtension = FileName.split(".").pop();

            if (!this.allowedExtensions.includes(`.${FileExtension}`)) {
              this.$noty.error("File type is not allowed!");
              return;
            }
            this.$emit("upload", {
              Base64: base64Image,
              FileExtension,
              MediaType: mediaType,
              FileName,
            });
          };
        } else {
          this.$noty.error(
            `This file is ${_round(
              filesize,
              1,
            )}MB. Maximum file size of this type is ${maxFileSize}MB.`,
          );
        }
      } else {
        this.$noty.error(
          `This media type ".${fileExtension}" is not supported.`,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.file-drop-box {
  border: 1px dashed #eaecf7;
  border-radius: 15px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.is-dragging-file-background {
  border: 3px dashed black;
  width: 100%;
  display: flex;
  align-items: center;
  height: 75px;
  justify-content: center;
  &.is-dark-mode {
    border: 3px dashed white;
  }
}

.file-drop-box > div > .align {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.align.has-link-button {
  display: flex;
  gap: 8px;
}

.remove-width {
  width: auto;
}

.align {
  display: flex;
  gap: 14px;
  justify-content: center;
}

.button {
  border-radius: 10px;
  padding: 3px 20px;
}
</style>
