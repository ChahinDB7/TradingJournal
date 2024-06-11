<template>
  <div class="datetime-container d-flex">
    <ClientOnly>
      <!-- <VueCtkDateTimePicker
        v-model="date"
        :dark="true"
        :inline="true"
        :only-date="true"
        format="YYYY-MM-DD"
        formatted="YYYY-MM-DD"
        output-format="YYYY-MM-DD"
        class="date-time-picker"
      /> -->
    </ClientOnly>
    <div class="datetime">
      <div class="top">
        <div class="time-label">{{ currentTime }}</div>
      </div>
      <div class="time d-flex no-select">
        <ul id="hours-container" class="hours is-thumb">
          <div class="before"></div>
          <li
            v-for="hour in hours"
            :id="`item-${hour.value}`"
            :key="hour.value"
            class="clickable"
            :class="{ active: hour.label === currentHour }"
            @click="currentHour = hour.label"
          >
            {{ hour.label }}
          </li>
          <div class="after"></div>
        </ul>
        <ul id="minutes-container" class="minutes is-thumb">
          <div class="before"></div>
          <li
            v-for="minute in minutes"
            :id="`item-${minute.value}`"
            :key="minute.value"
            class="clickable"
            :class="{ active: minute.label === currentMinute }"
            @click="currentMinute = minute.label"
          >
            {{ minute.label }}
          </li>
          <div class="after"></div>
        </ul>
      </div>
      <div class="bottom"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "DateTimePicker",
  setup() {
    const date = ref("2023-12-04 15:26");
    return { date };
  },
  data() {
    return {
      minutes: [],
      hours: [],
      currentHour: "",
      currentMinute: "",
    };
  },
  computed: {
    currentTime() {
      return `${this.currentHour}:${this.currentMinute}`;
    },
  },
  watch: {
    currentHour(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.scrollToItem(newValue, "hours");
    },
    currentMinute(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.scrollToItem(newValue, "minutes");
    },
  },
  created() {
    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      this.hours.push({
        value: formattedHour,
        label: formattedHour,
      });
    }

    for (let minute = 0; minute < 60; minute++) {
      const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
      this.minutes.push({
        value: formattedMinute,
        label: formattedMinute,
      });
    }
  },
  mounted() {
    this.currentHour = "15";
    setTimeout(() => {
      this.currentMinute = "26";
    }, 200);
  },
  methods: {
    scrollToItem(item, container, duration = 200) {
      const options = {
        container: `#${container}-container`,
        easing: "ease-in",
        lazy: false,
        offset: -125,
        force: true,
        onStart: false,
        onDone: false,
        onCancel: false,
        x: false,
        y: true,
      };

      this.$scrollTo(`[id='item-${item}']`, duration, options);
    },
  },
};
</script>
<style lang="scss" scoped>
.datetime-container {
  .datetime {
    display: flex;
    flex-direction: column;
    .top {
      background-color: dodgerblue;
      width: 100%;
      display: flex;
      height: 57px;
      align-items: flex-end;
      padding: 0 0 10px 10px;
      font-size: 17px;
    }

    .bottom {
      background-color: #424242;
      width: 100%;
      border: 1px solid #424242;
      border-top: 1px solid #757575;

      height: 41px;
    }
    .time {
      background-color: #424242;
      padding-top: 10px;
      gap: 5px;
      position: relative;
      .hours,
      .minutes {
        width: 60px;
        max-height: 281px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding: 0;
        list-style: none;
        overscroll-behavior: contain;
        scrollbar-width: thin; /* For Firefox */
        scrollbar-color: transparent transparent; /* For Firefox */

        &::-webkit-scrollbar {
          width: 6px; /* For Chrome, Safari, and Opera */
        }

        &::-webkit-scrollbar-thumb {
          background-color: transparent; /* For Chrome, Safari, and Opera */
        }

        .before,
        .after {
          min-height: 120px;
        }

        li {
          font-size: 18px;
          padding: 5px 10px 5px 20px;
          &.active {
            background-color: dodgerblue;
            color: white;
            border-radius: 5px;
          }
        }

        &:hover {
          overflow-y: auto;

          &::-webkit-scrollbar {
            display: none; /* for Chrome, Safari and Opera */
          }

          li {
            &.active {
            }
          }
        }
      }
    }
  }
}
</style>
