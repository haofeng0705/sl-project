<template>
  <div
    id="querymessage"
    v-loading="loading"
    element-loading-text="加载日志中...请稍后"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <div class="query-time">
      <div class="time-select">
        <el-date-picker
          v-model="queryTime"
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
      :tableHandle="tableHandle"
      @handleEdit="handleEdit"
      @handleCurrentChange="handleCurrentChange"
    >
    </common-table>
    <el-dialog
      top="5vh"
      width="60%"
      title="编辑"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form">
        <el-form-item label="推送日期" prop="remark">
          <el-date-picker v-model="form.sendTime" disabled type="date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="推送信息" prop="remark">
          <el-input
            type="textarea"
            disabled
            autosize
            v-model="form.message"
          ></el-input>
        </el-form-item>
        <div class="acceptor-box">
          <div
            v-for="(item, index) in acceptArray"
            :key="index"
            class="acceptor-info"
          >
            <el-form-item label="接收人员">
              <el-input
                disabled
                placeholder="姓名"
                v-model="item.name"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item label="联系方式">
              <el-input
                disabled
                placeholder="手机号"
                v-model="item.mobilePhone"
                clearable
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable.vue";
import { getSmsPublishInfoList } from "@/api/index.js";
import { DateFormat, SpecifTime } from "@/selfTools/DateTools.js";
export default {
  name: "QueryMessage",
  components: { CommonTable },
  data() {
    return {
      dialogFormVisible: false,
      tableData: [],
      tableColumns: [
        {
          prop: "id",
          label: "序号",
          align: "center",
          width: 80,
        },
        { prop: "sendTime", label: "推送时间", align: "center" },
        {
          prop: "message",
          label: "推送内容",
          align: "center",
        },
        { prop: "active", label: "操作", align: "center", width: 150 },
      ],
      queryTime: [SpecifTime(72), new Date()],
      loading: true,
      tableHandle: {
        edit: true,
      },

      form: { message: "", stTime: "", acceptArray: [] },
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
    this.initQueryMessage();
  },
  mounted() {},
  methods: {
    initQueryMessage() {
      this.getMessage({
        stTime: DateFormat(this.queryTime[0]),
        endTime: DateFormat(this.queryTime[1]),
      });
    },
    getMessage(param) {
      this.loading = true;
      this.acceptArray = [];
      getSmsPublishInfoList(param)
        .then((res) => {
          console.log(res);
          if (res && res.code == 200) {
            let { data } = res;
            if (data && data.length > 0) {
              this.tableData = data.map((item, index) => {
                this.acceptArray.push(item.receiverList);
                return {
                  id: index + 1,
                  sendTime: item.publishTime || "暂无数据",
                  message: item.msg || "暂无数据",
                  acceptor: item.receiverList,
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
    handleEdit(index, item) {
      this.dialogFormVisible = true;
      for (const key in item) {
        this.form[key] = item[key];
      }
      this.acceptArray=item.acceptor
    },
    confirm() {
      if (this.queryTime.length != 0) {
        let start = DateFormat(this.queryTime[0]);
        let end = DateFormat(this.queryTime[1]);
        this.getMessage({ stTime: start, endTime: end });
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
#querymessage {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.query-time {
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
}
#querymessage .commonTable {
  overflow: auto;
}
#querymessage .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#querymessage .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#querymessage .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
}
.acceptor-info {
  display: flex;
  justify-content: space-around;
  border-top: 0.0625rem solid #ccc;
}
.acceptor-box {
  max-height: 18rem;
  overflow: auto;
}
.acceptor-box::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

.acceptor-box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #85868875;
  border-radius: 0.625rem;
}

.acceptor-box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(164, 164, 167, 0.8);
  background: #85868875;
  border-radius: 0.625rem;
}
</style>
