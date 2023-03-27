<template>
  <div
    id="journal"
    v-loading="loading"
    element-loading-text="加载日志中...请稍后"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="history-time">
      <div class="time-select">
        <el-date-picker
          v-model="journalTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <div class="confirm-btn history-btn" @click="confirm">确认</div>
    </div>
    <common-table
      :maxHeight="800"
      style="width: 100%"
      :columns="tableColumns"
      :data="tableData"
      :pager="tablePage"
      :stripe="true"
      @handleCurrentChange="handleCurrentChange"
    >
    </common-table>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable.vue";
import { getSysLogByQuery } from "@/api/index.js";
import { DateFormat, SpecifTime } from "@/selfTools/DateTools.js";
export default {
  name: "Journal",
  components: { CommonTable },
  data() {
    return {
      tableData: [],
      tableColumns: [
        {
          prop: "id",
          label: "序号",
          align: "center",
        },
        { prop: "account", label: "访问账户", align: "center" },
        {
          prop: "ip",
          label: "访问IP",
          align: "center",
        },
        { prop: "modelType", label: "模型类型", align: "center" },
        { prop: "handleType", label: "操作类型", align: "center" },
        { prop: "startTime", label: "开始时间", align: "center" },
        { prop: "implementTime", label: "执行时长", align: "center" },
      ],
      journalTime: [SpecifTime(72), new Date()],
      loading: true,
      tablePage: {
        pageNo: 1,
        limit: 13,
        total: 0, //总数据量
        show: true,
        layout: "total, prev, pager,next,jumper",
        // sizes: [10, 50, 100], //跳页选项
      },
    };
  },
  created() {
    this.initJournal();
  },
  mounted() {},
  methods: {
    initJournal() {
      this.getJournal({
        stTime: DateFormat(this.journalTime[0]),
        endTime: DateFormat(this.journalTime[1]),
      });
    },
    getJournal(param) {
      this.loading = true;
      getSysLogByQuery(param)
        .then((res) => {
          if (res.code == 200) {
            let { data } = res;
            if (data && data.data.length > 0) {
              this.tableData = data.data.map((item) => {
                return {
                  id: item.id || "暂无数据",
                  ip: item.ip || "暂无数据",
                  account: item.userName || "暂无数据",
                  modelType: item.module || "暂无数据",
                  handleType: item.opration || "暂无数据",
                  implementTime: item.executionTime || "暂无数据",
                  startTime: item.visitTime || "暂无数据",
                };
              });
              this.tablePage.total = this.tableData.length;
            }
            this.loading = false;
          } else {
            this.$message({
              type: "error",
              message: "服务器错误",
            });
            this.loading = false;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "服务器错误",
          });
          this.loading = false;
        });
    },
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
    },
    confirm() {
      if (this.journalTime.length != 0) {
        let start = DateFormat(this.journalTime[0]);
        let end = DateFormat(this.journalTime[1]);
        this.getJournal({ stTime: start, endTime: end });
      } else {
        this.$message({
          type: "error",
          message: "请选择需要查询的时间段后点击确认。",
        });
      }
    },
  },
};
</script>


<style scoped>
#journal {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.history-time {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
}
#journal .commonTable {
  overflow: auto;
}
#journal .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#journal .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#journal .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
}
</style>