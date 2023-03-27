<template>
  <div id="historyware">
    <div class="table-func">
      <el-button
        v-show="showAdd"
        class="addnew"
        size="mini"
        type="primary"
        @click="handleAdd"
        >新增历史灾情</el-button
      >
    </div>
    <common-table
      :maxHeight="800"
      style="width: 100%"
      :columns="tableColumns"
      :data="tableData"
      :pager="tablePage"
      :stripe="true"
      :tableHandle="tableHandle"
      @handleCurrentChange="handleCurrentChange"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </common-table>
    <el-dialog
      top="5vh"
      width="60%"
      :title="formTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="时间范围">
          <el-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="乡镇街道">
          <el-input v-model="form.town" placeholder="请输入乡镇街道" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="详细描述" prop="remark">
          <el-input type="textarea" autosize v-model="form.remark"></el-input>
        </el-form-item>
        <el-form-item label="内涝点数量">
          <el-input-number
            v-model="wareCount"
            @change="handleChange"
            :min="0"
          ></el-input-number>
        </el-form-item>
        <div class="station-box">
          <div
            v-for="(item, index) in stationArray"
            :key="index"
            class="station-info"
          >
            <el-form-item label="内涝地点">
              <el-input
                placeholder="内涝地点"
                v-model="item.areastation"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item label="摘要描述">
              <el-input
                placeholder="摘要描述"
                v-model="item.areainfluence"
                clearable
              >
              </el-input>
            </el-form-item>
            <el-form-item label="经度">
              <el-input placeholder="经度" v-model="item.lon" clearable>
              </el-input>
            </el-form-item>
            <el-form-item label="纬度">
              <el-input placeholder="纬度" v-model="item.lat" clearable>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataFormData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CommonTable from "@/components/CommonTable.vue";
import {
  getHistorical,
  getDictionary,
  getWaterlogStationbyId,
  addHistoricalData,
  editHistoricalData,
  deleteHistoricalData,
} from "@/api/index.js";
import { DateFormat } from "@/selfTools/DateTools.js";
import { isStationValue, isLng, isLat } from "@/selfTools/Validate";
export default {
  name: "HistoryWare",
  components: { CommonTable },
  data() {
    return {
      formTitle: "编辑",
      showAdd: true,
      tablePage: {
        pageNo: 1,
        limit: 11,
        total: 0, //总数据量
        show: true,
        layout: "total, prev, pager,next,jumper",
        // sizes: [10, 50, 100], //跳页选项
      },
      town: [],
      tableData: [],
      tableColumns: [
        {
          prop: "id",
          label: "序号",
          align: "center",
        },
        {
          prop: "startTime",
          label: "起始时间",
          align: "center",
          // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
        },
        { prop: "endTime", label: "终止时间", align: "center" },
        { prop: "town", label: "乡镇街道", align: "center" },
        { prop: "maxRain", label: "最大雨量", align: "center" },
        { prop: "overStationCount", label: "超站数", align: "center" },
        { prop: "active", label: "操作", align: "center" },
      ],
      tableHandle: {
        edit: true,
        delete: true,
      },
      editId: 0,
      dialogFormVisible: false,
      formState: false,
      timeRange: [],
      form: {
        town: "",
        remark: "",
      },
      wareCount: 0,
      stationArray: [],
      rules: {},
    };
  },
  created() {
    this.initUser();
  },
  methods: {
    initUser() {
      if (this.$store.getters.userGrade == 3) {
        this.tableColumns.splice(5, 1);
        this.showAdd = false;
      }
      // this.getDict();
      this.getAllHistoryWarn({});
    },
    getDict() {
      getDictionary({ dictionaryType: "乡镇街道" })
        .then((res) => {
          let { data } = res;
          if (data && data.length > 0) {
            this.town = res.data.map((item) => {
              return {
                label: item.name,
                value: item.name,
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
    },
    handleChange(value) {
      let oldLength = this.stationArray.length;
      let count = this.wareCount;
      if (count > oldLength) {
        //增加操作
        for (let i = oldLength + 1; i <= count; i++) {
          this.stationArray.push({
            areainfluence: "",
            areastation: "",
            lon: "",
            lat: "",
          });
        }
      } else {
        //删除操作
        for (let i = 1; i <= oldLength - count; i++) {
          this.stationArray.pop();
        }
      }
    },
    handleEdit(index, item) {
      this.formTitle = "编辑";
      this.formState = true; //formState为true时，代表编辑状态
      this.form.town = item.town;
      this.form.remark = item.remark;
      this.timeRange = [new Date(item.startTime), new Date(item.endTime)];
      this.getWarnPoint(item.id).then((res) => {
        this.wareCount = res.length;
        this.stationArray = res;
      });
      this.dialogFormVisible = true;
      this.editId = item.id;
    },
    handleAdd() {
      this.formTitle = "新增";
      this.timeRange = [];
      this.wareCount = 0;
      this.stationArray = [];
      this.formState = false; //formState为false时，代表新增用户状态，姓名和用户名可被编辑
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
    updataFormData() {
      let flag = true;
      if (this.timeRange.length == 0) {
        this.$message({
          type: "error",
          message: "请选择时间范围",
        });
        return;
      }
      if (this.form.town == "" || this.form.remark == "") {
        this.$message({
          type: "error",
          message: "请完善信息",
        });
        return;
      }
      this.stationArray.forEach((item, index) => {
        if (
          !isStationValue(item.areastation, this.$message, index + 1) ||
          !isStationValue(item.areainfluence, this.$message, index + 1) ||
          !isLng(item.lon, this.$message, index + 1) ||
          !isLat(item.lat, this.$message, index + 1)
        ) {
          flag = false;
          return;
        }
      });
      if (!flag) return;
      this.$confirm(`确认要上传历史内涝信息吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let stTime = DateFormat(this.timeRange[0]);
        let endTime = DateFormat(this.timeRange[1]);
        if (this.formState == false) {
          addHistoricalData({
            stTime: stTime,
            endTime: endTime,
            remark: this.form.remark,
            town: this.form.town,
            waterArea: this.stationArray,
          })
            .then((res) => {
              if (res && res.code == 200) {
                this.getAllHistoryWarn();
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "添加成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "添加失败!",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "success",
                message: "服务器出错!",
              });
            });
          return;
        } else {
          editHistoricalData({
            id: this.editId,
            stTime: stTime,
            endTime: endTime,
            remark: this.form.remark,
            town: this.form.town,
            waterArea: this.stationArray,
          })
            .then((res) => {
              console.log(res);
              if (res && res.code == 200) {
                this.getAllHistoryWarn();
                this.dialogFormVisible = false;
                this.$message({
                  type: "success",
                  message: "修改成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "修改失败!",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "error",
                message: "服务器出错!",
              });
            });
        }
        this.dialogFormVisible = false;
      });
    },

    handleDelete(index, item) {
      this.$confirm(`确认要删除该条数据吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(item.id);
          deleteHistoricalData({ ids: item.id })
            .then((res) => {
              if (res && res.code) {
                this.getAllHistoryWarn();
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
              } else {
                this.$message({
                  type: "error",
                  message: "删除失败!",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "error",
                message: "服务器错误!",
              });
            });
        })
        .catch(() => {});
    },
    getAllHistoryWarn(param) {
      getHistorical(param)
        .then((res) => {
          console.log(res);
          const { data: tableData } = res;
          this.tableData = tableData.map((item) => {
            return {
              id: item.id,
              startTime: item.starttime,
              endTime: item.endtime,
              town: item.town,
              overStationCount: item.overstationamount,
              maxRain: item.maxrain,
              remark: item.remark,
            };
          });
          this.tablePage.total = tableData.length;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getWarnPoint(id) {
      let warnPoint = [];
      await getWaterlogStationbyId({ id: id })
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            if (data && data.length != 0) {
              warnPoint = data;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return warnPoint;
    },
  },
};
</script>


<style scoped>
#historyware {
  display: flex;
  flex-direction: column;
  height: 100%;
}
#historyware .commonTable {
  overflow: auto;
}
#historyware .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#historyware .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#historyware .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
}
.station-info {
  display: flex;
  justify-content: space-between;
  border-top: 0.0625rem solid #ccc;
}
.station-box {
  max-height: 18rem;
  overflow: auto;
}
.station-box::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

.station-box::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #85868875;
  border-radius: 0.625rem;
}

.station-box::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(164, 164, 167, 0.8);
  background: #85868875;
  border-radius: 0.625rem;
}
.addnew {
  float: left;
  margin-bottom: 1rem;
  z-index: 2;
  width: 10rem;
  background: #010f1db8;
}
.table-func {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
}
.el-form-item {
  margin-bottom: 1.25rem;
}
</style>