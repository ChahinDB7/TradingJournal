<template>
  <div>
    <ClientOnly>
      <div v-show="!isLoadingData">
        <ui-table
          ref="ui-table"
          v-model="selectedRows"
          :data="data"
          :thead="thead"
          :tbody="tbody"
          :sort-icon-align-end="true"
          :default-col-width="100"
          :fullwidth="fullWidth"
          :scroll="{ y: 10 }"
          :row-checkbox="rowCheckbox"
          :selected-key="selectedKey"
          class="data-table-balm-ui background-transition"
          :class="{ 'is-dark-mode': darkMode, 'small-table': smallTable }"
        >
          <template #direction="{ data }">
            <div style="display: flex">
              <div>
                {{
                  journal.OptimizeForCFD && data.Direction === "Buy"
                    ? "Long"
                    : journal.OptimizeForCFD && data.Direction === "Sell"
                    ? "Short"
                    : data.Direction
                }}
              </div>
              <Icon
                :name="
                  data.Direction === 'Buy' ? 'trending-up' : 'trending-down'
                "
                :width="24"
                :height="15"
                current-color
              />
            </div>
          </template>
          <template #entry_price="{ data }">
            <ul
              class="ul-list entry-price flex column"
              :class="{ multiple: data.Entries.length > 1 }"
            >
              <li v-for="(entry, index) in data.Entries" :key="entry.id">
                {{ entry.EntryPrice }}
              </li>
            </ul>
          </template>
          <template #exit_price="{ data }">
            <ul class="ul-list exit flex column">
              <li
                v-for="(entry, index) in data.Entries"
                :key="entry.id"
                class="flex"
              >
                <div class="flex column">
                  <div
                    :class="{
                      'is-dark-mode': darkMode,
                      hidden:
                        entry.Status === entryStatusConstants.IS_BREAK_EVEN ||
                        entry.TakeProfit === null,
                    }"
                    class="entry"
                  >
                    <span class="tpsl">TP:</span>
                    <span
                      :class="{
                        'is-dark-mode': darkMode,
                        'is-positive':
                          entry.Status === entryStatusConstants.IS_TAKE_PROFIT,
                      }"
                      >{{
                        entry.TakeProfit !== null
                          ? `${entry.TakeProfit}`
                          : "N/A"
                      }}</span
                    >
                    <Icon
                      v-if="
                        entry.Status === entryStatusConstants.IS_TAKE_PROFIT &&
                        entry.Stoploss !== null
                      "
                      name="checkmark"
                    />
                  </div>
                  <div
                    :class="{
                      'is-dark-mode': darkMode,
                      hidden:
                        entry.Status === entryStatusConstants.IS_BREAK_EVEN ||
                        entry.Stoploss === null,
                    }"
                    class="entry"
                  >
                    <span class="tpsl">SL:</span>
                    <span
                      :class="{
                        'is-dark-mode': darkMode,
                        'is-negative':
                          entry.Status === entryStatusConstants.IS_STOP_LOSS,
                      }"
                      >{{
                        entry.Stoploss !== null ? `${entry.Stoploss}` : "N/A"
                      }}</span
                    >
                    <Icon
                      v-if="
                        entry.Status === entryStatusConstants.IS_STOP_LOSS &&
                        entry.TakeProfit !== null
                      "
                      name="checkmark"
                    />
                  </div>
                  <div
                    v-if="entry.Status === entryStatusConstants.IS_BREAK_EVEN"
                    class="entry"
                    :class="{ 'is-dark-mode': darkMode }"
                  >
                    Break-even
                  </div>
                </div>
              </li>
            </ul>
          </template>
          <template #status="{ data }">
            <div>
              <span
                v-if="
                  data.Status === tradeStatusConstants.IS_CLOSED_TRADE &&
                  data.RealizedPnL > 0
                "
                class="tag fixed"
                :style="[statusStyle(tradeStatusConstants.IS_WIN_TRADE)]"
                >{{
                  tradeStatusTranslation[tradeStatusConstants.IS_WIN_TRADE]
                }}</span
              >
              <span
                v-else-if="
                  data.Status === tradeStatusConstants.IS_CLOSED_TRADE &&
                  data.RealizedPnL < 0
                "
                class="tag fixed"
                :style="[statusStyle(tradeStatusConstants.IS_LOSS_TRADE)]"
                >{{
                  tradeStatusTranslation[tradeStatusConstants.IS_LOSS_TRADE]
                }}</span
              >
              <span
                v-else
                class="tag fixed"
                :style="[statusStyle(data.Status)]"
                >{{ tradeStatusTranslation[data.Status] }}</span
              >
            </div>
          </template>
          <template #rating="{ data }">
            <div>
              <ClientOnly>
                <StarsRatings :star-size="16" :value="data.Rating" read-only />
              </ClientOnly>
            </div>
          </template>
          <template #note="{ data }">
            <div class="html-text is-thumb" v-html="data.Note" />
          </template>
          <template #tags="{ data }">
            <div class="tag-container">
              <div class="tags">
                <span
                  v-for="tag of data.Tags"
                  :key="tag.id"
                  class="tag"
                  :style="[windowConfig.getTagStyle(tag)]"
                  @click.self="$emit('open-tag', tag, data)"
                >
                  <span
                    class="no-select"
                    @click.self="$emit('open-tag', tag, data)"
                    >{{ tag.Name }}</span
                  >
                  <Icon
                    name="trash"
                    tooltip="Remove tag"
                    :width="18"
                    :height="18"
                    current-color
                    clickable
                    @click="$emit('remove-tag', tag, true)"
                  />
                </span>
                <div class="add-container">
                  <Icon
                    name="plus"
                    :width="18"
                    dont-show-on-scale
                    :height="18"
                    clickable
                    tooltip="Add tag"
                    @click="$emit('add-tag', data)"
                  />
                </div>
              </div>
            </div>
          </template>
          <template #attachments="{ data }">
            <div class="minimal-width">
              <Icon
                name="upload"
                :stroke="1.5"
                :height="20"
                :width="20"
                tooltip="Upload an image"
                clickable
                @click="openImageUploadDialog(data)"
              />
              <Icon
                :name="data.Links.length > 0 ? 'manage-link' : 'add-link'"
                :stroke="1.5"
                :height="20"
                :width="20"
                :tooltip="
                  data.Links.length > 0 ? 'Manage links' : 'Attach a link'
                "
                clickable
                @click="openLinkDialog(data)"
              />
              <Icon
                v-if="data.Files.length > 0"
                name="image-viewer"
                :stroke="1.5"
                :height="19"
                :width="20"
                tooltip="Show images"
                clickable
                @click="setFiles(data)"
              />
              <Icon
                v-if="data.Files.length > 0"
                name="image-remover"
                :stroke="1.5"
                :height="20"
                :width="20"
                tooltip="Remove an image"
                clickable
                @click="openRemoveImageDialog(data)"
              />
            </div>
          </template>
          <template v-if="hasActionButton" #actions="{ data }">
            <div class="minimal-width">
              <!-- <Icon v-if="showInfo" :stroke="1.5" name="info" :height="20" :width="20" tooltip="Show more info" clickable @click="action(data, 'info')" /> -->
              <Icon
                v-if="showEdit"
                :stroke="1.5"
                name="edit"
                :height="20"
                :width="20"
                tooltip="Edit this trade"
                clickable
                @click="openEditTradeDialog(data)"
              />
              <Icon
                v-if="showDelete"
                :stroke="1.5"
                name="trash"
                :height="20"
                :width="20"
                tooltip="Delete this trade"
                clickable
                @click="action(data, 'delete-item')"
              />
              <Icon
                v-if="showDuplicate"
                :stroke="1.5"
                name="copy"
                :height="20"
                :width="20"
                tooltip="Duplicate this trade"
                clickable
                @click="openDuplicateTradeDialog(data)"
              />
              <Icon
                v-if="showHideAndShow"
                :stroke="1.5"
                :name="data.IsHidden ? 'eye-on' : 'eye-off'"
                :height="20"
                :width="20"
                :tooltip="data.IsHidden ? 'Show this trade' : 'Hide this trade'"
                clickable
                @click="action(data, 'hide-show-trade')"
              />
              <Icon
                v-if="showAddTags"
                :stroke="1.5"
                name="tags"
                :height="24"
                :width="22"
                tooltip="Add tag"
                clickable
                @click="$emit('add-tag', data)"
              />
            </div>
          </template>
          <div v-if="(hasPagination && totalPages > 1) || itemsPerPage > 10">
            <div :class="{ hidden: totalPages <= 1 }" class="page-navigator">
              <b-pagination
                v-model="page"
                :total-rows="totalPages"
                :per-page="1"
                first-number
                last-number
                :classes="bootstrapPaginationClasses"
                class="paginator"
                :class="{ 'is-dark-mode': darkMode }"
                @change="onPage"
              />
            </div>
            <div v-if="showPerPage" class="per-page-size-container">
              <div>
                <label
                  class="no-select"
                  for="items-per-page-data"
                  style="margin-right: 10px"
                  >Per page:</label
                >
                <select
                  id="items-per-page-data"
                  v-model="itemsPerPage"
                  class="minimal padding"
                  :class="{ 'is-dark-mode': darkMode }"
                  style="min-width: auto !important; width: 68px"
                  @change="changeSize"
                >
                  <option
                    v-for="option in [5, 10, 15, 20, 25, 30, 50]"
                    :key="option"
                    :value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </ui-table>
        <div
          v-if="data.length === 0"
          style="
            text-align: center;
            position: relative;
            top: 25px;
            font-size: 15px;
            height: 46px;
          "
        >
          {{ noRowsText }}
        </div>
        <FileViewer
          ref="viewer"
          :viewer="viewer"
          :images="imageFiles"
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
              :image-files="imageFiles"
              @primary-button="$emit('remove-attachment', $event)"
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
              :attachments="attachments"
              :current-trade-id="currentTradeId"
              @primary-button="$emit('add-link', $event)"
              @secondary-button="addLinkDialogVisible = false"
              @remove-attachment="$emit('remove-attachment', $event)"
              @update-link="$emit('update-attachment', $event)"
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
              :dark-mode="darkMode"
              :current-trade-id="currentTradeId"
              :journal="journal"
              @clear-current-id="currentTradeId = ''"
              @primary-button="$emit('upload-attachment', $event)"
              @secondary-button="uploadImageDialogVisible = false"
            />
          </template>
        </CustomDialog>
        <CustomDialog
          v-if="duplicateTradeDialogVisible"
          :dark-mode="darkMode"
          :dialog-width="'550px'"
          @secondary-button="duplicateTradeDialogVisible = false"
        >
          <template #body>
            <DuplicateTradeDialogBody
              :dark-mode="darkMode"
              :trade="currentTrade"
              :journal="journal"
              :all-journals="allJournals"
              @clear-current-trade="currentTrade = {}"
              @primary-button="$emit('duplicate-trade', $event)"
              @secondary-button="duplicateTradeDialogVisible = false"
            />
          </template>
        </CustomDialog>
      </div>
    </ClientOnly>
    <Loader v-if="isLoadingData" :dark-mode="darkMode" message="" />
  </div>
</template>

<script>
import tradeStatusConstants from "@/lib/trade-status-constants";
import tradeStatusTranslation from "@/lib/trade-status-translations";
import tradeStatusColorsDark from "@/lib/trade-status-colors-dark";
import tradeStatusColors from "@/lib/trade-status-colors";
import attachmentStatus from "@/lib/attachment-type-constants";
import entryStatusConstants from "@/lib/entry-status-constants";

export default {
  name: "DataTableBalmUI",

  props: {
    data: {
      type: Array,
      required: true,
    },

    showPerPage: {
      type: Boolean,
      required: false,
      default: true,
    },

    journal: {
      type: Object,
      required: false,
      default: null,
    },

    userSettings: {
      type: Object,
      required: false,
      default: null,
    },

    thead: {
      type: Array,
      required: true,
    },

    tbody: {
      type: Array,
      required: true,
    },

    allJournals: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },

    showEdit: {
      type: Boolean,
      required: false,
      default: false,
    },

    isLoadingData: {
      type: Boolean,
      required: false,
      default: false,
    },

    smallTable: {
      type: Boolean,
      required: false,
      default: false,
    },

    showInfo: {
      type: Boolean,
      required: false,
      default: false,
    },

    showDuplicate: {
      type: Boolean,
      required: false,
      default: false,
    },

    showHideAndShow: {
      type: Boolean,
      required: false,
      default: false,
    },

    showAddTags: {
      type: Boolean,
      required: false,
      default: false,
    },

    showDelete: {
      type: Boolean,
      required: false,
      default: false,
    },

    noRowsText: {
      type: String,
      required: false,
      default: "",
    },

    selectedKey: {
      type: String,
      required: false,
      default: "id",
    },

    fullWidth: {
      type: Boolean,
      required: false,
      default: true,
    },

    rowCheckbox: {
      type: Boolean,
      required: false,
      default: false,
    },

    hasPagination: {
      type: Boolean,
      required: false,
      default: false,
    },

    currentPage: {
      type: Number,
      required: false,
      default: 1,
    },

    pageSize: {
      type: Number,
      required: false,
      default: 10,
    },

    totalPages: {
      type: Number,
      required: false,
      default: 1,
    },

    darkMode: {
      type: Boolean,
      required: false,
      default: true,
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
  },

  setup() {
    const windowConfig = WindowConfigStore();
    return { windowConfig };
  },

  data() {
    return {
      entryStatusConstants,
      itemsPerPage: 10,
      removeImageDialogVisible: false,
      addLinkDialogVisible: false,
      uploadImageDialogVisible: false,
      duplicateTradeDialogVisible: false,
      viewer: { visibleViewer: false, fileIndex: 0 },
      currentTradeId: "",
      currentTrade: {},
      imageFiles: [],
      attachments: [],
      tradeStatusConstants,
      tradeStatusTranslation,
      tradeStatusColorsDark,
      tradeStatusColors,
      attachmentStatus,
      page: 1,
      total: 4,
      selectedRows: [],
      bootstrapPaginationClasses: {
        ul: "pagination",
        li: "page-item",
        liActive: "active",
        liDisable: "disabled",
        button: "page-link",
      },
    };
  },

  computed: {
    hasActionButton() {
      return (
        this.showInfo ||
        this.showEdit ||
        this.showDelete ||
        this.showDuplicate ||
        this.showHideAndShow ||
        this.showAddTags
      );
    },
  },

  watch: {
    journal: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;

        const tradeId = this.currentTradeId;
        if (this.addLinkDialogVisible && tradeId.length > 0) {
          const currentTrade = _find(newValue.Trades, function (o) {
            return o.Id === tradeId;
          });

          if (_isNil(currentTrade)) return;
          this.attachments = _filter(currentTrade.Attachments, function (c) {
            return c.Type === attachmentStatus.IS_LINK;
          });
        }

        this.removeImageDialogVisible = false;
      },
    },

    "selectedRows.length": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        this.$emit("set-selected-rows", this.selectedRows);
      },
    },
    page: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        this.$emit("set-current-page", newValue);
      },
    },

    "viewer.visibleViewer": {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.imageFiles = [];
        }
      },
    },

    uploadImageDialogVisible: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.currentTradeId = "";
        }
      },
    },

    duplicateTradeDialogVisible: {
      handler(newValue, oldValue) {
        if (newValue === oldValue) return;
        if (!newValue) {
          this.currentTrade = {};
        }
      },
    },
  },

  mounted() {
    this.page = this.currentPage;
    this.total = this.totalPages;

    this.hideAndShowElement(".mdc-data-table__sort-icon-button");
    if (this.hasActionButton) this.hideShowActionButton();
    this.itemsPerPage = this.pageSize;
  },

  methods: {
    action(data, action) {
      this.$emit(action, data, action);
    },

    onPage(page) {
      this.$emit("set-page", page);
    },

    changeSize() {
      this.$emit("change-size-page", this.itemsPerPage);
    },

    openImageUploadDialog(data) {
      const count = _size(data.Files);
      if (count >= 3) {
        this.$noty.info(`Per trade there are only 3 images allowed.`);
      } else {
        this.currentTradeId = data.Id;
        this.uploadImageDialogVisible = true;
      }
    },

    openDuplicateTradeDialog(data) {
      this.currentTrade = data;
      this.duplicateTradeDialogVisible = true;
    },

    async setFiles(data) {
      this.imageFiles = _map(data.Files, (o, index) => {
        return o.url;
      });

      if (!_isEmpty(this.imageFiles)) {
        setTimeout(() => {
          this.viewer.visibleViewer = !this.viewer.visibleViewer;
        }, 1);
      }
    },

    openRemoveImageDialog(data) {
      this.imageFiles = data.Files;
      this.removeImageDialogVisible = true;
    },

    openLinkDialog(data) {
      this.attachments = data.Links;
      this.currentTradeId = data.Id;
      this.addLinkDialogVisible = true;
    },

    openEditTradeDialog(data) {
      this.$emit("show-trade-dialog", data);
    },

    statusStyle(status) {
      const rgb = this.darkMode
        ? tradeStatusColorsDark[status]
        : tradeStatusColors[status];

      return {
        color: "rgb(" + rgb + ")",
        backgroundColor: "rgba(" + rgb + ", 0.1)",
      };
    },

    hideShowActionButton() {
      const rows = document.querySelectorAll(".mdc-data-table__row");
      rows.forEach((row) => {
        const cells = row.querySelectorAll(".mdc-data-table__cell");
        const lastCell = cells[cells.length - 1];
        lastCell.classList.add("hidden");
      });

      setTimeout(() => {
        rows.forEach((row) => {
          const cells = row.querySelectorAll(".mdc-data-table__cell");
          const lastCell = cells[cells.length - 1];
          lastCell.classList.remove("hidden");
        });
      }, 1000);
    },

    hideAndShowElement(elementClass) {
      const sortButtons = document.querySelectorAll(elementClass);
      sortButtons.forEach((button) => {
        button.classList.add("hidden");
      });

      setTimeout(() => {
        sortButtons.forEach((button) => {
          button.classList.remove("hidden");
        });
      }, 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-container {
  width: fit-content;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 0 10px 0 0;
    max-width: 450px;
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
</style>

<style lang="scss">
.tag.fixed {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
}

.action-button {
  cursor: pointer;
  font-size: 20px;
}

.bold div {
  letter-spacing: 1px;
  font-weight: bold;
}

.hidden div {
  .mdc-data-table__sort-icon-button {
    opacity: 0;
  }
}

.verticle-align {
  vertical-align: top;
  padding-top: 20px;

  &.action,
  &.status {
    padding-top: 14px;
  }
}

.extra-padding {
  padding: 16px 35px 16px 35px !important;
}

.mdc-data-table__sort-icon-button.hidden,
.mdc-data-table__cell.hidden {
  opacity: 0;
}

.data-table-balm-ui {
  height: 100%;
  border: unset;
  overflow: hidden;

  .mdc-data-table__header-cell {
    user-select: none;
    background-color: transparent;
  }

  .mdc-data-table__cell {
    &.zoom {
      zoom: 90%;
    }

    &.is-hidden {
      background-color: #edeef0 !important;
    }

    &.is-positive {
      color: #089981;
    }

    &.is-negative {
      color: #f23645;
    }
  }

  &.is-dark-mode {
    background-color: #131722;

    .mdc-data-table__row:not(.mdc-data-table__row--selected):hover {
      background-color: #1d2230 !important;
    }

    .mdc-data-table__header-cell,
    .mdc-data-table__cell {
      color: white !important;
      border-bottom-color: rgba(193, 194, 199, 0.4);

      &.is-positive {
        color: #00ff00 !important;
      }

      &.is-hidden {
        background-color: #1e222e !important;
      }

      &.is-negative {
        color: #f23645 !important;
      }
    }

    .mdc-data-table__pagination-total {
      color: white;
    }

    .mdc-data-table__pagination-button {
      color: white;
      border: rgb(141, 141, 141) 1px solid;
    }

    .mdc-pagination__button--active {
      background: white !important;
      color: black !important;
      border: unset !important;
    }

    .mdc-data-table__sort-icon-button {
      color: white !important;
    }
  }

  &.small-table {
    zoom: 80%;
  }
}
</style>
<style lang="scss" scoped>
.minimal-width {
  display: flex;
  gap: 4px;
  // flex-wrap: wrap;
  // padding: 0 0 10px 0;
  // min-width: 100px;
}

.html-text {
  max-width: 410px;
  padding-right: 10px;
  max-height: 100px;
  overflow-y: auto;
}

.page-navigator {
  height: 40px;
  width: 100%;
  margin-top: 9px;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  &.hidden {
    opacity: 0;
  }
}

.per-page-size-container {
  height: 0;
  position: relative;
  zoom: 90%;
  top: -35px;
  float: right;
  width: fit-content;
}

.entry {
  display: flex;
  gap: 8px;
  align-items: center;

  .tpsl {
    width: 24px;
  }

  &.hidden {
    display: none !important;
  }
}

.ul-list {
  list-style-type: none;
  padding-left: 0 !important;
  list-style-position: inside;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;

  &.entry-price {
    gap: 10px;
  }

  &.custom-padding {
    gap: 10px;
  }
}

.multiple li:before {
  content: "-";
  margin-right: 0.5em;
}
</style>
