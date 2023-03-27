<template>
  <div id="user">
    <div class="table-func">
      <div class="search">
        <el-input v-model="keyWords" placeholder="请输入姓名" clearable>
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
        新增用户
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
        <el-form-item label="账号">
          <el-input
            v-model="form.account"
            placeholder="请输入账号"
            :disabled="formState"
            autocomplete="new-password"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            show-password
            type="password"
            autocomplete="new-password"
            clearable
          >
          </el-input>
        </el-form-item>
        <el-form-item label="所属部门">
          <el-select v-model="form.department" placeholder="请选择所在部门">
            <el-option
              v-for="(item, index) in department"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所任职务">
          <el-select v-model="form.role" placeholder="请选择所任职务">
            <el-option
              v-for="(item, index) in role"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限等级">
          <el-select v-model="form.grade" placeholder="请选择权限等级">
            <el-option
              v-for="(item, index) in grade"
              :key="index"
              :label="item.label"
              :value="item.label"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input placeholder="请输入联系电话" v-model="form.phone" clearable>
          </el-input>
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
  getAllUser,
  addUser,
  deleteUser,
  updateUser,
  getDictionary,
} from "@/api/index.js";
import { cloneDeep } from "@/selfTools/FormatData.js";
import {
  isValue,
  isName,
  isPhone,
  isPassword,
  isAccount,
} from "@/selfTools/Validate.js";
export default {
  name: "User",
  components: { CommonTable },
  data() {
    return {
      keyWords:'',
      formTitle: "编辑用户",
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
      tableColumns: [
        {
          prop: "id",
          label: "序号",
          align: "center",
        },
        {
          prop: "department",
          label: "部门",
          align: "center",
          filters: [],
        },
        {
          prop: "name",
          label: "姓名",
          align: "center",
          // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
        },
        { prop: "role", label: "职务", align: "center", filters: [] },
        { prop: "grade", label: "权限等级", align: "center", filters: [] },
        { prop: "phone", label: "联系电话", align: "center" },
        { prop: "active", label: "操作", align: "center" },
      ],
      tableHandle: {
        edit: true,
        delete: true,
      },
      dialogFormVisible: false,
      formState: false,
      form: {
        department: "",
        name: "",
        account: "",
        password: "",
        role: "",
        phone: "",
        grade: "",
      },
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
        this.showAddUser = false;
      }
      this.getDict().then((res) => {
        this.tableColumns.forEach((item) => {
          if (item.hasOwnProperty("filters")) {
            this[item["prop"]].forEach((subItem) => {
              item.filters.push({ text: subItem.label, value: subItem.label });
            });
          }
        });
      });
      this.getAllUser({});
    },
    async getDict() {
      let that = this;
      await getDictionary({ dictionaryType: "职位" })
        .then((res) => {
          let { data } = res;
          if (data && data.length > 0) {
            that.role = res.data.map((item) => {
              return {
                label: item.positionName,
                value: item.positionId,
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await getDictionary({ dictionaryType: "部门" })
        .then((res) => {
          let { data } = res;
          if (data && data.length > 0) {
            that.department = res.data.map((item) => {
              return {
                label: item.dptName,
                value: item.dptId,
              };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await getDictionary({ dictionaryType: "权限等级" })
        .then((res) => {
          let { data } = res;
          if (data && data.length > 0) {
            that.grade = res.data.map((item) => {
              return {
                label: item.permissionLevelName,
                value: item.permissionLevelId,
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
    searchUser() {
      this.getAllUser({ name: this.keyWords });
    },
    handleEdit(index, item) {
      this.formTitle = "编辑用户";
      this.formState = true; //formState为true时，代表编辑状态，姓名和用户名不可被编辑
      for (const key in item) {
        this.form[key] = item[key];
      }
      this.dialogFormVisible = true;
      this.editIndex = index;
    },
    handleAdd() {
      this.formTitle = "新增用户";
      this.formState = false; //formState为false时，代表新增用户状态，姓名和用户名可被编辑
      this.dialogFormVisible = true;
      Object.keys(this.form).forEach((key) => {
        this.form[key] = "";
      });
    },
    updataFormData() {
      let that = this;
      // if (
      //   !isValue(this.form.department, this.$message) ||
      //   !isValue(this.form.role, this.$message) ||
      //   !isValue(this.form.grade, this.$message) ||
      //   !isName(this.form.name, this.$message) ||
      //   !isAccount(this.form.account, this.$message) ||
      //   !isPassword(this.form.password, this.$message) ||
      //   !isPhone(this.form.phone, this.$message)
      // ) {
      //   return;
      // }
      if (this.formState == false) {
        let isUnique = false; //判断用户名是否唯一
        this.tableData.forEach((item) => {
          if (item.account == this.form.account) {
            isUnique = true;
            this.$message({
              type: "error",
              message: "账号已存在,请更换后重试!",
            });
          }
        });
        if (isUnique) return;
        //判断是编辑状态还新增状态，新增则在数据数组中新增数据项.
        addUser({
          loginname: that.form.account,
          dptName: that.form.department,
          name: that.form.name,
          password: that.form.password,
          permissionLevelName: that.form.grade,
          positionName: that.form.role,
          tel: that.form.phone,
        })
          .then((res) => {
            if (res&&res.code == 200) {
              that.getAllUser({});
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
        updateUser({
          loginname: that.form.account,
          dptName: that.form.department,
          name: that.form.name,
          password: that.form.password,
          permissionLevelName: that.form.grade,
          positionName: that.form.role,
          tel: that.form.phone,
        })
          .then((res) => {
            if (res && res.code == 200) {
              this.getAllUser({});
              this.$message({
                type: "success",
                message: "修改成功!",
              });
            }
          })
          .catch((error) => {
            console.log(error);
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
          deleteUser({
            loginname: item.account,
          }).then((res) => {
            if (res.code == 200) {
              // let pageNo = this.tablePage.pageNo;
              // let pageLimit = this.tablePage.limit;
              // this.tableData.splice(index, 1);
              // this.tablePage.total = this.tableData.length; //更新数据总量
              // if ((pageNo - 1) * pageLimit >= this.tablePage.total) {
              //   //当前页数无数据时，页数-1
              //   this.tablePage.pageNo -= 1;
              // }
              this.getAllUser({});
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
        .catch(() => {});
    },
    getAllUser(param) {
      getAllUser(param)
        .then((res) => {
          const { data } = res;
          if (data.data && data.data.length > 0) {
            this.tableData = data.data.map((item, index) => {
              return {
                id: index + 1,
                department: item.dptName,
                account: item.loginname,
                password: item.password,
                name: item.name,
                role: item.positionName,
                phone: item.tel,
                grade: item.permissionLevelName,
                active: "操作",
              };
            });
            this.tablePage.total = this.tableData.length;
          }else{
              this.$message({
                type: "warning",
                message: "未查询到用户!",
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
#user {
  display: flex;
  flex-direction: column;
  height: 100%;
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

#user .commonTable {
  overflow: auto;
}
#user .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#user .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #98a7f475;
  border-radius: 0.625rem;
}

#user .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #98a7f475;
  border-radius: 0.625rem;
}
.user-adduser {
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
</style>
