<template>
  <div
    class="input-wrapper"
    :class="{ 'no-margin': noMargin, 'full-width': fullWidth }"
  >
    <div
      class="select no-select clickable"
      :class="{ small: small, 'is-dark-mode': darkMode }"
      @click.stop="showDateTimePicker = true"
    >
      <slot name="placeholder" />
      <div
        v-if="inBuildPlaceholder"
        class="label"
        :class="{ 'has-value': hasValue }"
      >
        <Icon name="calendar" :width="20" class="calendar" />

        <span v-if="!hasValue">
          {{ placeholder }}
        </span>
        <div v-else>
          <div>{{ convertDateLabel(date) }} {{ currentTime }}</div>
        </div>
      </div>
    </div>
    <CustomDialog
      v-show="showDateTimePicker"
      :dark-mode="darkMode"
      no-background
      dialog-width="fit-content"
      @secondary-button="showDateTimePicker = false"
    >
      <template #body>
        <div>
          <div class="datetime" :class="{ 'is-dark-mode': darkMode }">
            <div class="d-flex datetime-container">
              <div class="left">
                <ClientOnly>
                  <VDatePicker
                    v-model.string="date"
                    borderless
                    mode="date"
                    :is-dark="darkMode"
                    :masks="masks"
                    style="width: 100%"
                  />
                </ClientOnly>
                <div class="bottom">
                  <button type="button" class="button reset" @click="reset">
                    Reset
                  </button>
                  <button
                    type="button"
                    class="button reset"
                    @click="showDateTimePicker = false"
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    class="button reset"
                    @click="setCurrentTime(true)"
                  >
                    Now
                  </button>
                </div>
              </div>
              <div class="timepicker">
                <div class="top">
                  <input
                    v-model="edit.hour"
                    type="input"
                    :class="{ warning: edit.hourWarning }"
                    @input="enterHourMinute($event.target.value, 'hour')"
                  />
                  <div>:</div>
                  <input
                    v-model="edit.minute"
                    type="input"
                    :class="{ warning: edit.minuteWarning }"
                    @input="enterHourMinute($event.target.value, 'minute')"
                  />
                </div>
                <div class="time d-flex no-select">
                  <ul
                    id="hours-container"
                    ref="hoursContainer"
                    class="hours is-thumb"
                  >
                    <div class="before"></div>
                    <li
                      v-for="hour in hours"
                      :id="`item-${hour.value}`"
                      :key="hour.value"
                      class="clickable"
                      :class="{ active: hour.label === currentHour }"
                      @click="clickedTime(hour, true)"
                    >
                      {{ hour.label }}
                    </li>
                    <div class="after"></div>
                  </ul>
                  <ul
                    id="minutes-container"
                    ref="minutesContainer"
                    class="minutes is-thumb"
                  >
                    <div class="before"></div>
                    <li
                      v-for="minute in minutes"
                      :id="`item-${minute.value}`"
                      :key="minute.value"
                      class="clickable"
                      :class="{ active: minute.label === currentMinute }"
                      @click="clickedTime(minute, false)"
                    >
                      {{ minute.label }}
                    </li>
                    <div class="after"></div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomDialog>
  </div>
</template>

<script>
export default {
  name: "DateTimeSelector",
  props: {
    value: {
      type: String,
      required: false,
      default: "",
    },

    darkMode: {
      type: Boolean,
      required: true,
    },

    noMargin: {
      type: Boolean,
      required: false,
      default: false,
    },
    fullWidth: {
      type: Boolean,
      required: false,
      default: false,
    },

    inBuildPlaceholder: {
      type: Boolean,
      required: false,
      default: true,
    },

    placeholder: {
      type: String,
      required: true,
    },

    small: {
      type: Boolean,
      required: false,
      default: false,
    },
  },

  setup(props) {
    const { $moment } = useNuxtApp();

    const masks = ref({
      modelValue: "YYYY-MM-DD",
    });

    const date = ref(props.value);
    const currentHour = ref("");
    const currentMinute = ref("");
    const edit = ref({
      hour: "",
      minute: "",
      hourWarning: false,
      minuteWarning: false,
    });

    const setTime = () => {
      if (props.value === "") return;
      const parsedDatetime = $moment(props.value, "YYYY-MM-DD HH:mm");
      const _date = parsedDatetime.isValid()
        ? parsedDatetime.format("YYYY-MM-DD")
        : "";
      const _time = parsedDatetime.isValid()
        ? parsedDatetime.format("HH:mm")
        : "";

      date.value = _date;

      if (_time !== "") {
        const _hour = _time.split(":")[0];
        const _minute = _time.split(":")[1];
        currentHour.value = _hour;
        currentMinute.value = _minute;

        edit.value = {
          show: true,
          hour: _hour,
          minute: _minute,
          hourWarning: false,
          minuteWarning: false,
        };
      }
    };

    setTime();

    watch(
      () => props.value,
      (newValue, oldValue) => {
        if (newValue === oldValue) return;
        setTime();
      },
    );

    const hoursContainer = ref();
    const minutesContainer = ref();

    const hours = ref([]);
    const minutes = ref([]);

    for (let hour = 0; hour < 24; hour++) {
      const formattedHour = hour < 10 ? `0${hour}` : `${hour}`;
      hours.value.push({
        value: formattedHour,
        label: formattedHour,
      });
    }

    for (let minute = 0; minute < 60; minute++) {
      const formattedMinute = minute < 10 ? `0${minute}` : `${minute}`;
      minutes.value.push({
        value: formattedMinute,
        label: formattedMinute,
      });
    }

    return {
      date,
      masks,
      hours,
      minutes,
      currentHour,
      currentMinute,
      hoursContainer,
      minutesContainer,
      edit,
    };
  },

  data() {
    return {
      showDateTimePicker: false,
      clock: "24h",
      firstLoaded: false,
    };
  },

  computed: {
    currentTime() {
      return `${this.currentHour}:${this.currentMinute}`;
    },
    hasValue() {
      return this.date !== "" && this.date !== null;
    },
  },

  watch: {
    async showDateTimePicker(newValue, oldValue) {
      if (newValue === oldValue) return;
      await this.scrollToItem({
        item: this.currentHour,
        container: "hours",
        duration: 0,
        secondScrollProps: {
          item: this.currentMinute,
          container: "minutes",
          duration: 0,
        },
      });

      if (!newValue) {
        this.resetEdit();
      }
    },
    date(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.updateTime();
    },
    currentMinute(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.updateTime();
      this.edit.minute = newValue;
    },
    currentHour(newValue, oldValue) {
      if (newValue === oldValue) return;
      this.updateTime();
      this.edit.hour = newValue;
    },
  },
  mounted() {
    if (this.value === "") {
      this.setCurrentTime(false);
    }
  },
  methods: {
    updateTime() {
      let value = null;

      if (this.date === "") {
        value = "";
      } else {
        value = `${this.date} ${this.currentTime}`;
      }

      this.$emit("update:value", value);
      this.$emit("change", value);
    },

    convertDateLabel(date) {
      if (_isNil(date)) return "";
      const parsedDate = this.$moment(date);
      return parsedDate.format("DD-MM-YYYY");
    },

    clickedTime(value, hours = false) {
      if (hours) {
        this.currentHour = value.label;
        this.scrollToItem({ item: value.label, container: "hours" });
      } else {
        this.currentMinute = value.label;
        this.scrollToItem({ item: value.label, container: "minutes" });
      }
    },

    async setCurrentTime(scroll = false) {
      const now = this.$moment();
      this.currentHour = now.hour().toString();
      this.currentMinute = now.minute().toString();
      this.date = this.$moment().format("YYYY-MM-DD");

      this.edit.hour = this.currentHour;
      this.edit.minute = this.currentMinute;

      if (!scroll) return;

      await this.scrollToItem({
        item: this.currentHour,
        container: "hours",
        duration: 0,
        secondScrollProps: {
          item: this.currentMinute,
          container: "minutes",
          duration: 0,
        },
      });
    },

    enterHourMinute(value, type) {
      if (type === "hour") {
        const doesExist = !_isNil(
          _find(this.hours, function (o) {
            return o.label === value;
          }),
        );

        if (doesExist) {
          this.currentHour = value;
          this.edit.hourWarning = false;
          this.scrollToItem({ item: value, container: "hours" });
        } else {
          this.edit.hourWarning = true;
        }
      } else {
        const doesExist = !_isNil(
          _find(this.minutes, function (o) {
            return o.label === value;
          }),
        );

        if (doesExist) {
          this.currentMinute = value;
          this.edit.minuteWarning = false;
          this.scrollToItem({ item: value, container: "minutes" });
        } else {
          this.edit.minuteWarning = true;
        }
      }
    },

    async scrollToItem({
      item,
      container,
      duration = 200,
      secondScrollProps = null,
    }) {
      const options = {
        container: `#${container}-container`,
        easing: "ease-in",
        lazy: false,
        offset: -110,
        force: true,
        onStart: false,
        onDone: () => {
          if (secondScrollProps) {
            this.scrollToItem(secondScrollProps);
          }
          return;
        },
        onCancel: false,
        x: false,
        y: true,
      };

      await this.$scrollTo(`[id='item-${item}']`, duration, options);
    },

    reset() {
      this.date = null;
    },

    resetEdit() {
      this.edit = {
        mode: true,
        hour: this.currentHour,
        minute: this.currentMinute,
        hourWarning: false,
        minuteWarning: false,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.input-wrapper {
  &.full-width {
    .select {
      width: 100%;
    }
  }
}
.select {
  display: flex;
  position: relative;
  flex-direction: row !important;
  width: fit-content;
  padding: 0px 20px;
  font-size: 15px;
  align-items: center;
  min-width: 200px;
  height: 30px;
  position: relative;
  color: black;
  justify-content: space-between;
  border: 1px solid rgba(0, 0, 0, 0.1);
  gap: 15px;
  background-color: white;
  border: 1px solid #767676;
  color: black;

  &.small {
    height: 40px;
  }

  .label {
    display: flex;
    width: 100%;
    gap: 0.6rem;
    color: #767676;
    align-items: flex-end;
    &.has-value {
      color: black;
    }

    .icon-container.calendar {
      position: relative;
      top: -1px;
      color: white;
    }
  }

  &.is-dark-mode {
    background-color: #1e222d;
    border: 1px solid #767676;
    color: #fff;

    .label {
      &.has-value {
        color: white;
      }
    }
  }
}

.datetime {
  margin: 10px 10px 10px 10px;
}

.datetime {
  background-color: white;

  .datetime-container {
    justify-content: space-between;
    .timepicker {
      display: flex;
      flex-direction: column;
      .top {
        width: 100%;
        display: flex;
        height: 50px;
        font-size: 17px;
        justify-content: center;
        align-items: center;
        gap: 1.3rem;

        input {
          text-align: center;
          width: 40px;
          background-color: transparent;
          font-size: 18px;
          border-radius: 40px;
          border-color: transparent;

          &.warning {
            box-shadow: 0px 0px 0px 1px rgb(240, 0, 0) !important;
          }

          &:focus {
            outline: none;
          }
        }
      }

      .time {
        padding-top: 10px;
        gap: 5px;
        position: relative;
        .hours,
        .minutes {
          width: 80px;
          max-height: 245px;
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
            padding: 5px 0;
            text-align: center;

            &.active {
              border-radius: 5px;
              border: 2px solid black;
            }
          }

          &:hover {
            overflow-y: auto;

            &::-webkit-scrollbar {
              display: none; /* for Chrome, Safari and Opera */
            }
          }
        }
      }
    }

    .left {
      max-width: 400px;
      .bottom {
        padding: 0 20px 20px 20px;
        display: flex;
        gap: 1.3rem;
        justify-content: space-between;

        .button {
          width: 100px;
          border-radius: 30px;
          padding: 5px 0;
          background: transparent;
          color: black;
          border: 1px solid black;
        }
      }
    }
  }

  &.is-dark-mode {
    background-color: #1c1f28;

    .datetime-container {
      .timepicker {
        .top {
          input {
            color: white;
          }
        }

        .time {
          .hours,
          .minutes {
            li {
              &.active {
                border: 2px solid white;
              }
            }
          }
        }
      }

      .left {
        .bottom {
          .button {
            color: white;
            border: 1px solid white;
          }
        }
      }
    }
  }
}
</style>
