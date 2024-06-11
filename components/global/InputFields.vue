<template>
  <component
    :is="container"
    :class="[
      classList,
      fieldClassList,
      {
        'is-create-trade-modal': createTradeModal,
        'different-width': selectedCheckboxes.tradingMode && !isRightColumn,
        'larger-different-width': selectedCheckboxes.tradingMode && isLarge,
        'invincible-container': field.invincible,
      },
    ]"
    class="form-fields"
    @submit.prevent="submitPressed"
  >
    <div
      :class="{
        'crypto-mode':
          (showSelectCurrency && field.key === 'buyPrice') ||
          field.key === 'entryPrice',
        'align-middle':
          field.hasRadioButtons || field.helpButton || alwaysAlignMiddleStart,
        'flex-start': field.helpButton || alwaysAlignMiddleStart,
      }"
    >
      <label
        v-if="field.showLabel && field.isForex"
        class="no-select"
        :for="keyField"
      >
        {{ field.typesMode[field.typeModeSelected].text }}:
      </label>
      <label v-else-if="field.showLabel" class="no-select" :for="keyField">
        {{ field.label }}</label
      >
      <div
        v-if="field.helpButton"
        @mouseover="showMenu = true"
        @mouseleave="showMenu = false"
      >
        <div
          v-if="showMenu"
          :class="{ 'is-dark-mode': darkMode }"
          class="pop-up-block"
          :style="{
            width: field.stylePopUp.width,
            height: field.stylePopUp.height,
            'margin-top': field.stylePopUp.marginTop,
            'margin-left': field.stylePopUp.marginLeft,
            'font-size': field.stylePopUp.fontSize,
          }"
        >
          <span>
            {{ field.helpButtonText }}
            <span
              v-if="field.key === 'contractSize'"
              style="
                text-decoration: underline;
                cursor: pointer;
                font-size: 12px;
              "
              @click="viewer.visibleViewer = !viewer.visibleViewer"
              >See how you can check this.</span
            >
          </span>
        </div>
        <div
          v-if="showMenu"
          class="invincible-block"
          :style="{
            width: field.stylePopUp.invincibleWidth,
            height: field.stylePopUp.invincibleHeight,
            'margin-top': field.stylePopUp.invincibleMarginTop,
            'margin-left': field.stylePopUp.invincibleMarginLeft,
          }"
        />
        <Icon name="help" clickable @click="$emit('help-button', keyField)" />
      </div>
      <div v-if="field.isForex" class="type-mode">
        <div
          v-for="radio in field.typesMode"
          :key="radio.text"
          class="option no-select"
        >
          <input
            :id="radio.text"
            v-model="field.typeModeSelected"
            type="radio"
            :value="radio.text"
            style="margin-right: 10px"
          />
          <label :for="radio.text">{{ radio.text }}</label>
        </div>
      </div>
      <div
        v-if="field.refreshButton && showSelectCurrency"
        class="refresh-button"
      >
        <Icon
          v-if="!windowStore.windowOptions['loadingAPI']"
          name="refresh"
          :height="20"
          :width="20"
          clickable
          @click="$emit('refresh')"
        />
        <Loader
          v-else
          :dark-mode="darkMode"
          message=""
          type="extra-small"
          :with-message="false"
        />
      </div>
      <div
        v-if="forexMode && field.labelCheckbox"
        class="checkbox-button checkbox-item"
      >
        <ui-checkbox
          v-model="labelCheckboxValue"
          :input-id="field.labelCheckbox.id"
          style="margin-right: 5px"
          class="extra-mini"
          @change="labelCheckboxPress($event)"
        />
        <label class="no-select clickable" :for="field.labelCheckbox.id">{{
          field.labelCheckbox.label
        }}</label>
      </div>
    </div>
    <div
      v-if="field.field === 'input'"
      class="input-container"
      :class="{
        'has-button-container': field.hasButton || field.type === 'password',
        'extra-height': field.showMultipleEntry,
      }"
    >
      <div v-if="showSelectCurrency">
        <SelectCryptoCurrency
          v-if="cryptoMode"
          :dark-mode="darkMode"
          :user-settings="userSettings"
          @selected-item="selectedItem"
        />
        <SelectForexCurrency
          v-else-if="forexMode"
          :dark-mode="darkMode"
          :user-settings="userSettings"
          @selected-item="selectedItem"
        />
      </div>
      <div
        v-if="hasPrefix || field.hasPrefix"
        class="prefix-text no-select"
        :class="{
          'is-dark-mode': darkMode,
          'has-select': showSelectCurrency,
        }"
      >
        {{ field.prefixText }}
      </div>
      <div
        v-if="field.hasSuffix"
        class="suffix-text no-select"
        :class="{
          'is-dark-mode': darkMode,
          'has-select': showSelectCurrency,
        }"
      >
        {{ field.suffixText }}
      </div>
      <input
        v-if="fixedWidth === ''"
        :id="keyField"
        :ref="keyField"
        v-model="formattedValue"
        :type="getInputType"
        :readonly="field.readOnly"
        :disabled="field.disabled"
        autocomplete="off"
        class="padding"
        :class="[
          inputClasses,
          {
            'no-border': noBorder,
            'input-with-suffix': field.hasSuffix,
            'is-larger-suffix': field.hasSuffix && field.suffixText.length >= 3,
            'input-with-prefix': hasPrefix || field.hasPrefix,
            'is-larger-prefix':
              (hasPrefix || field.hasPrefix) && field.prefixText.length >= 3,
            readonly:
              field.readOnly &&
              field.key !== 'buyPrice' &&
              field.key !== 'entryPrice' &&
              showSelectCurrency,
            'is-password': field.type === 'password',
            fullWidth: !selectedCheckboxes.tradingMode,
            smallWidth: isSmallWidth(),
            'full-width-with-button': !isSmallWidth() && field.hasButton,
            'no-width-specify': field.noWidthSpecify,
            'warning-input': isWarning,
            'is-right-column-input': isRightColumn,
            'avg-button-none': field.hasButton && compoundVisible,
            'entry-price-with-crypto':
              selectedCheckboxes.tradingMode &&
              field.key === 'entryPrice' &&
              showSelectCurrency,
            'larger-small-width':
              selectedCheckboxes.tradingMode &&
              field.key === 'accountBalance' &&
              showSelectCurrency,
          },
        ]"
        @keyup.enter="$emit('next-field', keyField)"
        @focus="inputFocus = true"
        @focusout="inputFocus = false"
        @input="textChanged($event)"
      />

      <input
        v-else
        :id="keyField"
        :ref="keyField"
        v-model="formattedValue"
        :type="getInputType"
        :readonly="field.readOnly"
        :style="{ width: fixedWidth }"
        :disabled="field.disabled"
        class="padding"
        autocomplete="off"
        :class="[
          inputClasses,
          {
            'no-border': noBorder,
            'no-width-specify': field.noWidthSpecify,
            'input-with-suffix': field.hasSuffix,
            'is-larger-suffix': field.hasSuffix && field.suffixText.length >= 3,
            'input-with-prefix': hasPrefix || field.hasPrefix,
            'is-larger-prefix':
              (hasPrefix || field.hasPrefix) && field.prefixText.length >= 3,
            readonly: field.readOnly,
            'warning-input': isWarning,
            'is-password': field.type === 'password',
            'entry-price-with-crypto':
              selectedCheckboxes.tradingMode &&
              field.key === 'entryPrice' &&
              showSelectCurrency,
          },
        ]"
        @focus="inputFocus = true"
        @focusout="inputFocus = false"
        @input="textChanged($event)"
        @keyup.enter="$emit('next-field', keyField)"
      />
      <Icon
        v-if="field.type === 'password' && canSeeInputPass"
        clickable
        name="eye-on"
        large
        :stroke="1.25"
        class="icon-input"
        @click="canSeeInputPass = false"
      />
      <Icon
        v-else-if="field.type === 'password' && !canSeeInputPass"
        clickable
        name="eye-off"
        :stroke="1.25"
        large
        class="icon-input"
        @click="canSeeInputPass = true"
      />

      <div
        v-if="
          field.key === 'triggerPrice' &&
          field.isLimitConditionalOrder &&
          !isFromDialog
        "
        class="select-options background"
        style="margin-top: 8px"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <div
          v-for="triggerBy of field.triggerByItems"
          :key="triggerBy"
          :class="{ active: field.optionValue === triggerBy }"
          :style="{ width: `calc(100% / ${field.triggerByItems.length}` }"
          @click="$emit('pressed-option', triggerBy, field)"
        >
          {{ triggerBy }}
        </div>
      </div>
      <ButtonTooltip
        v-if="field.hasButton && !compoundVisible"
        :field="field"
        @click="$emit('pressed-button', field)"
      />
      <!-- <button
        v-if="field.hasButton && !compoundVisible"
        v-tooltip="field.buttonToolTip"
        type="button"
        style="height: 30px;"
        class="button input-field"
        :class="{ 'is-dark-mode': darkMode, 'large-button': inputFocus }"
        @click="$emit('pressed-button', field)"
      >
        <Icon v-if="field.buttonIcon" :name="field.buttonIcon" current-color color clickable @click="$emit('add-entry')" />
        <template v-else>
          {{ field.buttonText }}
        </template>
      </button> -->
    </div>
    <div
      v-else-if="field.field === 'double-checkbox'"
      class="checkbox-container"
      style="margin-top: 10px"
      :class="{ displayFlex: isFromExecuteModal }"
    >
      <div class="checkbox-block">
        <input
          :id="keyField"
          v-model="formattedValue.first"
          type="checkbox"
          style="margin-right: 13px"
          :disabled="field.disabled"
          @change="doubleCheckChanged($event, 'first')"
        />
        <label v-if="!isFromExecuteModal" class="no-select" :for="keyField">{{
          field.label
        }}</label>
      </div>
      <div class="checkbox-block">
        <input
          :id="`${keyField}-second`"
          v-model="formattedValue.second"
          type="checkbox"
          style="margin-right: 13px"
          :disabled="field.disabled"
          @change="doubleCheckChanged($event, 'second')"
        />
        <label
          v-if="!isFromExecuteModal"
          class="no-select"
          :for="`${keyField}-second`"
          >{{ field.secondLabel }}</label
        >
      </div>
    </div>
    <div
      v-else-if="field.field === 'checkbox'"
      class="checkbox-container"
      :class="{ displayFlex: isFromExecuteModal }"
    >
      <input
        :id="keyField"
        v-model="formattedValue"
        type="checkbox"
        style="margin-right: 13px"
        :disabled="field.disabled"
        @change="doubleCheckChanged($event)"
      />
      <label v-if="!isFromExecuteModal" class="no-select" :for="keyField">{{
        field.label
      }}</label>
    </div>
    <div
      v-else-if="field.field === 'color-picker'"
      class="align-middle flex-start color-picker"
    >
      <div class="prefix-text" :class="{ 'is-dark-mode': darkMode }">
        <span class="text">#</span>
      </div>
      <input
        v-model="colorHexInput"
        maxlength="6"
        type="text"
        class="input-with-prefix"
        :class="{ 'warning-input': colorHexInputWarning }"
      />
      <ClientOnly>
        <v-swatches
          v-model="formattedValue"
          show-fallback
          swatches="text-advanced"
          fallback-input-type="color"
          popover-x="left"
          :style="{ width: '60%' }"
          :class="{ 'is-dark-mode': darkMode }"
        />
      </ClientOnly>
    </div>
    <div
      v-else-if="field.field === 'date-picker'"
      class="align-middle"
      :class="{ 'is-dark-mode': darkMode }"
    >
      <ClientOnly>
        <DateTime v-model:value="formattedValue" :dark-mode="darkMode" />
      </ClientOnly>
    </div>
    <div v-else-if="field.field === 'datetime-picker'" class="align-middle">
      <input
        :id="keyField"
        :value="formattedDatetime"
        type="input"
        class="datetime-picker-input"
        :readonly="true"
        :class="{ 'warning-input': isWarning }"
        @click="showDateTimePicker = true"
      />
      <CustomDialog
        v-if="showDateTimePicker"
        :dark-mode="darkMode"
        no-background
        :dialog-width="'550px'"
        @secondary-button="showDateTimePicker = false"
      >
        <template #body>
          <div>
            <VueCtkDateTimePicker
              v-model="formattedValue"
              :dark="darkMode"
              :inline="true"
              :format="
                clock === '24h' ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD HH:mm a'
              "
              formatted="YYYY-MM-DD HH:mm"
              output-format="YYYY-MM-DDTHH:mm"
              class="date-time-picker"
              :class="{
                'date-time-warning': isWarning,
                'is-dark-mode': darkMode,
                'date-time-no-border': noBorder,
              }"
              @input="onValueChange()"
            />
            <div class="banner" :class="{ 'is-dark-mode': darkMode }">
              <ui-form-field class="radio-button">
                <ui-radio
                  v-model="clock"
                  input-id="24h-input"
                  value="24h"
                  class="balm-radio"
                  :class="{ 'is-dark-mode': darkMode }"
                />
                <label for="24h-input" class="no-select" @click="clock = '24h'"
                  >24h</label
                >
              </ui-form-field>
              <ui-form-field class="radio-button">
                <ui-radio
                  v-model="clock"
                  input-id="12h-input"
                  value="12h"
                  class="balm-radio"
                  :class="{ 'is-dark-mode': darkMode }"
                />
                <label
                  for="12h-input"
                  class="no-select clickable"
                  @click="clock = '12h'"
                  >12h</label
                >
              </ui-form-field>
            </div>
            <div class="close-banner" @click="showDateTimePicker = false">
              OK
            </div>
          </div>
        </template>
      </CustomDialog>
    </div>
    <div v-else-if="field.field === 'slider'" class="align-middle slider">
      <input
        :id="keyField"
        type="range"
        class="slider"
        :min="field.sliderMinimum"
        :step="field.sliderStep"
        :max="field.sliderMaximum"
        :disabled="field.disabled"
        :value="formattedValue"
        :class="{
          'is-dark-mode': darkMode,
          'is-large': selectedCheckboxes.tradingMode && !isRightColumn,
          'is-small': selectedCheckboxes.tradingMode && isRightColumn,
          'create-trade-slider': field.isCreateTradeModal,
          'slider-bigger':
            selectedCheckboxes.tradingMode &&
            field.key === 'tradeSize' &&
            cryptoMode,
        }"
        @input="onSliderInput($event)"
      />
      <label :for="keyField" class="no-select"
        >{{ formattedValue }}{{ field.labelText }}</label
      >
    </div>
    <div v-else-if="field.field === 'slider-advanced'" class="align-middle">
      <input
        :id="keyField"
        type="range"
        class="slider"
        :min="field.sliderMinimum"
        :step="field.sliderStep"
        :max="field.sliderMaximum"
        :disabled="field.disabled"
        :value="formattedValue"
        :class="[
          field.classes,
          {
            'is-dark-mode': darkMode,
            'is-large':
              selectedCheckboxes.tradingMode &&
              !isRightColumn &&
              !field.sliderDynamicWidth,
            'is-small':
              selectedCheckboxes.tradingMode &&
              isRightColumn &&
              !field.sliderDynamicWidth,
            'create-trade-slider': field.isCreateTradeModal,
            'slider-bigger':
              selectedCheckboxes.tradingMode &&
              field.key === 'tradeSize' &&
              cryptoMode,
          },
        ]"
        @input="onSliderInput($event)"
      />
      <input
        v-model="formattedValue"
        class="mini-input"
        type="number"
        :class="{ 'warning-input': isWarning }"
        @input="onValueChange()"
      />
      <label
        :for="keyField"
        :min="field.sliderMinimum"
        :max="field.sliderMaximum"
        class="no-select"
        >{{ field.labelText }}</label
      >
    </div>
    <div
      v-else-if="field.field === 'riskRewardRatio'"
      class="flex-align-center risk-reward-ratio"
    >
      <div class="label">1 :</div>
      <div class="input-container">
        <input
          :id="keyField"
          :ref="keyField"
          v-model="formattedValue"
          :type="getInputType"
          :readonly="field.readOnly"
          :disabled="field.disabled"
          autocomplete="off"
          class="padding"
          :class="[
            inputClasses,
            {
              'is-dark-mode': darkMode,
              'no-border': noBorder,
              'input-with-prefix': hasPrefix || field.hasPrefix,
              'is-larger-prefix':
                (hasPrefix || field.hasPrefix) && field.prefixText.length >= 3,
              readonly:
                field.readOnly &&
                field.key !== 'buyPrice' &&
                field.key !== 'entryPrice' &&
                showSelectCurrency,
              'is-password': field.type === 'password',
              fullWidth: !selectedCheckboxes.tradingMode,
              smallWidth: isSmallWidth(),
              'full-width-with-button': !isSmallWidth() && field.hasButton,
              'no-width-specify': field.noWidthSpecify,
              'warning-input': isWarning,
              'is-right-column-input': isRightColumn,
              'avg-button-none': field.hasButton && compoundVisible,
              'entry-price-with-crypto':
                selectedCheckboxes.tradingMode &&
                field.key === 'entryPrice' &&
                showSelectCurrency,
              'larger-small-width':
                selectedCheckboxes.tradingMode &&
                field.key === 'accountBalance' &&
                showSelectCurrency,
            },
          ]"
          @keyup.enter="$emit('next-field', keyField)"
          @focus="inputFocus = true"
          @focusout="inputFocus = false"
          @input="textChanged($event)"
        />
      </div>
    </div>
    <div v-else-if="field.field === 'switch'">
      <label class="switch" :class="{ 'is-dark-mode': darkMode }">
        <input
          id="isactive"
          v-model="formattedValue"
          type="checkbox"
          @input="onSwitchInput($event)"
        />
        <span class="slider round" />
      </label>
    </div>
    <div v-else-if="field.field === 'field-selector'">
      <FieldSelector :fields="field.columnFields" :dark-mode="darkMode" fixed />
    </div>
    <div v-else-if="field.field === 'TimeZoneSelector'">
      <TimeZoneSelector
        :dark-mode="darkMode"
        :user-settings="userSettings"
        :field="field"
        @selected-item="selectedItem"
      />
    </div>
    <div v-else-if="field.field === 'TradingJournalFieldSelector'">
      <TradingJournalFieldSelector
        :dark-mode="darkMode"
        :user-settings="userSettings"
        :field="field"
        @selected-item="selectedItem"
      />
    </div>
    <div v-else-if="field.field === 'ModalAutoCompleteSelector'">
      <ModalAutoCompleteSelector
        :dark-mode="darkMode"
        :user-settings="userSettings"
        :field="field"
        @selected-item="selectedItem"
      />
    </div>
    <div v-else-if="field.field === 'select-options'">
      <div
        class="select-options background"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <div
          v-for="item of selectOptionsFields"
          :key="item.id"
          :class="{ active: field.value === item.text }"
          :style="{ width: `calc(100% / ${selectOptionsFields.length}` }"
          @click="selectOption(item.text)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div
      v-else-if="field.field === 'select-options-double-deck'"
      style="border-radius: 4px"
    >
      <div
        class="select-options top background"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <div
          v-for="item of field.items.top"
          :key="item.id"
          :class="{ active: field.value === item.text }"
          :style="{ width: `calc(100% / ${field.items.top.length}` }"
          @click="selectOption(item.text)"
        >
          {{ item.text }}
        </div>
      </div>
      <div
        class="select-options bottom background"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <div
          v-for="item of field.items.bottom"
          :key="item.id"
          :class="{ active: field.value === item.text }"
          :style="{ width: `calc(100% / ${field.items.bottom.length}` }"
          @click="selectOption(item.text)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div v-else-if="field.key === 'estimatedPnL'">
      <div v-html="field.value" />
    </div>
    <div v-else-if="field.field === 'auto-complete'">
      <AutoComplete
        :id="keyField"
        :initial-value="formattedValue"
        :dark-mode="darkMode"
        :items="field.autoCompleteItems"
        add-padding
        :warning="isWarning"
        :field="field"
        :class-items="inputClasses"
        :no-focus-increase="field.noFocusIncrease"
        :fixed-height="field.fixedHeight"
        :full-caps="isFullCaps"
        :placeholder="field.placeholder"
        @search-text-changed="onAutoCompleteInput"
        @input="foundItem"
      />
    </div>
    <div v-else class="dropdown">
      <select
        v-if="fixedWidth === ''"
        :id="keyField"
        v-model="formattedValue"
        class="minimal padding is-thumb"
        style="height: 100%"
        :disabled="field.disabled"
        :class="{
          'is-dark-mode': darkMode,
          fullWidth: isFromExecuteModal,
          'fixed-height': field.fixedHeight || fixedHeight,
          'warning-input': isWarning,
        }"
        @change="onValueChange(true)"
      >
        <option
          v-for="option in field.items"
          :key="option.id"
          :value="option.text"
          :disabled="option.disabled"
        >
          {{ option.text }}
        </option>
      </select>
      <select
        v-else
        :id="keyField"
        v-model="formattedValue"
        :style="{ width: fixedWidth }"
        class="minimal padding is-thumb"
        style="height: 100%"
        :disabled="field.disabled"
        :class="{
          'is-dark-mode': darkMode,
          fullWidth: isFromExecuteModal,
          'fixed-height': field.fixedHeight || fixedHeight,
        }"
        @change="onValueChange(true)"
      >
        <option
          v-for="option in field.items"
          :key="option.id"
          :value="option.text"
          :disabled="option.disabled"
        >
          {{ option.text }}
        </option>
      </select>
      <div
        v-if="
          field.key === 'orderType' &&
          (field.value === 'Conditional - Limit' ||
            field.value === 'Conditional - Market') &&
          !isFromDialog
        "
        class="select-options background"
        style="margin-top: 8px"
        :class="{ 'is-dark-mode': darkMode }"
      >
        <div
          v-for="order of field.orderOpenCloseItems"
          :key="order"
          :class="{ active: field.optionValue === order }"
          :style="{ width: `calc(100% / ${field.orderOpenCloseItems.length}` }"
          @click="$emit('pressed-option', order, field)"
        >
          {{ order }}
        </div>
      </div>
    </div>

    <FileViewer
      v-if="field.imageFiles"
      ref="viewer"
      :viewer="viewer"
      :images="field.imageFiles"
      @has-showed-viewer="viewer.visibleViewer = !viewer.visibleViewer"
    />
  </component>
</template>

<script>
import moment from "moment";

export default {
  name: "InputFields",

  props: {
    container: {
      type: String,
      required: false,
      default: "div",
    },
    field: {
      type: Object,
      required: true,
    },
    userSettings: {
      type: Object,
      required: false,
      default: null,
    },

    classList: {
      type: String,
      required: false,
      default: "",
    },

    selectedCheckboxes: {
      type: Object,
      required: false,
      default: () => {
        return {
          calculateWithShares: false,
          tradingMode: true,
          useCryptocurrency: false,
        };
      },
    },
    darkMode: {
      type: Boolean,
      default: false,
      required: false,
    },

    alwaysAlignMiddleStart: {
      type: Boolean,
      default: false,
      required: false,
    },

    isRightColumn: {
      type: Boolean,
      default: false,
      required: false,
    },

    createTradeModal: {
      type: Boolean,
      default: false,
      required: false,
    },

    noBorder: {
      type: Boolean,
      default: false,
      required: false,
    },

    compoundVisible: {
      type: Boolean,
      default: false,
      required: false,
    },

    isFromExecuteModal: {
      type: Boolean,
      default: false,
      required: false,
    },

    fixedWidth: {
      type: String,
      default: "",
      required: false,
    },

    fixedHeight: {
      type: Boolean,
      default: true,
      required: false,
    },

    isFromDialog: {
      type: Boolean,
      default: false,
      required: false,
    },

    isMarketOrder: {
      type: Boolean,
      default: false,
      required: false,
    },

    hasPrefix: {
      type: Boolean,
      default: false,
      required: false,
    },

    cryptoMode: {
      type: Boolean,
      default: false,
      required: false,
    },

    forexMode: {
      type: Boolean,
      default: false,
      required: false,
    },

    nextInputFocus: {
      type: String,
      default: "",
      required: false,
    },
  },

  setup() {
    const windowConfig = WindowConfigStore();
    const homeAPIStore = HomeAPIStore();
    const colorHexInput = ref("");
    return { windowConfig, homeAPIStore, colorHexInput };
  },

  data() {
    return {
      labelCheckboxValue: false,
      colorHexInputWarning: false,
      loading: true,
      clock: "24h",
      showDateTimePicker: false,
      date: new Date(),
      showMenu: false,
      fields: {},
      inputFocus: false,
      canSeeInputPass: false,
      formattedValue: null,
      viewer: { visibleViewer: false, fileIndex: 0 },
    };
  },

  computed: {
    windowStore() {
      if (_isNil(this.windowConfig.$state)) return {};
      return this.windowConfig.$state;
    },

    homeStore() {
      if (_isNil(this.homeAPIStore.$state)) return {};
      return this.homeAPIStore.$state;
    },

    hasLoadedForexAndCrypto() {
      return this.homeStore.hasLoadedForex && this.homeStore.hasLoadedCrypto;
    },

    showSelectCurrency() {
      if (!this.hasLoadedForexAndCrypto) return false;
      if (this.forexMode && this.homeStore.blockCalculatorForexFeatures)
        return false;
      if (this.cryptoMode && this.homeStore.blockCalculatorCryptoFeatures)
        return false;

      return (
        (this.forexMode || this.cryptoMode) &&
        (this.field.key === "buyPrice" || this.field.key === "entryPrice")
      );
    },

    isLarge() {
      // if (this.forexMode && this.homeStore.blockCalculatorForexFeatures) return true
      // if (this.cryptoMode && this.homeStore.blockCalculatorCryptoFeatures) return false

      return this.forexMode || this.cryptoMode;
    },

    selectOptionsFields() {
      if (_isNil(this.field.items) || this.field.field !== "select-options")
        return [];

      return _filter(this.field.items, function (c) {
        if (_isNil(c.visible)) return true;
        return c.visible;
      });
    },

    inputClasses() {
      if (_isNil(this.field.class)) return "";
      return this.field.class;
    },

    isFullCaps() {
      if (_isNil(this.field.isFullCaps)) return false;
      return this.field.isFullCaps;
    },

    isWarning() {
      if (!this.isFromDialog) {
        return this.field.warning;
      } else {
        return this.field.warningDialog;
      }
    },

    fieldClassList() {
      if (_isNil(this.field.classList)) return "";
      return this.field.classList;
    },

    formattedDatetime() {
      if (this.field.field !== "datetime-picker") return null;
      if (this.formattedValue === "" || _isNil(this.formattedValue)) return "";
      return moment(this.formattedValue).format("ddd. MMM D. YYYY  -  HH:mm");
    },

    keyField() {
      if (this.isFromDialog) return "dialog-" + this.field.key;
      return this.field.key;
    },

    getInputType() {
      if (this.field.type === "password" && this.canSeeInputPass) return "text";
      else if (this.field.type === "password" && !this.canSeeInputPass)
        return "password";
      else return this.field.type;
    },
  },

  watch: {
    "field.value"(newValue, oldValue) {
      if (newValue !== oldValue && !this.isFromDialog) {
        this.formattedValue = newValue;
      }
    },

    formattedValue(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (this.field.field === "color-picker") {
          this.colorHexInput = newValue.toUpperCase().replace("#", "");
          this.onValueChange(false, true);
        }

        if (this.field.field === "date-picker") {
          this.onValueChange();
        }
      }
    },

    colorHexInput(newValue, oldValue) {
      if (newValue !== oldValue && !this.isFromDialog) {
        this.colorHexInput = newValue.toUpperCase();
        this.colorHexInputWarning =
          newValue.length < 6 && newValue.length !== 0;
        if (newValue.length < 6) return;

        const isValidHexCode = (hexCode) => {
          const hexDigits = hexCode.slice(1);
          return (
            hexCode.startsWith("#") &&
            (hexDigits.length === 3 || hexDigits.length === 6) &&
            /^[\dA-Fa-f]+$/.test(hexDigits)
          );
        };

        if (isValidHexCode(`#${newValue}`)) {
          this.formattedValue = `#${newValue}`;
          this.onValueChange(false, true);
        }
      }
    },

    clock(newValue, oldValue) {
      if (newValue === oldValue || this.loading) return;
      this.showDateTimePicker = false;
      this.showDateTimePicker = true;
      if (newValue === "12h") localStorage.setItem("12-hour-clock", true);
      else localStorage.removeItem("12-hour-clock");
    },

    "field.typeModeSelected"(newValue, oldValue) {
      if (newValue !== oldValue && this.field.isForex) {
        this.formattedValue = this.field.typesMode[newValue].value;
        this.$emit("calculate-trade");
        this.onValueChange();
      }
    },

    "field.dialogValue"(newValue, oldValue) {
      if (newValue !== oldValue && this.isFromDialog) {
        this.formattedValue = this.field.dialogValue;
      }
    },

    "field.labelCheckbox.value"(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.labelCheckboxValue = newValue;
      }
    },

    nextInputFocus(newValue, oldValue) {
      if (
        newValue !== oldValue &&
        newValue !== "" &&
        this.keyField === newValue
      ) {
        this.$refs[newValue].focus();
      }
    },
  },

  mounted() {
    if (localStorage.getItem("12-hour-clock")) this.clock = "12h";
    if (this.field.field === "color-picker") {
      this.colorHexInput = this.formattedValue.replace("#", "");
    }

    if (!_isNil(this.field.labelCheckbox)) {
      this.labelCheckboxValue = this.field.labelCheckbox.value;
    }

    setTimeout(() => {
      this.loading = false;
    }, 100);
  },

  created() {
    if (this.isFromDialog) {
      this.formattedValue = this.field.dialogValue;
    } else {
      this.formattedValue = this.field.value;
    }
  },

  methods: {
    onValueChange(fromDropdown = false, isColor = false) {
      if (isColor) {
        this.formattedValue = this.formattedValue.toUpperCase();
        this.colorHexInput = this.formattedValue.replace("#", "");
      }

      if (
        (this.field.field === "input" ||
          this.field.field === "riskRewardRatio") &&
        this.formattedValue.length > this.field.maxLength
      ) {
        while (this.formattedValue.length > this.field.maxLength) {
          this.formattedValue = this.formattedValue.slice(0, -1);
        }
      }

      this.$emit(
        "on-value-change",
        this.field,
        this.formattedValue,
        this.isFromDialog,
      );
      if (fromDropdown) this.$emit("on-dropdown-change", this.field);

      this.$emit("calculate-trade");
    },
    textChanged(e) {
      this.onValueChange();
    },
    submitPressed(e) {
      e.preventDefault();
    },

    onAutoCompleteInput(newValue) {
      this.formattedValue = newValue.trim();
      this.$emit("found-value", newValue.trim());
      this.onValueChange();
    },

    onSwitchInput(event) {
      this.formattedValue = event.target.checked;
      this.onValueChange();
    },

    isSmallWidth() {
      if (
        (this.field.key === "buyPrice" || this.field.key === "entryPrice") &&
        !this.showSelectCurrency
      )
        return false;
      return this.selectedCheckboxes.tradingMode;
    },

    fullWidthWidthButton() {
      if (
        (this.field.key === "buyPrice" || this.field.key === "entryPrice") &&
        !this.showSelectCurrency
      )
        return false;
      return this.selectedCheckboxes.tradingMode;
    },

    changedColor(e) {
      this.colorHexInput = this.formattedValue.toUpperCase().replace("#", "");
      this.onValueChange(false, true);
    },

    onSliderInput(event) {
      if (this.field.field === "slider")
        this.formattedValue = parseInt(event.target.value);
      else
        this.formattedValue =
          Math.round((parseFloat(event.target.value) + Number.EPSILON) * 100) /
          100;
      this.onValueChange();
    },

    selectOption(option) {
      this.formattedValue = option;
      this.onValueChange();
    },

    foundItem(item) {
      this.formattedValue = item.trim();
      this.onValueChange();
    },

    selectedItem(value) {
      this.$emit("selected-item", value);
    },

    labelCheckboxPress(event) {
      this.$emit("label-checkbox-press", {
        id: this.keyField,
        value: event,
        checkboxId: this.field.labelCheckbox.id,
      });
    },

    doubleCheckChanged(event, doubleId = null) {
      const value = _isNil(event.target) ? event : event.target.checked;

      this.$emit("on-checkbox-change", value, this.keyField, doubleId);
      this.onValueChange();
    },
  },
};
</script>

<style scoped lang="scss">
.crypto-mode {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.select-options {
  user-select: none;
  display: flex;
  width: 100%;
  border-radius: 4px;
  font-size: 12px;
  align-items: center;
  background: #e9e9e9;
  &.top {
    border-bottom-right-radius: unset;
    border-bottom-left-radius: unset;
  }

  &.bottom {
    border-top-right-radius: unset;
    border-top-left-radius: unset;
  }

  &.is-dark-mode {
    background: #1e222d !important;

    div {
      background: #1e222d;
    }

    div.active {
      border: 1px solid #808080 !important;
      background-color: #121212 !important;
    }
  }

  div {
    border-radius: 4px;
    padding: 1px 5px;
    cursor: pointer;
    text-align: center;

    display: flex;
    align-items: center;
    justify-content: center;

    &.active {
      border: 1px solid #808080;
      background: #d6d4d4;
    }
  }
}

.fullWidth {
  width: 100%;
}

.smallWidth {
  width: 100%;
}

.is-right-column-input {
  max-width: 100% !important;
  margin-right: 0 !important;
}

input[type="number"],
input[type="text"],
input[type="password"] {
  font-size: 16px;
  border: 1px solid rgb(118, 118, 118);
  height: 30px !important;

  &.mini-input {
    padding-top: 1px;
    height: 25px !important;
  }
}

.dropdown {
  display: flex;
  flex-direction: column;

  > .minimal.fixed-height {
    height: 30px !important;
  }
}

.warning-input {
  box-shadow: 0px 0px 0px 1px rgb(240, 0, 0) !important;
  border-color: transparent !important;
  outline: none !important;
}

.has-button-container {
  display: flex;
}

.has-button-container > .smallWidth {
  margin-right: 0px !important;

  &:not(.no-width-specify) {
    width: 165px !important;
  }

  &.larger-small-width {
    width: 225px !important;
  }

  &.entry-price-with-crypto {
    width: 130px !important;
  }
}

.refresh-button,
.checkbox-button {
  position: relative;
  zoom: 90%;
  bottom: 0px;
  right: 2px;

  &.checkbox-button {
    bottom: 3px;
  }
}

.has-button-container > .smallWidth.avg-button-none {
  width: 100% !important;
  margin-right: 0 !important;
}

.has-button-container > .fullWidth {
  margin-right: 0px !important;
}

.has-button-container > .smallWidth + button {
  width: 45px;
}

button.is-dark-mode {
  background-color: #121212 !important;
  border: 1px solid #808080;
}

button.input-field.large-button {
  height: 30px;
  //border: 1px solid #808080;

  &.is-dark-mode {
    border-left: 1px solid white;
  }
}

.different-width {
  width: 210px;

  &.larger-different-width {
    width: 270px;
  }

  &.is-create-trade-modal {
    width: 330px;
  }
}

.datetime-picker-input {
  width: 100%;
  height: 30px;
  border: 1px solid rgb(118, 118, 118);
  cursor: pointer;
  padding-left: 10px;
}

.checkbox-container.displayFlex {
  display: flex;
}

input.is-password {
  padding-right: 40px;
}

.icon-input {
  cursor: pointer;
  margin-left: 12px;
}

input.input-with-prefix {
  padding-left: 30px;
  padding-right: 8px;

  &.is-larger-prefix {
    padding-left: 50px;
  }
}

input.input-with-suffix {
  padding-right: 30px;
  padding-left: 8px;

  &.is-larger-suffix {
    padding-right: 50px;
  }
}

.prefix-text,
.suffix-text {
  position: absolute;
  margin-top: 4px;
  margin-left: 10px;
  z-index: 510;
  color: #707070;

  &.has-select {
    margin-left: 105px;
  }

  &.is-dark-mode {
    color: #c4c4c4;
  }

  &.suffix-text {
    right: 15px;
  }
}

.align-middle {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.flex-start {
    align-items: flex-start;
  }

  &.color-picker {
    input {
      font-size: 14px;
      padding-bottom: 3px;
      width: 100px !important;
    }
  }

  &.slider {
    position: relative;
    top: 3px;
  }
}

.type-mode {
  zoom: 80%;
  display: flex;
  align-items: center;

  .option:first-child {
    margin-right: 15px;
  }
}

.invincible-container {
  opacity: 0;
}
.invincible-block {
  position: absolute;
  z-index: 1;
}

.pop-up-block {
  z-index: 1;
  position: absolute;
  background: white;
  border-radius: 15px;
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  box-shadow:
    inset 0 -2rem 2rem -2rem white,
    0 6px 10px 4px rgba(0, 0, 0, 0.15);
  font-weight: 500;

  align-items: center;
  justify-content: center;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  &.is-dark-mode {
    box-shadow: none;
    background: black;
  }
}

.banner {
  display: flex;
  gap: 10px;
  position: relative;
  top: -4px;
  left: 10px;
  height: 0;
  zoom: 90%;
  z-index: 500000;
  width: fit-content;
  .radio-button {
    cursor: pointer;
    display: flex;
    align-items: flex-end;
  }
  &.is-dark-mode {
    .radio-button {
      color: white;
    }
  }
}

.close-banner {
  margin: 0 auto;
  text-align: center;
  width: 100px;
  z-index: 500;
  position: relative;
  top: -32px;
  left: 3px;
  cursor: pointer;
}

.mini-input {
  width: 55px;
  text-align: center;
  font-size: 15px;
}

.slider + label,
.mini-input + label {
  margin-bottom: 0 !important;
}

.input-container {
  position: relative;

  &.extra-height {
    height: 70px;
  }
}

.flex-end {
  display: flex;
  justify-content: flex-end;
}

.full-width-with-button {
  width: 100% !important;
}

input[type="checkbox"] + label {
  cursor: pointer !important;
}

.flex-align-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.risk-reward-ratio {
  .label {
    width: 50px;
    font-size: 16px;
    letter-spacing: 6px;
  }

  .input-container {
    flex: 1;
  }
}
</style>
