<template>
  <div class="config-body">
    <div class="modal-header">
      <div style="display: flex">
        <h3 class="title-modal">{{ isEdit ? "Edit" : "Create" }} trade</h3>
        <div v-if="!apiCallLoading" class="header-actions">
          <div v-if="!isEdit">
            <button
              type="button"
              class="button add-padding"
              :class="{ 'is-dark-mode': darkMode }"
              @click="resetInput"
            >
              Reset
            </button>
          </div>
          <Icon
            name="upload"
            tooltip="Upload an image"
            :height="20"
            :width="22"
            clickable
            @click="openImageUploadDialog"
          />
          <Icon
            v-if="files.length > 0"
            name="image-viewer"
            :height="22"
            :width="22"
            tooltip="Show images"
            clickable
            @click="viewer.visibleViewer = !viewer.visibleViewer"
          />
          <Icon
            v-if="files.length > 0"
            name="image-remover"
            :height="21"
            :width="21"
            tooltip="Remove an image"
            clickable
            @click="removeImageDialogVisible = true"
          />
          <Icon
            :name="links.length > 0 ? 'manage-link' : 'add-link'"
            :height="23"
            :width="23"
            :tooltip="links.length > 0 ? 'Manage links' : 'Attach a link'"
            clickable
            @click="addLinkDialogVisible = true"
          />
          <Icon
            name="tags"
            :height="24"
            :width="24"
            tooltip="Add tag"
            clickable
            @click="showTagDialog"
          />
          <Icon
            name="arrow-back-up"
            :height="24"
            :width="24"
            tooltip="Revert changes"
            clickable
            @click="revertChanges"
          />
        </div>
      </div>
      <button type="button" class="close-button">
        <Icon large name="cross" @click="debouncedExitDialog" />
      </button>
    </div>
    <div ref="modal-body" class="modal-body is-thumb">
      <template v-if="!apiCallLoading">
        <table style="width: 100%">
          <tr
            v-for="input in fields"
            :key="input.key"
            :class="{
              'is-larger':
                input.field === 'select-options-double-deck' && input.visible,
            }"
          >
            <div
              v-if="input.visible"
              :title="input.info"
              class="label-field"
              :class="{
                'has-help-button': input.hasHelpButton,
                'is-larger': input.field === 'select-options-double-deck',
              }"
            >
              <label
                :id="'label-' + input.key"
                :for="input.key"
                class="no-select"
                >{{ input.label }}

                <Icon
                  v-if="input.required"
                  name="required"
                  :width="7"
                  :height="7"
                  filled
                  display-inline
                  set-color="red"
                  container="span"
                  class="required-star"
                />
              </label>
              <Icon
                v-if="input.hasHelpButton"
                name="help"
                clickable
                :tooltip="input.helpText"
                :height="15"
                :width="15"
                html-tooltip
                class="help-button small"
              />
            </div>
            <div
              v-if="input.visible"
              :class="{
                checkbox: input.field === 'checkbox',
                'is-dark-mode': darkMode,
                'is-slider-field': input.field === 'slider',
              }"
              class="input-field"
            >
              <InputFields
                v-if="input.key !== 'mulitple_entries'"
                :dark-mode="darkMode"
                :field="input"
                :fixed-height="false"
                :create-trade-modal="true"
                :is-from-execute-modal="true"
                :selected-checkboxes="selectedCheckboxes"
                @on-value-change="onValueChange"
              />
              <div v-else class="entries">
                <div
                  v-for="entry in input.entries"
                  :key="entry.Id"
                  class="entry-container"
                >
                  <div class="label-container">
                    <div>Quantity: {{ entry.Quantity }}</div>
                    <div>Entry price: {{ entry.EntryPrice }}</div>
                  </div>
                  <div class="action-container">
                    <Icon name="edit" clickable />
                    <Icon name="cross" clickable />
                  </div>
                </div>
              </div>
            </div>
          </tr>
        </table>
        <ClientOnly>
          <b-tabs v-model="tabIndex" @activate-tab="onActivateTab">
            <b-tab
              v-for="(entry, index) in entries"
              :key="entry.Id"
              :disabled="entry.disabled"
              class="tab-container"
            >
              <template #title>
                <div class="entry-label" :class="{ 'is-dark-mode': darkMode }">
                  Entry {{ index + 1 }}
                  <Icon
                    v-if="entries.length > 1 && tabIndex !== index"
                    style="margin-left: 10px"
                    name="cross"
                    clickable
                    @click="removeEntry(index)"
                  />
                </div>
              </template>
              <table style="width: 100%; margin-top: 20px">
                <tr
                  v-for="input in entryFields"
                  :key="input.key"
                  :class="{
                    'is-larger':
                      input.field === 'select-options-double-deck' &&
                      input.visible,
                  }"
                >
                  <div
                    v-if="input.visible"
                    :title="input.info"
                    class="label-field"
                    :class="{
                      'has-help-button': input.hasHelpButton,
                      'is-larger': input.field === 'select-options-double-deck',
                    }"
                  >
                    <label
                      :id="'label-' + input.key"
                      :for="input.key"
                      class="no-select"
                      >{{ input.label }}

                      <Icon
                        v-if="input.required"
                        name="required"
                        :width="7"
                        :height="7"
                        filled
                        display-inline
                        set-color="red"
                        container="span"
                        class="required-star"
                      />
                    </label>
                    <Icon
                      v-if="input.hasHelpButton"
                      name="help"
                      clickable
                      :tooltip="input.helpText"
                      :height="15"
                      :width="15"
                      html-tooltip
                      class="help-button small"
                    />
                  </div>
                  <div
                    v-if="input.visible"
                    :class="{
                      checkbox: input.field === 'checkbox',
                      'is-dark-mode': darkMode,
                      'is-slider-field': input.field === 'slider',
                    }"
                    class="input-field"
                  >
                    <InputFields
                      v-if="input.key !== 'mulitple_entries'"
                      :dark-mode="darkMode"
                      :field="input"
                      :fixed-height="false"
                      :create-trade-modal="true"
                      :is-from-execute-modal="true"
                      :selected-checkboxes="selectedCheckboxes"
                      @on-value-change="onValueChangeEntryFields"
                    />
                    <div v-else class="entries">
                      <div
                        v-for="entry in input.entries"
                        :key="entry.id"
                        class="entry-container"
                      >
                        <div class="label-container">
                          <div>Quantity: {{ entry.Quantity }}</div>
                          <div>Entry price: {{ entry.EntryPrice }}</div>
                        </div>
                        <div class="action-container">
                          <Icon name="edit" clickable />
                          <Icon name="cross" clickable />
                        </div>
                      </div>
                    </div>
                  </div>
                </tr>
              </table>
            </b-tab>
            <b-tab
              v-if="entries.length < 5"
              class="tab-container add-tab"
              disabled
            >
              <template #title>
                <div class="entry-label" :class="{ 'is-dark-mode': darkMode }">
                  <Icon name="plus" clickable @click="addEntry" />
                </div>
              </template>
            </b-tab>
          </b-tabs>
        </ClientOnly>
        <hr :class="{ 'is-dark-mode': darkMode }" />
        <div class="rating">
          <p>Rating</p>
          <ClientOnly>
            <StarsRatings :value="rating" @change="rating = $event" />
          </ClientOnly>
        </div>
        <div class="rating">
          <p>Tags</p>
          <div class="tag-container">
            <div v-if="tags.length > 0" class="tags">
              <span
                v-for="tag of tags"
                :key="tag.id"
                class="tag"
                :style="[windowConfig.getTagStyle(tag)]"
                @click.self="openTagDialog(tag)"
              >
                <span class="no-select" @click.self="openTagDialog(tag)">{{
                  tag.Name
                }}</span>
                <Icon
                  name="trash"
                  tooltip="Remove tag"
                  :width="18"
                  :height="18"
                  current-color
                  clickable
                  @click="addOrRemoveTag(tag, true)"
                />
              </span>
            </div>
            <div class="add-container">
              <Icon
                name="plus"
                :width="15"
                tooltip="Add tag"
                :height="15"
                clickable
                @click="showTagDialog"
              />
            </div>
          </div>
        </div>
        <p style="margin: 5px 2px 10px 2px">Note</p>
        <VueEditor
          id="editor"
          ref="editor"
          v-model="note"
          :class="{ 'is-dark-mode': darkMode }"
          class="editor not-max-width"
          :editor-options="editorOption"
          @input="sanitizeInput"
        />
      </template>
      <Loader
        v-else
        :dark-mode="darkMode"
        :message="isEdit ? 'Updating trade...' : 'Creating trade...'"
      />
    </div>
    <div
      v-show="!apiCallLoading"
      :class="{ 'is-dark-mode': darkMode }"
      class="modal-footer no-padding"
    >
      <button
        ref="exitButton"
        class="secondary-button button"
        style="min-width: 150px"
        type="button"
        @click="exitDialog"
      >
        Exit
      </button>
      <button
        class="primary-button button"
        style="width: 100%; position: relative"
        type="button"
        :disabled="!canCreateOrSaveTrade"
        @click.self="debouncedCreateOrSaveTrade(false)"
      >
        <span @click="debouncedCreateOrSaveTrade(false)">
          {{ isEdit ? "Save" : "Create" }}
          <span
            v-if="selectedJournalsIds.length > 1 && !isEdit"
            class="dot"
            :class="{ 'is-dark-mode': darkMode }"
            style="margin-left: 10px"
            >{{ selectedJournalsIds.length }}</span
          >
        </span>

        <div class="add-multiple" @click="debouncedCreateOrSaveTrade(true)">
          <Icon
            v-if="!isEdit && canCreateOrSaveTrade && allJournals.length > 1"
            :width="18"
            :heigth="19"
            name="horizontal-dots"
            :pop-up-style-props="{
              width: 250,
              height: 50,
              minusMarginLeft: -15,
              minusMarginTop: 0,
            }"
            clickable
            :disabled="!canCreateOrSaveTrade"
            tooltip="Add trade to multiple journals"
          />
        </div>
      </button>
    </div>
    <FileViewer
      ref="viewer"
      :viewer="viewer"
      :images="files"
      @has-showed-viewer="viewer.visibleViewer = !viewer.visibleViewer"
    />
    <CustomDialog
      v-if="removeImageDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'600px'"
      @secondary-button="removeImageDialogVisible = false"
    >
      <template #body>
        <RemoveTradeImageAttachmentDialogBody
          :dark-mode="darkMode"
          :show-dialog="false"
          :image-files="filesWithId"
          @primary-button="removeAttachment($event)"
          @secondary-button="removeImageDialogVisible = false"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="addLinkDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'500px'"
      @secondary-button="addLinkDialogVisible = false"
    >
      <template #body>
        <AddLinkTradeDialogBody
          :dark-mode="darkMode"
          :attachments="links"
          @primary-button="addLink"
          @secondary-button="addLinkDialogVisible = false"
          @remove-attachment="removeAttachment($event)"
          @update-link="updateAttachment($event)"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="tagDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'500px'"
      :big-shadow="false"
      :block-background-click="true"
      @secondary-button="closeTagDialog()"
    >
      <template #body>
        <TradeTagDialogBody
          :current-tag="currentTag"
          :all-tags="tags"
          :current-trade="trade"
          :dark-mode="darkMode"
          @primary-button="addOrRemoveTag"
          @secondary-button="closeTagDialog()"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="uploadImageDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'550px'"
      @secondary-button="uploadImageDialogVisible = false"
    >
      <template #body>
        <UploadImageDialogBody
          v-if="uploadImageDialogVisible"
          :dark-mode="darkMode"
          :journal="currentJournal"
          :show-loader-on-upload="false"
          @primary-button="uploadImage"
          @secondary-button="uploadImageDialogVisible = false"
        />
      </template>
    </CustomDialog>
    <CustomDialog
      v-if="selectJournalDialogVisible"
      :dark-mode="darkMode"
      :dialog-width="'550px'"
      @secondary-button="selectJournals"
    >
      <template #body>
        <SelectTradingJournalDialogBody
          :dark-mode="darkMode"
          :selected-ids="selectedJournalsIds"
          :journal="currentJournal"
          :warning-journal-ids="warningJournalIds"
          :all-journals="allJournals"
          @primary-button="selectJournals"
          @secondary-button="selectJournals"
        />
      </template>
    </CustomDialog>
  </div>
</template>
<script>
import moment from "moment";
import * as createTradeLib from "@/lib/create-trade-fields";
import tradeStatusConstants from "@/lib/trade-status-constants";
import orderTypeTranslation from "@/lib/order-type-translations";
import entryStatusConstants from "@/lib/entry-status-constants";
import entryStatusTranslations from "@/lib/entry-status-translations";
import tradeStatusTranslation from "@/lib/trade-status-translations";
import attachmentStatus from "@/lib/attachment-type-constants";
import sanitizeHtml from "sanitize-html";

export default {
  name: "CreateTradeDialogBody",

  props: {
    currentJournal: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },

    endStartDates: {
      type: Object,
      required: false,
      default: null,
    },

    trade: {
      type: Object,
      required: false,
      default: () => {
        return {};
      },
    },

    currentCurrency: {
      type: Object,
      rquired: false,
      default: () => {
        return {
          symbol: "$",
        };
      },
    },

    journalsIds: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    allJournals: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    userSettings: {
      type: Object,
      required: false,
      default: null,
    },

    darkMode: {
      type: Boolean,
      required: true,
      default: false,
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
  },

  setup() {
    const homeAPIStore = HomeAPIStore();
    const windowConfig = WindowConfigStore();
    return { homeAPIStore, windowConfig };
  },

  data() {
    return {
      entryStatusConstants,
      tabIndex: 0,
      isLoaded: false,
      dialogOpen: false,
      dialogOpenExit: false,
      hasChangedAttachments: false,
      hasChangedTags: false,
      hasChangedEntries: false,
      entryFields: {},
      fields: {},
      entries: [],
      warningJournalIds: [],
      selectedJournalsIds: [],
      removedEntries: [],
      blockOnValueChange: false,
      justCreatedEntry: false,
      debouncedExitDialog: _debounce(this.exitDialog, 100),
      debouncedCheckWarningEntry: _debounce(this.checkWarningEntry, 300),
      debouncedSetEntryFieldsValues: _debounce(this.setEntryFieldsValues, 300),
      debouncedCreateOrSaveTrade: _debounce(this.createOrSaveTrade, 300),
      refreshTags: false,
      loading: true,
      apiCallLoading: false,
      hasChanged: false,
      attachmentToRemoved: [],
      tagsToRemoved: [],
      currentTag: {},
      removeImageDialogVisible: false,
      addLinkDialogVisible: false,
      tagDialogVisible: false,
      uploadImageDialogVisible: false,
      selectJournalDialogVisible: false,
      note: "",
      viewer: { visibleViewer: false, fileIndex: 0 },
      rating: 0,
      existingTags: [],
      existingLinks: [],
      existingFiles: [],
      newAttachments: [],
      newTags: [],
      editorOption: {
        theme: "snow",
        modules: {
          toolbar: [
            [
              "bold",
              "italic",
              "underline",
              "strike",
              { size: ["small", false, "large", "huge"] },
              { list: "ordered" },
              { list: "bullet" },
              "clean",
              { align: ["", "center", "right", "justify"] },
            ],
          ],
        },
      },
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

    isLoggedIn() {
      return (
        this.homeStore.isLoggedIn &&
        !_isNil(this.homeStore.user) &&
        !_isNil(this.homeStore.user.Id)
      );
    },

    isEdit() {
      return (
        !_isNil(this.trade) && !_isEmpty(this.trade) && !_isNil(this.trade.Id)
      );
    },

    canCreateOrSaveTrade() {
      const warningFields = _filter(
        this.fields,
        (field) => field.warning && field.visible,
      );
      const warningFieldsEntries = _filter(
        this.entryFields,
        (field) => field.warning && field.visible,
      );
      if (!_isEmpty(warningFieldsEntries)) return false;

      return _isEmpty(warningFields);
    },

    uniqueTpSl() {
      const TPs = _compact(_uniq(_map(this.entries, "TakeProfit"))).map(
        (value, index) => ({
          orderId: index + 1,
          contract: value,
        }),
      );

      const SLs = _compact(_uniq(_map(this.entries, "Stoploss"))).map(
        (value, index) => ({
          orderId: index + 1,
          contract: value,
        }),
      );

      return { TPs, SLs };
    },

    currentDirection() {
      if (
        this.fields.direction.value === "Long" ||
        this.fields.direction.value === "Buy"
      )
        return "Buy";
      else return "Sell";
    },

    files() {
      const files = this.existingFiles;
      let newFiles = _map(this.newAttachments, (o) => {
        if (o.type !== 1) return 0;
        return o.data.Base64;
      });

      newFiles = _filter(newFiles, function (c) {
        return c !== 0;
      });

      let combinedArray = newFiles.concat(files);
      combinedArray = _map(combinedArray, (o, index) => {
        if (!_isNil(o.url)) {
          return o.url;
        }
        return o;
      });

      return combinedArray;
    },

    filesWithId() {
      const files = this.existingFiles;
      let newFiles = _map(this.newAttachments, (o, index) => {
        if (o.type !== 1) return { url: null, id: null };
        return { url: o.data.Base64, id: o.id };
      });

      newFiles = _filter(newFiles, function (c) {
        return c.id !== null;
      });

      const combinedArray = newFiles.concat(files);
      return combinedArray;
    },

    links() {
      const links = this.existingLinks;
      let newLinks = _map(this.newAttachments, (o, index) => {
        if (o.type !== 2) return 0;
        return { Id: o.id, Link: o.data };
      });

      newLinks = _filter(newLinks, function (c) {
        return c !== 0;
      });

      const combinedArray = newLinks.concat(links);
      return combinedArray;
    },

    tags() {
      if (this.refreshTags) return [];
      const combinedArray = this.existingTags.concat(this.newTags);
      return combinedArray;
    },
  },

  watch: {
    "entryFields.status.value": {
      handler(newValue, oldValue) {
        if (newValue == oldValue || this.loading || this.blockOnValueChange)
          return;
        this.setStatusCheck(newValue, oldValue, this.tabIndex);
      },
    },

    uniqueTpSl: {
      handler(newValue, oldValue) {
        if (newValue == oldValue || this.loading) return;
        setTimeout(() => {
          this.entryFields.take_profit.autoCompleteItems = newValue.TPs;
          this.entryFields.stop_loss.autoCompleteItems = newValue.SLs;
        }, 100);
      },
    },

    "fields.status.value": {
      async handler(newValue, oldValue) {
        if (newValue == oldValue || !this.isLoaded) return;
        this.statusChange(newValue, oldValue, true);
      },
    },
    "fields.direction.value": {
      async handler(newValue, oldValue) {
        if (newValue == oldValue || !this.isLoaded) return;
        this.debouncedCheckWarningEntry();
      },
    },
  },

  mounted() {
    this.loadTrade();
    this.apiCallLoading = false;

    this.$nextTick(() => {
      const container = this.$refs["modal-body"];
      container.scrollTop = 0;
    });

    document.addEventListener("keydown", this.handleKeyDown);
  },
  beforeUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown);
  },
  methods: {
    loadTrade(first = true) {
      this.fields = _cloneDeep(createTradeLib.FIELDS_DATA);
      this.entryFields = _cloneDeep(
        createTradeLib.default.getEntryFields(this.currentCurrency.symbol),
      );
      this.selectedJournalsIds = _isEmpty(this.journalsIds)
        ? [this.currentJournal.Id]
        : this.journalsIds;

      if (this.currentJournal.OptimizeForCFD) {
        this.fields.direction.value = "Long";
        this.fields.direction.items = [
          { id: "Buy", text: "Long" },
          { id: "Sell", text: "Short" },
        ];
      } else {
        this.fields.direction.items = [{ id: "Buy", text: "Buy" }];
      }

      this.fields.symbol.autoCompleteItems = this.currentJournal.uniqueSymbols;

      this.statusChange("Closed", "Closed", false);

      if (!_isEmpty(this.trade)) {
        const trade = _cloneDeep(this.trade);

        if (this.currentJournal.OptimizeForCFD)
          this.fields.direction.value =
            trade.Direction === "Buy" ? "Long" : "Short";
        else this.fields.direction.value = trade.Direction;

        if (trade.Symbol) this.fields.symbol.value = trade.Symbol;
        if (trade.Leverage)
          this.fields.leverage.value =
            trade.Leverage === 0 ? 1 : trade.Leverage;
        if (trade.Note) this.note = trade.Note;
        if (trade.Rating) this.rating = trade.Rating;
        if (trade.Files) this.existingFiles = trade.Files;
        if (trade.Links) this.existingLinks = trade.Links;
        if (trade.Tags) this.existingTags = trade.Tags;
        if (trade.OpenTradeAt)
          this.fields.open_trade_at.value = trade.OpenTradeAt;
        else
          this.fields.open_trade_at.value = moment().format("YYYY-MM-DDTHH:mm");

        if (trade.CloseTradeAt)
          this.fields.close_trade_at.value = trade.CloseTradeAt;
        else this.fields.close_trade_at.value = this.addOneHourToDatetime();

        this.entries = trade.Entries;

        _forEach(this.entries, function (entry) {
          (entry.disabled = false), (entry.InclExclFees = true);
        });

        this.setEntryFieldsValues();

        if (trade.Status) {
          this.fields.status.value = tradeStatusTranslation[trade.Status];
          this.statusChange(
            tradeStatusTranslation[trade.Status],
            "Closed",
            false,
          );
        }
      } else {
        this.loadSettings();
        this.fields.open_trade_at.value = moment().format("YYYY-MM-DDTHH:mm");
        this.fields.close_trade_at.value = this.addOneHourToDatetime();
      }

      if (first && !_isNil(this.endStartDates)) {
        this.fields.open_trade_at.value = moment(
          this.endStartDates.start,
        ).format("YYYY-MM-DDTHH:mm");
        this.fields.close_trade_at.value = moment(
          this.endStartDates.end,
        ).format("YYYY-MM-DDTHH:mm");
      }

      setTimeout(() => {
        this.loading = false;
        this.isLoaded = true;
      }, 1000);
    },
    selectJournals(journalsIds = null) {
      if (journalsIds !== null) this.selectedJournalsIds = journalsIds;
      this.warningJournalIds = [];
      this.selectJournalDialogVisible = false;
    },
    async createOrSaveTrade(addMultipleJournals = false) {
      if (addMultipleJournals) {
        this.selectJournalDialogVisible = true;
        return;
      } else {
        _forEach(this.fields, function (field) {
          if (
            field.required &&
            field.visible &&
            (field.value === "" || field.value === null)
          )
            field.warning = true;
          else field.warning = false;
        });

        _forEach(this.entryFields, function (field) {
          if (
            field.required &&
            field.visible &&
            (field.value === "" || field.value === null)
          )
            field.warning = true;
          else field.warning = false;
        });

        const warningFields = _filter(this.fields, (field) => field.warning);
        const warningFieldsEntries = _filter(
          this.entryFields,
          (field) => field.warning,
        );

        if (!_isEmpty(warningFields) || !_isEmpty(warningFieldsEntries)) {
          this.$noty.error("Please fill in the required fields.");
          return;
        }
      }

      const journalsIds = _isEmpty(this.selectedJournalsIds)
        ? [this.currentJournal.Id]
        : this.selectedJournalsIds;

      const trade = {
        ...this.trade,
        ...{
          Symbol: this.fields.symbol.value,
          Status: this.getStatus(this.fields.status.value),
          Direction: this.currentDirection,
          Leverage:
            this.fields.leverage.value === 1 ? 0 : this.fields.leverage.value,
          OpenTradeAt: this.convertDateTime(this.fields.open_trade_at.value),
          CloseTradeAt: this.convertDateTime(this.fields.close_trade_at.value),
          Rating: this.rating,
          Note: this.note,
          Attachments: [],
          Tags: [],
          Improvements: [],
          Entries: [],
        },
      };

      let success = 0;
      this.apiCallLoading = true;
      const allJournals = this.allJournals;

      const totalPnl = _sumBy(this.entries, (entry) => {
        if (_isNil(entry.RealizedPnL)) return 0;
        if (entry.Status === entryStatusConstants.IS_STOP_LOSS)
          return entry.RealizedPnL * -1;
        return entry.RealizedPnL;
      });

      const failedJournals = [];

      for (const journalId of journalsIds) {
        const journal = _find(allJournals, function (o) {
          return o.Id === journalId;
        });

        if (_isNil(journal)) break;

        const currentBalance = this.getBalance(journal) + totalPnl;

        if (currentBalance < 0) {
          const totalPnL =
            Math.round((Math.abs(totalPnl) + Number.EPSILON) * 100) / 100;

          this.$noty.error(
            `Trade can't be ${
              this.isEdit ? "updated" : "added"
            }. With the total loss of ${
              this.currentCurrency.symbol
            }${totalPnL}, the current balance of the journal: ${
              journal.Name
            } will exceed below zero.`,
            {
              killer: false,
              timeout: 15000,
            },
          );

          this.warningJournalIds.push(journal.Id);
          failedJournals.push(journal);
        }
      }

      if (failedJournals.length > 0) {
        if (failedJournals.length > 1) this.selectJournalDialogVisible = true;
        this.apiCallLoading = false;
        return;
      } else {
        this.warningJournalIds = [];
      }

      for (const journalId of journalsIds) {
        const _trade = _cloneDeep(trade);
        _trade.TradingJournalId = journalId;
        if (this.isEdit) {
          const successCall = await this.updateTrade(_trade);
          if (successCall) success++;
        } else {
          const successCall = await this.createTrade(_trade);
          if (successCall) success++;
        }
      }

      if (success === journalsIds.length) {
        const message = `Trade${
          journalsIds.length > 1 ? "s" : ""
        } has successfully been ${this.isEdit ? "updated" : "added"}.`;
        this.$noty.success(message);

        if (this.isLoggedIn) {
          await this.reloadUser();
        }

        this.apiCallLoading = false;
        this.$emit("primary-button");
      } else {
        this.apiCallLoading = false;
      }
    },
    getBalance(tradingJournal) {
      const totalPnL = _sumBy(tradingJournal.Trades, (trade) => {
        if (
          trade.Status !== tradeStatusConstants.IS_ONGOING_TRADE &&
          trade.Status !== tradeStatusConstants.IS_SETUP
        ) {
          return _sumBy(trade.Entries, (entry) => {
            if (_isNil(entry.RealizedPnL)) return 0;
            return entry.RealizedPnL;
          });
        }
        return 0;
      });

      return tradingJournal.StartBalance + totalPnL;
    },
    async reloadUser() {
      const payload = {
        params: {},
        endpoint: "/user?initial=false",
        method: "GET",
        getResponse: true,
        doubleCheck: true,
      };

      const token = sessionStorage.getItem("token");
      if (token) this.homeAPIStore.setBearerToken(token);

      const response = await this.homeAPIStore.getRequest(payload);

      if (response.code === "ERR_NETWORK") {
        this.$noty.error(
          `Something went wrong with the server. Some features will be limited.`,
        );
        this.homeAPIStore.setServerState(false);
        this.homeAPIStore.setLoginState(false);
      } else if (
        response.status === 200 &&
        !_isNil(response.data.Id) &&
        response.data.Id.length === 36
      ) {
        this.homeAPIStore.setLoginState(true);
        this.homeAPIStore.setUserState(response.data);
      } else {
        this.homeAPIStore.setServerState(false);
        this.homeAPIStore.setLoginState(false);
      }
    },
    loadSettings() {
      if (_isNil(this.userSettings)) {
        this.entries = [
          {
            Id: 1,
            IsCreated: true,
            CreatedAt: null,
            EntryPrice: null,
            IsHedge: false,
            OrderType: 1,
            Quantity: null,
            RealizedPnL: null,
            Status: 0,
            Stoploss: null,
            TakeProfit: null,
            Commission: null,
            TradeId: null,
            InclExclFees: true,
          },
        ];
        return;
      }
      const settings = this.userSettings.TradingJournalOption;
      this.fields.leverage.value = settings.DefaultTradeLeverage;

      if (this.currentJournal.OptimizeForCFD)
        this.fields.direction.value =
          settings.DefaultTradeDirection === "Buy" ? "Long" : "Short";
      else this.fields.direction.value = settings.DefaultTradeDirection;

      this.fields.symbol.value = settings.DefaultTradeSymbol;
      this.fields.status.value =
        tradeStatusTranslation[settings.DefaultTradeStatus];

      this.statusChange(
        tradeStatusTranslation[settings.DefaultTradeStatus],
        "Closed",
        false,
      );

      this.entries = [
        {
          Id: 1,
          IsCreated: true,
          CreatedAt: null,
          EntryPrice: null,
          IsHedge: false,
          OrderType: settings.DefaultTradeOrderType,
          Quantity: null,
          RealizedPnL: null,
          Status: 0,
          Stoploss: null,
          TakeProfit: null,
          Commission: null,
          TradeId: null,
          InclExclFees: true,
        },
      ];
    },
    async statusChange(newValue, oldValue, showDialog = true) {
      if (newValue === "Ongoing" && showDialog) {
        try {


        } catch (ex) {
          this.fields.status.value = oldValue;
          return;
        }
      }

      this.fields.close_trade_at.visible = newValue !== "Ongoing";
      this.fields.close_trade_at.required = newValue !== "Setup";
      this.fields.close_trade_at.warning = false;

      this.entryFields.status.items[
        _findIndex(
          this.entryFields.status.items,
          (o) => o.id === entryStatusConstants.IS_UNREALIZED,
        )
      ].visible = newValue === "Ongoing";
      this.entryFields.status.items[
        _findIndex(
          this.entryFields.status.items,
          (o) => o.id === entryStatusConstants.IS_TAKE_PROFIT,
        )
      ].visible = newValue !== "Ongoing";
      this.entryFields.status.items[
        _findIndex(
          this.entryFields.status.items,
          (o) => o.id === entryStatusConstants.IS_STOP_LOSS,
        )
      ].visible = newValue !== "Ongoing";
      this.entryFields.status.items[
        _findIndex(
          this.entryFields.status.items,
          (o) => o.id === entryStatusConstants.IS_BREAK_EVEN,
        )
      ].visible = newValue !== "Ongoing";

      if (newValue === "Ongoing") {
        this.fields.close_trade_at.warning = false;
        this.fields.close_trade_at.value = null;
        this.entryFields.realized_pnl.value = "";
        this.entryFields.take_profit.value = "";
        this.entryFields.stop_loss.value = "";
        this.entryFields.status.value = "Unrealized";

        _forEach(this.entries, function (entry) {
          entry.Status = entryStatusConstants.IS_UNREALIZED;
          entry.RealizedPnL = null;
          entry.Stoploss = null;
          entry.TakeProfit = null;
        });
      } else if (this.entryFields.status.value === "Unrealized") {
        this.entryFields.status.value = "Take-profit";
        _forEach(this.entries, function (entry) {
          entry.Status = entryStatusConstants.IS_TAKE_PROFIT;
        });
      }
    },
    async createTrade(trade) {
      trade.IsReadOnly = false;

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: trade,
          endpoint: "/tradingjournal/create-trade",
          method: "post",
          getResponse: true,
        };

        this.apiCallLoading = true;
        const response = await this.homeAPIStore.postRequest(payload);

        if (
          response.status === 200 &&
          !_isNil(response.data) &&
          response.data.Id.length === 36
        ) {
          const trade = response.data;
          if (this.hasChangedAttachments) await this.handleAttachments(trade);
          if (this.hasChangedEntries) await this.handleEntries(trade);
          if (this.hasChangedTags) await this.handleTags(trade);

          return true;
        } else if (response.data.includes("unique name")) {
          this.$noty.info(
            `Sorry this name does already exist. Please choose an unique name.`,
          );
        } else if (response.data.includes("Maximum")) {
          this.$noty.info(response.data);
        } else if (response.data.length > 0) {
          this.$noty.info(response.data);
        } else {
          this.$noty.error(
            `Something went wrong with creating the trade. Please try it again later.`,
          );
        }
      } else {
        const journals = _cloneDeep(this.allJournals);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === trade.TradingJournalId,
        );
        trade.Id = this.windowConfig.generateId();
        trade.CreatedAt = this.windowConfig.getCurrentDateTime();
        trade.Tags = [];
        trade.Entries = [];
        trade.Attachments = [];
        trade.Improvements = [];
        trade.OpenTradeAt = moment(trade.OpenTradeAt).format(
          "YYYY-MM-DD HH:mm:ss.SSSSSSS",
        );
        if (!_isNil(trade.CloseTradeAt))
          trade.CloseTradeAt = moment(trade.CloseTradeAt).format(
            "YYYY-MM-DD HH:mm:ss.SSSSSSS",
          );

        journals[currentJournalIndex].Trades.push(trade);
        this.homeAPIStore.setDemoTrades(journals, true);

        if (this.hasChangedAttachments) await this.handleAttachments(trade);
        if (this.hasChangedEntries) await this.handleEntries(trade);
        if (this.hasChangedTags) await this.handleTags(trade);
        return true;
      }

      return false;
    },
    setSymbols(newValue, oldValue) {
      _forEach(this.fields, function (field) {
        if (field.hasPrefix && field.prefixText === oldValue) {
          field.prefixText = newValue;
        }
      });
    },
    async updateTrade(trade) {
      delete trade.TotalTags;
      delete trade.TradeDuration;
      delete trade.Files;
      delete trade.RiskRewardRatio;

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: trade,
          endpoint: "/tradingjournal/update-trade",
          method: "post",
          getResponse: true,
        };

        const response = await this.homeAPIStore.postRequest(payload);

        if (
          response.status === 200 &&
          !_isNil(response.data.Id) &&
          response.data.Id.length === 36
        ) {
          const trade = response.data;
          if (this.hasChangedAttachments) await this.handleAttachments(trade);
          if (this.hasChangedEntries) await this.handleEntries(trade);
          if (this.hasChangedTags) await this.handleTags(trade);

          return true;
        } else if (response.data.length > 0) {
          this.$noty.info(response.data);
        } else {
          this.$noty.error(
            `Something went wrong with updating the trade. Please try it again later.`,
          );
        }
      } else {
        const journals = _cloneDeep(this.allJournals);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === trade.TradingJournalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === trade.Id,
        );

        const oldTrade = _cloneDeep(
          journals[currentJournalIndex].Trades[currentTradeIndex],
        );
        trade.Tags = oldTrade.Tags;
        trade.Entries = oldTrade.Entries;
        trade.Attachments = oldTrade.Attachments;
        trade.Improvements = oldTrade.Improvements;

        journals[currentJournalIndex].Trades[currentTradeIndex] = trade;
        this.homeAPIStore.setDemoTrades(journals, true);

        if (this.hasChangedAttachments) await this.handleAttachments(trade);
        if (this.hasChangedEntries) await this.handleEntries(trade);
        if (this.hasChangedTags) await this.handleTags(trade);
        return true;
      }

      return false;
    },
    async handleAttachments(trade) {
      for (const attachment of this.newAttachments) {
        attachment.TradeId = trade.Id;
        await this.addAttachment(attachment, trade.TradingJournalId);
      }

      for (const attachment of this.existingLinks) {
        await this.updateAttachmentNow(attachment, trade.TradingJournalId);
      }

      for (const attachment of this.attachmentToRemoved) {
        await this.removeAttachmentNow(attachment, trade.TradingJournalId);
      }
    },
    async handleTags(trade) {
      for (const tag of this.existingTags) {
        tag.TradeId = trade.Id;
        await this.addOrSaveOrDeleteTagNow(
          tag,
          false,
          trade.Id,
          trade.TradingJournalId,
        );
      }

      for (const tag of this.newTags) {
        tag.TradeId = trade.Id;
        delete tag.Id;
        await this.addOrSaveOrDeleteTagNow(
          tag,
          false,
          trade.Id,
          trade.TradingJournalId,
        );
      }

      for (const tag of this.tagsToRemoved) {
        tag.TradeId = trade.Id;
        await this.addOrSaveOrDeleteTagNow(
          tag,
          true,
          trade.Id,
          trade.TradingJournalId,
        );
      }
    },
    async handleEntries(trade) {
      _forEach(this.entries, function (entry) {
        entry.TradeId = trade.Id;

        if (!entry.InclExclFees) {
          entry.RealizedPnL = entry.RealizedPnL - entry.CommissionFees;
        }

        if (
          entry.Status === entryStatusConstants.IS_BREAK_EVEN ||
          entry.Status === entryStatusConstants.IS_UNREALIZED
        ) {
          entry.TakeProfit = null;
          entry.Stoploss = null;
          entry.RealizedPnL = 0;
        }
        if (entry.Status === entryStatusConstants.IS_STOP_LOSS) {
          entry.RealizedPnL = entry.RealizedPnL * -1;
        } else {
          entry.RealizedPnL = Math.abs(entry.RealizedPnL);
        }
      });

      const createdEntries = _filter(this.entries, function (c) {
        return c.IsCreated;
      });

      const updatedEntries = _filter(this.entries, function (c) {
        return !c.IsCreated;
      });

      if (createdEntries.length > 0) {
        for (const entry of createdEntries) {
          entry.Id = this.windowConfig.generateId();
          entry.CreatedAt = this.windowConfig.getCurrentDateTime();
          entry.TradeId = trade.Id;
        }

        await this.addOrSaveOrDeleteEntryNow(
          createdEntries,
          "create",
          trade.Id,
          trade.TradingJournalId,
        );
      }

      if (updatedEntries.length > 0) {
        await this.addOrSaveOrDeleteEntryNow(
          updatedEntries,
          "update",
          trade.Id,
          trade.TradingJournalId,
        );
      }

      if (this.removedEntries.length > 0) {
        await this.addOrSaveOrDeleteEntryNow(
          this.removedEntries,
          "delete",
          trade.Id,
          trade.TradingJournalId,
        );
      }
    },
    async addAttachment(options, journalId) {
      const attachment = {
        TradeId: options.TradeId,
        Link: "",
        Type: options.type,
        FilePath: "",
        File: "",
      };

      if (options.type === attachmentStatus.IS_FILE) {
        attachment.FileExtention = options.data.FileExtension;
        attachment.File = options.data.Base64;
      } else {
        attachment.Link = options.data;
      }

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: attachment,
          endpoint: "/tradingjournal/create-attachment",
          method: "post",
          getResponse: true,
        };

        try {
          const response = await this.homeAPIStore.postRequest(payload);

          if (response.data !== "Success") {
            this.$noty.info(response.data);
          }
        } catch (_) {
          this.$noty.error(
            `Something went wrong with ${
              options.type === 1 ? "uploading" : "attaching"
            } this ${
              options.type === 1 ? "image" : "link"
            }. Please try it again later.`,
          );
        }
      } else {
        const journals = _cloneDeep(this.homeAPIStore.demoTrades);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === journalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === attachment.TradeId,
        );

        attachment.Id = this.windowConfig.generateId();
        attachment.CreatedAt = this.windowConfig.getCurrentDateTime();

        if (options.type === attachmentStatus.IS_FILE) {
          attachment.FilePath = attachment.File;
          attachment.Local = true;
        }

        journals[currentJournalIndex].Trades[
          currentTradeIndex
        ].Attachments.push(attachment);
        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },
    addLink(link) {
      const _link = _cloneDeep(link);
      _link.id = this.generateRandomId();
      this.hasChangedAttachments = true;
      this.newAttachments.unshift(_link);
      this.hasChanged = true;
    },
    removeAttachment(opt) {
      this.hasChangedAttachments = true;

      if (opt.id.length > 10) {
        this.attachmentToRemoved.push(opt);
        if (opt.type === attachmentStatus.IS_FILE) {
          this.existingFiles = _filter(
            this.existingFiles,
            (file) => file.id !== opt.id,
          );
        } else if (opt.type === attachmentStatus.IS_LINK) {
          this.existingLinks = _filter(
            this.existingLinks,
            (file) => file.id !== opt.id,
          );
        }
      } else {
        this.newAttachments = _filter(
          this.newAttachments,
          (attachment) => attachment.id !== opt.id,
        );
      }

      this.hasChanged = true;
    },

    async removeAttachmentNow(options, journalId) {
      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: { Id: options.id },
          endpoint: "/tradingjournal/remove-attachment",
          method: "post",
          getResponse: true,
        };

        if (_isNil(options.multiple)) options.multiple = false;

        try {
          const response = await this.homeAPIStore.postRequest(payload);

          if (response.data !== "Success") {
            this.$noty.info(response.data);
          }
        } catch (_) {
          const imageText = options.multiple ? "Images" : "Image";
          this.$noty.error(
            `Something went wrong with removing this ${
              options.type === attachmentStatus.IS_FILE ? imageText : "link"
            }. Please try it again later.`,
          );
        }
      } else {
        const journals = _cloneDeep(this.homeAPIStore.demoTrades);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === journalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === options.TradeId,
        );
        journals[currentJournalIndex].Trades[currentTradeIndex].Attachments =
          _filter(
            journals[currentJournalIndex].Trades[currentTradeIndex].Attachments,
            (e) => e.Id !== options.id,
          );

        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },
    updateAttachment(attachment) {
      this.hasChangedAttachments = true;
      if (attachment.Id.toString().length > 10) {
        const attachmentIndex = _findIndex(
          this.existingLinks,
          (e) => e.Id === attachment.Id,
        );
        this.existingLinks[attachmentIndex].Link = attachment.Link;
      } else {
        const attachmentIndex = _findIndex(
          this.newAttachments,
          (e) => e.id === attachment.Id,
        );
        this.newAttachments[attachmentIndex].data = attachment.Link;
      }
    },
    async updateAttachmentNow(attachment, journalId) {
      if (this.isLogged) {
        const payload = {
          params: {},
          body: attachment,
          endpoint: "/tradingjournal/update-attachment",
          method: "post",
          getResponse: true,
        };

        try {
          const response = await this.homeAPIStore.postRequest(payload);

          if (response.data !== "Success") {
            this.$noty.info(response.data);
          }

          this.hasChanged = true;
        } catch (_) {
          this.$noty.error(
            `Something went wrong with updating this ${
              attachment.Type === attachmentStatus.IS_FILE ? "image" : "link"
            }. Please try it again later.`,
          );
        }
      } else {
        const journals = _cloneDeep(this.homeAPIStore.demoTrades);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === journalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === attachment.TradeId,
        );
        const attachmentIndex = _findIndex(
          journals[currentJournalIndex].Trades[currentTradeIndex].Attachments,
          (e) => e.Id === attachment.Id,
        );
        journals[currentJournalIndex].Trades[currentTradeIndex].Attachments[
          attachmentIndex
        ] = attachment;

        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },
    addOrRemoveTag(tag, isDelete = false) {
      this.hasChangedTags = true;

      if (isDelete) {
        if (tag.IsCreated) {
          this.newTags = _filter(this.newTags, function (c) {
            return c.Id !== tag.Id;
          });
        } else {
          this.existingTags = _filter(this.existingTags, function (c) {
            return c.Id !== tag.Id;
          });
          this.tagsToRemoved.unshift(tag);
        }
      } else if (_isEmpty(this.currentTag)) {
        tag.Id = this.generateRandomId();
        tag.IsCreated = true;
        this.newTags.unshift(tag);
      } else if (tag.IsCreated) {
        const tagIndex = _findIndex(this.newTags, (e) => e.Id === tag.Id);
        this.newTags[tagIndex] = tag;
      } else {
        const tagIndex = _findIndex(this.existingTags, (e) => e.Id === tag.Id);
        this.existingTags[tagIndex] = tag;
      }

      this.refreshTags = true;

      this.hasChanged = true;
      this.closeTagDialog();

      setTimeout(() => {
        this.refreshTags = false;
      }, 1);
    },
    async addOrSaveOrDeleteEntryNow(entries, state, tradeId, journalId) {
      let successText;
      let errorText;
      let endpoint;

      if (state === "delete") {
        successText = "Successfully deleted this entry.";
        errorText = `Something went wrong with deleting this entry. Please try it again later.`;
        endpoint = "/tradingjournal/remove-entry";
      } else if (state === "create") {
        successText = "Successfully created the entry.";
        errorText = `Something went wrong with creating this entry. Please try it again later.`;
        endpoint = "/tradingjournal/create-entry";
      } else {
        successText = "Successfully updated the entry.";
        errorText = `Something went wrong with updating this entry. Please try it again later.`;
        endpoint = "/tradingjournal/update-entry";
      }

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: entries,
          endpoint: endpoint,
          method: "post",
          getResponse: true,
        };

        const response = await this.homeAPIStore.postRequest(payload);

        if (response.data === "Success") {
          return;
        } else if (response.status === 200) {
          this.$noty.info(response.data);
        } else if (response.data.includes("atleast")) {
          this.$noty.error(response.data);
        } else {
          this.$noty.error(errorText);
        }
      } else {
        const journals = _cloneDeep(this.homeAPIStore.demoTrades);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === journalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === tradeId,
        );

        if (state === "update") {
          _forEach(entries, function (entry) {
            const currentEntryIndex = _findIndex(
              journals[currentJournalIndex].Trades[currentTradeIndex].Entries,
              (o) => o.Id === entry.Id,
            );
            journals[currentJournalIndex].Trades[currentTradeIndex].Entries[
              currentEntryIndex
            ] = entry;
          });
        } else if (state === "delete") {
          _forEach(entries, function (entry) {
            journals[currentJournalIndex].Trades[currentTradeIndex].Entries =
              _filter(
                journals[currentJournalIndex].Trades[currentTradeIndex].Entries,
                (o) => o.Id !== entry.Id,
              );
          });
        } else {
          for (const entry of entries) {
            journals[currentJournalIndex].Trades[
              currentTradeIndex
            ].Entries.push(entry);
          }
        }

        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },
    async addOrSaveOrDeleteTagNow(tag, isDelete = false, tradeId, journalId) {
      let successText;
      let errorText;
      let endpoint;

      if (isDelete) {
        successText = "Successfully deleted this tag.";
        errorText = `Something went wrong with deleting this tag. Please try it again later.`;
        endpoint = "/tradingjournal/remove-tag";
      } else if (tag.IsCreated) {
        successText = "Successfully created the tag.";
        errorText = `Something went wrong with creating this tag. Please try it again later.`;
        endpoint = "/tradingjournal/create-tag";
      } else {
        successText = "Successfully updated the tag.";
        errorText = `Something went wrong with updating this tag. Please try it again later.`;
        endpoint = "/tradingjournal/update-tag";
      }

      if (this.isLoggedIn) {
        const payload = {
          params: {},
          body: tag,
          endpoint: endpoint,
          method: "post",
          getResponse: true,
        };

        const response = await this.homeAPIStore.postRequest(payload);

        if (response.data === "Success") {
          this.closeTagDialog();
        } else if (response.data.includes("unique tag")) {
          this.$noty.info(
            `One or multiple tags could not be created because each trade requires an unique tag name.`,
          );
        } else {
          this.$noty.error(errorText);
        }
      } else {
        const journals = _cloneDeep(this.homeAPIStore.demoTrades);
        const currentJournalIndex = _findIndex(
          journals,
          (o) => o.Id === journalId,
        );
        const currentTradeIndex = _findIndex(
          journals[currentJournalIndex].Trades,
          (o) => o.Id === tradeId,
        );

        if (isDelete) {
          journals[currentJournalIndex].Trades[currentTradeIndex].Tags =
            _filter(
              journals[currentJournalIndex].Trades[currentTradeIndex].Tags,
              (o) => o.Id !== tag.Id,
            );
        } else if (tag.IsCreated) {
          tag.Id = this.windowConfig.generateId();
          tag.CreatedAt = this.windowConfig.getCurrentDateTime();
          journals[currentJournalIndex].Trades[currentTradeIndex].Tags.push(
            tag,
          );
        } else {
          const tagIndex = _findIndex(
            journals[currentJournalIndex].Trades[currentTradeIndex].Tags,
            (e) => e.Id === tag.Id,
          );
          journals[currentJournalIndex].Trades[currentTradeIndex].Tags[
            tagIndex
          ] = tag;
        }

        this.homeAPIStore.setDemoTrades(journals, false);
      }
    },
    async onValueChange(_field, newValue) {
      const field = _find(this.fields, function (o) {
        return o.key === _field.key;
      });

      if (
        (field.field === "input" || field.field === "auto-complete") &&
        (newValue.length > _field.maxLength ||
          (newValue === 0 && newValue !== ""))
      ) {
        this.fields[field.key].warning = true;
      } else {
        this.fields[field.key].warning = false;
      }

      if (_field.fullCaps) newValue = newValue.toUpperCase();
      this.fields[field.key].value = newValue;

      if (_field.key === "close_trade_at" || _field.key === "open_trade_at") {
        if (
          _field.key === "open_trade_at" &&
          this.fields.close_trade_at.visible
        ) {
          this.fields.close_trade_at.value =
            this.addOneHourToDatetime(newValue);
        }

        if (this.fields.close_trade_at.visible) {
          const open = moment(this.fields.open_trade_at.value);
          const close = moment(this.fields.close_trade_at.value);
          this.fields.close_trade_at.warning = open.isAfter(close);
          if (open.isAfter(close)) {
            this.$noty.error(
              `'Close trade at' should be earlier than the 'Open trade at'.`,
            );
          }
        }

        const newValueDateTime = moment(newValue);
        const currentDateTime = moment();
        if (newValueDateTime.isAfter(currentDateTime)) {
          this.$noty.error(
            `${_field.messageLabel} should not be later than the current time.`,
          );
          this.fields[field.key].warning = true;
        }
      }

      if (!this.loading) {
        this.hasChanged = true;
      }
    },

    async onValueChangeEntryFields(_field, newValue) {
      if (this.blockOnValueChange) return;
      this.hasChangedEntries = true;

      const field = _find(this.entryFields, function (o) {
        return o.key === _field.key;
      });

      if (
        (field.field === "input" || field.field === "auto-complete") &&
        (newValue.length > _field.maxLength ||
          (newValue === 0 && newValue !== ""))
      ) {
        this.entryFields[field.key].warning = true;
      } else {
        this.entryFields[field.key].warning = false;
      }

      if (_field.fullCaps) newValue = newValue.toUpperCase();

      this.entryFields[field.key].value = newValue;
      try {
        this.entries[this.tabIndex][field.modelKey] = newValue;
      } catch (_) {}

      if (field.field === "select-options") {
        try {
          const currentSelected = _find(field.items, function (o) {
            return o.text === newValue;
          });

          this.entries[this.tabIndex][field.modelKey] = currentSelected.id;
        } catch (_) {}
      }

      this.debouncedCheckWarningEntry();

      if (!this.loading) {
        this.hasChanged = true;
      }
    },
    checkWarningEntry() {
      const entry = this.entries[this.tabIndex];
      const entryPrice = parseFloat(entry.EntryPrice);
      const takeProfit = parseFloat(entry.TakeProfit);
      const stopLoss = parseFloat(entry.Stoploss);
      const direction = this.fields.direction.value;
      const isBuy = direction === "Long" || direction === "Buy";
      const isSell = direction === "Short" || direction === "Sell";

      if (!_isNaN(takeProfit) && isBuy) {
        this.entryFields.take_profit.warning = entryPrice >= takeProfit;
      } else if (
        entry.Status === entryStatusConstants.IS_TAKE_PROFIT &&
        !_isNaN(takeProfit) &&
        isSell
      ) {
        this.entryFields.take_profit.warning = entryPrice <= takeProfit;
      }

      if (!_isNaN(stopLoss) && isBuy) {
        this.entryFields.stop_loss.warning = entryPrice <= stopLoss;
      } else if (!_isNaN(stopLoss) && isSell) {
        this.entryFields.stop_loss.warning = entryPrice >= stopLoss;
      }
    },
    openImageUploadDialog() {
      const count = _size(this.files);
      if (count >= 3) {
        this.$noty.info(`Per trade there is only 3 images allowed.`);
      } else {
        this.uploadImageDialogVisible = true;
      }
    },
    uploadImage(event) {
      try {
        const tradeId = !_isNil(this.trade.Id) ? this.trade.Id : null;
        const id = this.generateRandomId();
        this.newAttachments.unshift({
          id,
          tradeId: tradeId,
          data: {
            Base64: event.data.Base64,
            FileExtension: event.data.FileExtension,
          },
          type: 1,
        });
        this.$noty.info(`Image is stored. Click save to add it to the trade.`);
        this.hasChanged = true;
        this.uploadImageDialogVisible = false;
        this.hasChangedAttachments = true;
      } catch (_) {
        this.$noty.error(
          `There was an error getting info about this image. Please try it again later.`,
        );
      }
    },
    getFloat(value) {
      if (value === "") return null;
      return parseFloat(value);
    },
    getFieldNumber(value) {
      if (_isNil(value)) return "";
      else if (value === 0) return "";
      else return value.toString().replace(",", ".");
    },
    getRealizedPnL(value) {
      if (this.fields.status.value === "Ongoing") return 0;
      else if (this.fields.realized_pnl.value === "") return "";
      else {
        this.getFloat(Math.abs(value));
      }
    },
    convertDateTime(value) {
      if (value === "" || _isNil(value)) return null;
      return value;
    },
    resetInput() {
      const direction = this.fields.direction.value;
      this.fields = _cloneDeep(createTradeLib.FIELDS_DATA);
      this.entryFields = _cloneDeep(
        createTradeLib.default.getEntryFields(this.currentCurrency.symbol),
      );

      this.fields.direction.value = direction;

      if (this.currentJournal.OptimizeForCFD) {
        this.fields.direction.value = "Long";
        this.fields.direction.items = [
          { id: "Buy", text: "Long" },
          { id: "Sell", text: "Short" },
        ];
      } else {
        this.fields.direction.items = [{ id: "Buy", text: "Buy" }];
      }

      this.rating = 0;
      this.note = "";
    },
    getStatus(statusText) {
      switch (statusText) {
        case "Closed":
          return tradeStatusConstants.IS_CLOSED_TRADE;
        case "Ongoing":
          return tradeStatusConstants.IS_ONGOING_TRADE;
        case "Setup":
          return tradeStatusConstants.IS_SETUP;
      }

      return tradeStatusConstants.IS_SETUP;
    },
    setEntryFieldsValues(newTabIndex = null) {
      const tabIndex = _isNil(newTabIndex) ? this.tabIndex : newTabIndex;
      const entry = this.entries[tabIndex];

      this.entryFields.status.value = entryStatusTranslations[entry.Status];
      this.entryFields.realized_pnl.value = !_isNil(entry.RealizedPnL)
        ? this.toString(Math.abs(entry.RealizedPnL))
        : "";

      this.entryFields.quantity.value = this.toString(entry.Quantity);
      this.entryFields.entry_price.value = this.toString(entry.EntryPrice);
      this.entryFields.take_profit.value = this.toString(entry.TakeProfit);
      this.entryFields.stop_loss.value = this.toString(entry.Stoploss);
      this.entryFields.order_type.value =
        orderTypeTranslation[entry.OrderType] + " order";
      this.entryFields.is_hedge.value = entry.IsHedge;
      this.entryFields.commission_fees.value = this.toString(
        entry.CommissionFees,
      );

      this.entryFields.incl_excl_commission_fees.value = _find(
        this.entryFields.incl_excl_commission_fees.items,
        function (o) {
          return o.id === entry.InclExclFees;
        },
      ).text;

      this.entryFields.take_profit.required =
        entry.Status === entryStatusConstants.IS_TAKE_PROFIT;
      this.entryFields.stop_loss.required =
        entry.Status === entryStatusConstants.IS_STOP_LOSS;
      this.entryFields.take_profit.visible =
        entry.Status !== entryStatusConstants.IS_BREAK_EVEN &&
        entry.Status !== entryStatusConstants.IS_UNREALIZED;
      this.entryFields.stop_loss.visible =
        entry.Status !== entryStatusConstants.IS_BREAK_EVEN &&
        entry.Status !== entryStatusConstants.IS_UNREALIZED;

      this.setStatusCheck(this.entryFields.status.value, "", tabIndex);
      this.debouncedCheckWarningEntry();
    },
    setStatusCheck(newValue, oldValue, tabIndex) {
      _forEach(this.entryFields, function (field) {
        if (field.key === "take_profit" || field.key === "stop_loss")
          field.warning = false;
      });

      this.entryFields.take_profit.required =
        newValue ===
        entryStatusTranslations[entryStatusConstants.IS_TAKE_PROFIT];
      this.entryFields.stop_loss.required =
        newValue === entryStatusTranslations[entryStatusConstants.IS_STOP_LOSS];
      this.entryFields.take_profit.visible =
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_BREAK_EVEN] &&
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_UNREALIZED];
      this.entryFields.stop_loss.visible =
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_BREAK_EVEN] &&
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_UNREALIZED];
      this.entryFields.realized_pnl.visible =
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_BREAK_EVEN] &&
        newValue !==
          entryStatusTranslations[entryStatusConstants.IS_UNREALIZED];
      this.entryFields.realized_pnl.required =
        this.fields.status.value !==
          tradeStatusTranslation[tradeStatusConstants.IS_SETUP] &&
        this.entryFields.realized_pnl.visible;

      if (
        newValue ===
          entryStatusTranslations[entryStatusConstants.IS_BREAK_EVEN] ||
        newValue === entryStatusTranslations[entryStatusConstants.IS_UNREALIZED]
      ) {
        this.entryFields.realized_pnl.value = "0";
        this.entries[tabIndex].RealizedPnL = 0;
      }

      if (
        oldValue ===
          entryStatusTranslations[entryStatusConstants.IS_BREAK_EVEN] ||
        oldValue === entryStatusTranslations[entryStatusConstants.IS_UNREALIZED]
      ) {
        this.entryFields.realized_pnl.value = "";
      }
    },
    onActivateTab(newTabIndex, prevTabIndex, bvEvent) {
      this.blockOnValueChange = true;

      const warningFieldsEntries = _filter(
        this.entryFields,
        (field) => field.warning,
      );
      if (!_isEmpty(warningFieldsEntries)) {
        this.$noty.error("Please fill in the required fields.");
        bvEvent.preventDefault();
      } else {
        _forEach(this.entryFields, function (field) {
          field.warning = false;
        });
        this.setEntryFieldsValues(newTabIndex);
      }

      setTimeout(() => {
        this.blockOnValueChange = false;
      }, 100);
    },
    toString(value) {
      if (_isNil(value)) return "";
      else return value.toString().replace("-", "");
    },
    showTagDialog() {
      this.currentTag = {};
      this.tagDialogVisible = true;
    },
    openTagDialog(tag) {
      this.currentTag = tag;
      this.tagDialogVisible = true;
    },
    closeTagDialog() {
      this.currentTag = {};
      this.tagDialogVisible = false;
    },
    generateRandomId() {
      const randomCode = Math.floor(Math.random() * 900000) + 100000;
      const id = randomCode.toString();
      return id;
    },
    async exitDialog() {
      if (this.isEdit && this.hasChanged) {
        this.dialogOpen = true;

        try {
          this.dialogOpen = false;
          this.$emit("secondary-button");
        } catch (ex) {
          this.dialogOpen = false;
          return;
        }
      } else {
        this.$emit("secondary-button");
      }
    },
    async removeEntry(index) {
      const state = this.blockSwitchTab();
      if (!state) return;

      this.hasChangedEntries = true;
      const _entry = this.entries[index];

      if (_isNil(_entry.IsCreated)) {
        try {
          this.dialogOpen = true;

          this.removedEntries.push(_entry);
          this.dialogOpen = false;
        } catch (ex) {
          this.dialogOpen = false;
          return;
        }
      }

      this.entries = _filter(this.entries, function (entry) {
        return entry.Id !== _entry.Id;
      });

      this.tabIndex = this.entries.length - 1;
    },
    blockSwitchTab() {
      this.blockOnValueChange = true;

      setTimeout(() => {
        this.blockOnValueChange = false;
      }, 100);

      _forEach(this.entryFields, function (field) {
        if (
          field.required &&
          field.visible &&
          (field.value === "" || field.value === null)
        )
          field.warning = true;
        else field.warning = false;
      });

      const warningFieldsEntries = _filter(
        this.entryFields,
        (field) => field.warning,
      );

      if (!_isEmpty(warningFieldsEntries)) {
        this.$noty.error("Please fill in the required fields.");
        return false;
      }

      return true;
    },
    addEntry() {
      const state = this.blockSwitchTab();
      if (!state) return;

      this.hasChangedEntries = true;
      const lastEntry = _cloneDeep(this.entries[this.entries.length - 1]);

      const newEntry = {
        ...lastEntry,
        ...{
          Id: lastEntry.Id + 1,
          EntryPrice: null,
          TakeProfit: null,
          RealizedPnL: null,
          InclExclFees: true,
          CommissionFees: null,
          Quantity: null,
          Stoploss: null,
          IsHedge: false,
          IsCreated: true,
        },
      };

      this.entries.push(newEntry);
      this.justCreatedEntry = true;
      setTimeout(() => {
        this.tabIndex = this.entries.length - 1;
        this.blockOnValueChange = false;
      }, 1);

      setTimeout(() => {
        this.justCreatedEntry = false;
      }, 100);
    },
    sanitizeInput(event) {
      this.note = sanitizeHtml(event);
    },
    revertChanges() {
      this.loading = true;
      this.isLoaded = false;
      this.loadTrade(false);
    },
    addOneHourToDatetime(inputDatetime = null) {
      // If inputDatetime is null, use the current time; otherwise, use the provided datetime
      const inputMoment = inputDatetime
        ? moment(inputDatetime, "YYYY-MM-DDTHH:mm")
        : moment();

      // Add 1 hour to the input datetime
      const newTime = inputMoment.add(1, "hours");

      // Format the new time in the desired format
      const resultDatetime = newTime.format("YYYY-MM-DDTHH:mm");

      return resultDatetime;
    },

    async handleKeyDown(event) {
      if (
        this.uploadImageDialogVisible ||
        this.selectJournalDialogVisible ||
        this.tagDialogVisible ||
        this.addLinkDialogVisible ||
        this.removeImageDialogVisible
      )
        return;

      if (event.key === "Escape" && !this.dialogOpen) {
        // this.$refs.exitButton.click();
        // this.debouncedExitDialog()
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-body {
  max-height: 500px;
  overflow-y: auto;
  padding-right: 25px !important;
  margin-bottom: 15px;

  tr {
    display: flex;
    justify-content: space-between;

    &.is-larger {
      margin: 10px 0px;
    }
  }

  .input-field {
    display: flex;
    width: 100%;
    justify-content: flex-end;

    .test {
      position: absolute;
    }
    &.checkbox {
      padding-top: 5px;
    }
  }

  .rating {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    p {
      margin-bottom: 0;
    }
  }

  .label-field {
    width: 210px;
    height: 50px;
    &.has-help-button {
      display: flex;
      gap: 10px;
    }

    &.is-larger {
      display: flex;
      align-items: center;
    }
  }
}

.header-actions {
  display: flex;
  gap: 10px;
  margin-left: 30px;

  .button.add-padding {
    border-radius: 15px;
    padding: 3px 20px !important;
  }

  .icon.action {
    cursor: pointer;
  }
}

.tag-container {
  width: fit-content;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 0 10px 0 0;
    max-width: 292px;
    width: max-content;

    .tag {
      cursor: pointer;
      display: flex;
      gap: 10px;
      align-items: center;
    }
  }

  .add-container {
    width: 30px;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
    justify-content: center;
  }
}

.entries {
  width: 330px;
  height: auto;
  display: flex;

  .entry-container {
    width: 100%;
    display: flex;
    justify-content: space-between;
    .label-container {
      display: flex;
      gap: 30px;
    }
    .action-container {
      display: flex;
    }
  }
}

.active > .entry-label {
  color: black !important;
}

.entry-label {
  color: black;
  display: flex;
  &.is-dark-mode {
    color: white;
  }
}

.required-star {
  left: 10px;
  bottom: 8px;
  position: relative;
}

.add-multiple {
  height: 90%;
  width: 50px;
  position: absolute;
  top: 1.7px;
  right: 0px;
}

.dot {
  float: unset;
  position: relative;
  left: 10px;
}
</style>
