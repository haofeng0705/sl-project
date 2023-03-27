<template>
  <div id="sendmessage">
    <div class="table-func">
      <div class="search">
        <el-input v-model="keyWords" placeholder="请输入关键字" clearable>
        </el-input>
        <div
          v-show="showAddUser"
          class="confirm-btn system-btn"
          @click="searchUser"
        >
          点击查询
        </div>
      </div>

      <div
        v-show="showAddUser"
        class="confirm-btn system-btn"
        @click="handleAdd"
      >
        新增短信接收用户
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
      @handleCurrentChange="handleCurrentChange"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
    >
    </common-table>
    <el-dialog
      top="5vh"
      width="30%"
      :title="formTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="form" :rules="rules">
        <el-form-item label="姓名">
          <el-input
            v-model="form.name"
            placeholder="请输入姓名"
            :disabled="formState"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input placeholder="请输入联系电话" v-model="form.phone" clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="推送状态">
          <el-select v-model="form.flag" placeholder="不推送">
            <el-option
              v-for="item in sendStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
  getSmsReceiverList,
  addSmsReceiver,
  editSmsReceiver,
  deleteSmsReceiverBatch,
} from "@/api/index.js";
import { isName, isPhone } from "@/selfTools/Validate.js";
export default {
  name: "SendMessage",
  components: { CommonTable },
  data() {
    return {
      keyWords:'',
      formTitle: "编辑短信接收用户",
      showAddUser: true,
      tablePage: {
        pageNo: 1,
        limit: 13,
        total: 0, //总数据量
        show: true,
        layout: "total, prev, next",
        // sizes: [10, 50, 100], //跳页选项
      },
      department: [],
      role: [],
      grade: [],
      tableData: [],
      sendStatus: [
        { value: 1, label: "推送" },
        { value: 0, label: "不推送" },
      ],
      tableColumns: [
        {
          prop: "id",
          label: "序号",
          align: "center",
        },
        {
          prop: "name",
          label: "姓名",
          align: "center",
          // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
        },
        { prop: "phone", label: "联系电话", align: "center" },
        {
          prop: "status",
          label: "推送状态",
          align: "center",
          filters: [
            { text: "推送", value: "推送" },
            { text: "不推送", value: "不推送" },
          ],
        },
        { prop: "active", label: "操作", align: "center" },
      ],
      tableHandle: {
        edit: true,
        delete: true,
      },
      dialogFormVisible: false,
      formState: false,
      form: {
        userId: "",
        name: "",
        phone: "",
        flag: 0,
      },
      rules: {},
    };
  },
  created() {
    this.initSend();
  },
  methods: {
    initSend() {
      if (this.$store.getters.userGrade == 3) {
        this.tableColumns.splice(5, 1);
        this.showAddUser = false;
      }
      this.getMessageUser({});
    },
    searchUser(){
      this.getMessageUser({keywords:this.keyWords})
    },
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
    },
    handleEdit(index, item) {
      this.formTitle = "编辑短信接收用户";
      this.formState = true; //formState为true时，代表编辑状态，姓名和用户名不可被编辑
      for (const key in item) {
        this.form[key] = item[key];
      }
      this.dialogFormVisible = true;
      this.editIndex = index;
    },
    handleAdd() {
      this.formTitle = "新增短信接收用户";
      this.formState = false; //formState为false时，代表新增用户状态，姓名和用户名可被编辑
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
    updataFormData() {
      let that = this;
      if (
        !isName(this.form.name, this.$message)
      ) {
        return;
      }
      if (this.formState == false) {
        let isUnique = false; //判断用户名是否唯一
        this.tableData.forEach((item) => {
          if (item.phone == this.form.phone) {
            isUnique = true;
            this.$message({
              type: "error",
              message: "推送手机号已存在",
            });
          }
        });
        if (isUnique) return;
        //判断是编辑状态还新增状态，新增则在数据数组中新增数据项.
        addSmsReceiver({
          name: that.form.name,
          mobilePhone: that.form.phone,
          flag: that.form.flag,
        })
          .then((res) => {
            if (res.code == 200) {
              that.getMessageUser({});
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
          });
        return;
      } else {
        editSmsReceiver({
          id: this.form.userId,
          name: that.form.name,
          mobilePhone: that.form.rolphonee,
          flag: that.form.flag,
        })
          .then((res) => {
            console.log(res);
            if (res && res.code == 200) {
              this.getMessageUser({});
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
            this.$message({
              type: "error",
              message: "服务器错误!",
            });
          });
      }
      this.dialogFormVisible = false;
    },

    handleDelete(index, item) {
      this.$confirm(`确认要删除${item.name}用户吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteSmsReceiverBatch({
            ids: item.userId,
          }).then((res) => {
            if (res.code == 200) {
              this.getMessageUser({});
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
          });
        })
        .catch(() => {
          this.$message.error("服务器错误");
        });
    },
    getMessageUser(param) {
      getSmsReceiverList(param).then((res) => {
        if (res && res.code == 200) {
          const { data } = res;
          if (data && data.length > 0) {
            this.tableData = data.map((item, index) => {
              return {
                id: index + 1,
                userId: item.id,
                name: item.name,
                phone: item.mobilePhone,
                status: item.flag ? "推送" : "不推送",
                active: "操作",
              };
            });
            this.tablePage.total = this.tableData.length;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
#sendmessage {
  display: flex;
  flex-direction: column;
  height: 100%;
}


#sendmessage .commonTable {
  overflow: auto;
}
#sendmessage .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#sendmessage .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#sendmessage .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
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
