<script>
export default {
  name: "FileViewer",

  props: {
    viewer: {
      type: Object,
      required: true,
    },

    images: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const sourceImageObjects = ref([]);

    function loadImages() {
      sourceImageObjects.value = _map(props.images, (image, index) => {
        return {
          "data-source": image,
          src: image,
          alt: `Image: ${index + 1}`,
        };
      });
    }

    watch(
      () => props.images,
      (newValue, oldValue) => {
        if (newValue === oldValue) return;
        loadImages();
      },
    );

    loadImages();

    return {
      sourceImageObjects,
    };
  },
  watch: {
    "viewer.visibleViewer": {
      handler(newValue, oldValue) {
        if (newValue !== oldValue && newValue) {
          this.$viewerApi({
            options: {
              toolbar: true,
              url: "data-source",
              initialViewIndex: this.viewer.fileIndex,
            },
            images: this.sourceImageObjects,
          });
          this.$emit("has-showed-viewer");
        }
      },
    },
  },
};
</script>
<template>
  <div />
</template>
