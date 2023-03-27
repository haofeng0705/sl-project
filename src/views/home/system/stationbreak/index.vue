<template>
  <div id="StationBreak">
    <!-- <div class="batch-modify">
      <el-input v-model="batchBreak" placeholder="请输入阈值"></el-input>
      <div class="batch-btn" @click="batchModify">批量修改</div>
    </div> -->
        <div class="table-func">
      <div class="search">
        <el-input v-model="keyWords" placeholder="请输入关键字" clearable>
        </el-input>
        <div
          class="confirm-btn system-btn"
          @click="searchStation"
        >
          点击查询
        </div>
      </div>
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
      <el-form :model="form" :rules="rules">
        <el-form-item label="乡镇街道">
          <el-input v-model="form.town" disabled> </el-input>
        </el-form-item>
        <el-form-item label="站点编号">
          <el-input v-model="form.id" disabled> </el-input>
        </el-form-item>
        <el-form-item label="站点名称">
          <el-input v-model="form.name" disabled> </el-input>
        </el-form-item>
        <el-form-item prop="break" label="站点阈值">
          <el-input v-model="form.break" clearable> </el-input>
        </el-form-item>
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
  editStationSlThreshold,
  getStationSlThresholdList,
} from "@/api/index.js";
export default {
  name: "StationBreak",
  components: { CommonTable },
  data() {
    return {
      keyWords:'',
      dialogFormVisible: false,
      batchBreak: "",
      tablePage: {
        pageNo: 1,
        limit: 12,
        total: 0, //总数据量
        show: true,
        layout: "total, prev, pager,next,jumper",
        // sizes: [10, 50, 100], //跳页选项
      },
      tableHandle: {
        edit: true,
      },
      tableData: [],
      tableColumns: [
        {
          prop: "id",
          label: "站点编号",
          align: "center",
        },
        {
          prop: "name",
          label: "站点名称",
          align: "center",
        },
        { prop: "break", label: "阈值", align: "center" },
        { prop: "town", label: "乡镇街道", align: "center" },
        { prop: "active", label: "操作", align: "center" },
      ],
      editId: 0,
      rules: {
        break: { required: true, trigger: "blur", message: "请输入站点阈值" },
      },
      form: {
        id: "",
        name: "",
        break: "",
        town: "",
      },
    };
  },
  created() {
    this.initStationBreak();
  },
  mounted() {},
  methods: {
    initStationBreak() {
      this.getAllStationBreak({});
    },
    getAllStationBreak(param) {
      getStationSlThresholdList(param)
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            if (data && data.length > 0) {
              this.tableData = data.map((item) => {
                return {
                  id: item.stationIdC,
                  name: item.stationName,
                  break: item.threshold,
                  town: item.town,
                };
              });
              this.tablePage.total = data.length;
            }else{
              this.$message({type:'warning',message:'未查询到相关站点'})
            }
          }else{
            this.$message({type:'error',message:'查询失败'})
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            type: "error",
            message: "服务器错误!",
          });
        });
    },
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
    },
    searchStation(){
      this.getAllStationBreak({keywords:this.keyWords})
    },
    handleEdit(index, item) {
      this.dialogFormVisible = true;
      for (const key in item) {
        this.form[key] = item[key];
      }
    },
    updataFormData() {
      this.$confirm(`确认要修改该站点阈值吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          editStationSlThreshold({
            stationIdC: this.form.id,
            threshold: this.form.break,
          })
            .then((res) => {
              console.log(res);
              if (res && res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.getAllStationBreak({});
              } else {
                this.$message({
                  type: "error",
                  message: "修改失败",
                });
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                type: "error",
                message: "服务器出错",
              });
            });
        })
        .catch(() => {});
      this.dialogFormVisible = false;
    },
    batchModify() {},
  },
};
</script>

<style scoped>
#StationBreak {
  display: flex;
  flex-direction: column;
    height: 100%;
}
#StationBreak .commonTable {
  overflow: auto;
}
#StationBreak .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#StationBreak .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#StationBreak .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
}
.batch-modify {
  display: flex;
  margin: 1rem 0;
}
.batch-btn {
  width: 9.375rem;
  margin-left: 1rem;
  height: 2.5rem;
  line-height: 2.3rem;
  text-align: center;
  background: #010f1db8;
  color: #fff;
  border: 0.125rem solid #98a8f4;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.5s;
}
.batch-btn:hover {
  background: #98a8f4;
  color: #fff;
}
.table-func {
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: space-between;
}
.table-func .search{
  display: flex;
   width: 20rem;
}
</style>
