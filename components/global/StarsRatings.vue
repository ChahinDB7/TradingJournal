<template>
  <div class="rating">
    <StarRating
      :rating="rating"
      :read-only="readOnly"
      :star-size="starSize"
      :increment="increment"
      :show-rating="false"
      :animate="true"
      @update:rating="setRating"
    />
  </div>
</template>

<script>
export default {
  name: "StarRatings",

  props: {
    value: {
      type: Number,
      required: true,
    },

    increment: {
      type: Number,
      required: false,
      default: 0.5,
    },

    starSize: {
      type: Number,
      required: false,
      default: 25,
    },

    readOnly: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  data() {
    return {
      rating: this.value,
    };
  },

  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.rating = newValue;
      }
    },
  },

  methods: {
    setRating(rating) {
      this.$emit("update:value", rating);
    },
  },
};
</script>

<style lang="scss" scoped>
.rating {
  width: fit-content;
}
</style>
