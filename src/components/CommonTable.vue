<template>
  <div class="commonTable">
    <el-table
      :id="id"
      :data="
        data.slice((pager.pageNo - 1) * pager.limit, pager.pageNo * pager.limit)
      "
      :cell-class-name="setCellClassName"
      :cell-style="setCellStyle"
      :header-cell-class-name="setheaderClassName"
      :max-height="maxHeight"
      :stripe="stripe"
      :row-class-name="setRowClassName"
      :default-sort="sort"
      tooltip-effect="light"
      @selection-change="handleSelectionChange"
      @row-click="handleRow"
    >
      <!-- <slot name="table_oper" /> -->
      <template v-for="(item, index) in columns">
        <el-table-column
          v-if="item.label != '操作'"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
          :formatter="item.formatter ? item.formatter : formatterValue"
          :filters="item.filters"
          :filter-method="item.filters ? filterHandler : null"
          :sortable="item.sortable ? item.sortable : false"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          v-else
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :align="item.align ? item.align : 'center'"
          :width="item.width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="tableHandle.down"
              size="mini"
              @click="
                handleDown(
                  (pager.pageNo - 1) * pager.limit + scope.$index,
                  scope.row
                )
              "
              >下载</el-button
            >
            <el-button
              v-if="tableHandle.edit"
              :disabled="tableHandle.disable"
              size="mini"
              @click="
                handleEdit(
                  (pager.pageNo - 1) * pager.limit + scope.$index,
                  scope.row
                )
              "
              >编辑</el-button
            >
            <el-button
              v-if="tableHandle.delete"
              :disabled="tableHandle.disable"
              size="mini"
              type="danger"
              @click="
                handleDelete(
                  (pager.pageNo - 1) * pager.limit + scope.$index,
                  scope.row
                )
              "
              >删除</el-button
            >
          </template></el-table-column
        >
      </template>
    </el-table>
    <el-pagination
      v-show="pager.show"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      style="text-align: center"
      :current-page="pager.pageNo"
      :page-size="pager.limit"
      :page-sizes="pager.sizes"
      :total="pager.total"
      :layout="pager.layout ? pager.layout : 'prev, next'"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "CommonTable",
  props: {
    id: {
      type: String,
      default: "table",
    },
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    data: {
      type: Array,
      default: () => {
        return [];
      },
    },
    pager: {
      type: Object,
      default: () => {
        return {};
      },
    },
    sort: {
      type: Object,
      default: () => {},
    },
    tableHandle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    maxHeight: {
      type: Number,
      default: 2000,
    },
  },
  created() {},
  mounted() {},
  methods: {
    setheaderClassName({ row, column, rowIndex, columnIndex }) {
      if (
        column.label == "站号" ||
        column.label == "站名" ||
        column.label.length > 4
      ) {
        return "orange-cell";
      }
    },
    setCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.label.length > 4) {
        if (row[`${column.label}`] == "null" || row[`${column.label}`] == null ) {
          return "red-cell";
        } else {
          return "orange-cell";
        }
      } else if (column.label == "1Hour" && row.oneHour > 1.5) {
        return "orange-cell";
      } else if (column.label == "3Hour" && row.oneHour > 2) {
        return "yellow-cell";
      } else if (column.label == "6Hour" && row.sixHour > 2) {
        return "yellow-cell";
      } else if (column.label == "12Hour" && row.twelveHour > 1000) {
        return "red-cell";
      } else if (column.label == "24Hour" && row.twentyFHour > 1000) {
        return "red-cell";
      } else if (row[`${column.label}`] == "null") {
        return "red-cell";
      }
    },
    setCellStyle({ row, column, rowIndex, columnIndex }) {
      if (row[`${column.label}`] != undefined) {
        if (row[`${column.label}`] == "null") {
          return "color:red";
        }
      }
    },
    setRowClassName({ row, rowIndex }) {
      if (row.grade == "红色预警" || row.exStaCount > 12) {
        return "threegrade-row";
      } else if (row.grade == "橙色预警" || row.exStaCount > 8) {
        return "twograde-row";
      } else if (row.grade == "黄色预警" || row.exStaCount > 3) {
        return "onegrade-row";
      } else {
        return "nograde-row";
      }
    },
    handleRow(val) {
      this.$emit("handleRow", val);
    },
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    handleSizeChange(val) {
      this.$emit("handleSizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("handleCurrentChange", val);
    },
    handleEdit(index, item) {
      this.$emit("handleEdit", index, item);
    },
    handleDelete(index, item) {
      this.$emit("handleDelete", index, item);
    },
    handleDown(index, item) {
      this.$emit("handleDown", index, item);
    },
    formatterValue(row, column, cellValue) {
      return cellValue;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
  },
};
</script>

<style scoped>
.commonTable {
  overflow: hidden;
}
</style>