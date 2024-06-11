<template>
  <ClientOnly>
    <VueDatePicker
      v-model="date"
      :dark="darkMode"
      :enable-time-picker="false"
      :style="{ width }"
      @date-update="submit"
    />
  </ClientOnly>
</template>
<script>
import moment from "moment";

export default {
  name: "Datepicker",
  props: {
    darkMode: {
      type: Boolean,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "100%",
    },
  },
  data() {
    return {
      date: this.value,
    };
  },
  watch: {
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        // this.date = newValue;
      }
    },
    date(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (_isNil(newValue)) {
          this.$emit("update:value", "");
          return;
        }
        const parsedDate = moment(newValue, "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
        const formattedDate = parsedDate.format("YYYY-MM-DDTHH:mm:ss.SSSZ");

        this.$emit("update:value", formattedDate);
      }
    },
  },
  methods: {
    submit() {
    },
  },
};
</script>
