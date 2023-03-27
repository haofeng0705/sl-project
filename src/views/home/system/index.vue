<template>
  <div id="system">
    <div class="system-panel">
      <el-container>
        <el-aside width="200px"
          ><el-menu
            default-active="0"
            class="el-menu-vertical-demo"
            background-color="#132230"
            text-color="#fff"
            active-text-color="#98a8f4"
          >
            <router-link
              v-for="(item, index) in sysMenu"
              :key="index"
              :to="item.link"
            >
              <el-menu-item :index="index + ''">
                <i :class="item.icon"></i>
                <span slot="title">{{ item.text }}</span>
              </el-menu-item></router-link
            >
          </el-menu></el-aside
        >
        <el-container>
          <el-header class="system-header">
            <breadcrumb></breadcrumb>
            <el-dropdown @command="handleCommand" trigger="click">
              <div class="user-info el-dropdown-link">
                <span class="el-icon-user-solid"></span>
                <span class="userName">{{ userName }}</span>
              </div>
              <el-dropdown-menu slot="dropdown">
                <!-- <el-dropdown-item
                  icon="el-icon-user-solid
"
                  command="person"
                  >个人中心</el-dropdown-item
                > -->
                <el-dropdown-item icon="el-icon-s-home" command="exitLogin"
                  >退出登录</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </el-header>
          <el-main class="system-main"><router-view></router-view></el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "@/components/Breadcrumb.vue";
export default {
  name: "System",
  components: { Breadcrumb },
  data() {
    return {
      userName: "",
      sysMenu: [
        {
          id: "user",
          link: "/user",
          icon: "el-icon-user-solid",
          text: "用户管理",
        },

        {
          id: "journal",
          link: "/journal",
          icon: "el-icon-s-management",
          text: "日志管理",
        },
        {
          id: "historyware",
          link: "/historyware",
          icon: "el-icon-upload",
          text: "灾情入库",
        },
        {
          id: "model",
          link: "/model",
          icon: "el-icon-menu",
          text: "模型配置",
        },
        {
          id: "stationbreak",
          link: "/stationbreak",
          icon: "el-icon-school",
          text: "站点阈值",
        },
        {
          id: "sendmessage",
          link: "/sendmessage",
          icon: "el-icon-s-comment",
          text: "推送信息管理",
        },
        {
          id: "querymessage",
          link: "/querymessage",
          icon: "el-icon-s-order",
          text: "历史发送信息",
        },
      ],
    };
  },
  created() {
    this.userName = this.$store.getters.userName || "成信大";
  },
  methods: {
    handleCommand(command) {
      if (command == "exitLogin") {
        this.$confirm("确定注销并退出系统吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("userGrade");
            sessionStorage.removeItem("userName");
            sessionStorage.removeItem("activeRouter");
            this.$store.commit("app/UP_TOKEN", "");
            this.$store.commit("app/UP_ACTIVE_ROUTER", 0);
            this.$store.commit("login/UP_USER_NAME", "");
            this.$store.commit("login/UP_USER_GRADE", "");
            this.$router.push("/login");
            this.$message({
              type: "success",
              message: "退出成功!",
            });
          })
          .catch(() => {});
      }
    },
  },
};
</script>
<style scoped>
#system {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
.system-panel {
  position: absolute;
  width: 80%;
  height: 78%;
  background: rgba(2, 19, 33, 0.8);
  border: 0.0625rem solid #98a8f4;
  border-radius: 2rem;
  /* background: url("../../../assets/images/login_bg2.png");
  background-size: 100% 100%;
  background-position: center center; */
  overflow: hidden;
}
.system-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.system-main {
  padding-top: 0 !important ;
}
.user-info {
  color: #98a8f4;
  cursor: pointer;
}
.userName {
  margin: 0 0.5rem;
}
</style>
