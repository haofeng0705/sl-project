<template>
  <div class="login">
    <div class="login-title">
      <div class="title-left">
        <div class="logo-img"><img :src="imgData.logo" alt="#" /></div>
      </div>
      <title-right :list="list"></title-right>
    </div>
    <div class="center">
      <div class="system-login">
        <span
          >系统登录
          <div class="sub-line"></div
        ></span>
      </div>
      <form id="login-form" action="#">
        <div class="input-row">
          <label for="username"
            ><span class="big-iconfont icon-user"></span
          ></label>
          <input
            type="text"
            v-model="username"
            id="username"
            name="username"
            autocomplete="new-password"
            :maxlength="16"
          />
        </div>
        <div class="input-row">
          <label for="password"
            ><span class="big-iconfont icon-password"></span
          ></label>
          <input
            type="password"
            v-model="password"
            name="password"
            id="password"
            autocomplete="new-password"
            :maxlength="16"
          />
        </div>
        <input
          class="login_btn"
          type="button"
          value="立即登录"
          @click="submitForm"
        />
      </form>
    </div>
  </div>
</template>
<script>
import { DateFormat } from "@/selfTools/DateTools.js";
import { loginUser, getWep, getToken } from "@/api/index.js";
import titleRight from "@/components/TitleRight.vue";
import logo from "@/assets/images/logo.png";
export default {
  components: {
    titleRight,
  },
  data() {
    return {
      imgData: { logo },
      username: "",
      password: "",
      list: [
        {
          id: "location",
          // img: require("@/assets/images/dingwei.png"),
          mainText: "双流区",
          subText: "定位",
        },
        {
          id: "weather",
          // img: require("@/assets/images/duoyun.png"),
          mainText: "10°",
          subText: "晴",
        },
        {
          id: "realtime",
          img: "",
          mainText: "21:05:45",
          subText: "2022-01-03",
        },
      ],
    };
  },
  methods: {
    initLogin() {
      let that = this;
      that.getRealTime(that);
      setInterval(function () {
        that.getRealTime(that);
      }, 1000);
    },
    getRealTime(self) {
      self.list[2].mainText = DateFormat(new Date(), 3);
      self.list[2].subText = DateFormat(new Date(), 2);
    },
    async getWeather(Params) {
      await getWep(Params)
        .then((res) => {
          const { name, t } = res.data;
          this.list[1].mainText = t + "°";
          this.list[1].subText = name;
          this.$store.commit("app/UP_WEATHER", { status: name, tem: t + "°" });
        })
        .catch((error) => {
          console.log(error);
        });
    },
    submitForm() {
      let that = this;
      // let usernameReg = /^\w{3,10}$/;
      // let passwordReg = /^\w{3,10}$/;
      // if (!usernameReg.test(this.username)) {
      //   this.$message.warning("用户名应为3-10个字母、数字、下划线");
      //   return false;
      // }
      // if (!passwordReg.test(this.password)) {
      //   this.$message.warning("密码应为6-10个字母、数字、下划线");
      //   return false;
      // }
      console.log(this.$message)
      loginUser({
        loginname: this.username,
        password: this.password,
      })
        .then((res) => {
          const { code, msg, data } = res;
          if (code == 200) {
            getToken({
              loginname: this.username,
              password: this.password,
            }).then((res) => {
              that.$store.commit("app/UP_ACTIVE_ROUTER", 0);
              that.$store.commit("app/UP_TOKEN", res.data);
              that.$store.commit("login/UP_USER_NAME", data.name);
              that.$store.commit(
                "login/UP_USER_GRADE",
                data.permissionLevelName
              );
              
              that.$message.success("登陆成功");
              that.$router.push("/monitor");
            });
          } else if (code == 900) {
            this.$message.warning(msg);
            return false;
          }
        })
        .catch((error) => {
          this.$message.warning("网络异常");
          return false;
        });
    },
  },
  created() {
    this.getWeather({
      station: "56288",
    }).then((res) => {});
  },
  mounted() {
    let that = this;
    this.initLogin();
    document.onkeydown = (event) => {
      let e = event || window.event;
      if (e && e.keyCode == 13) {
        that.submitForm();
      }
    };
  },
  destroyed() {
    document.onkeydown = null;
  },
  computed: {},
};
</script>

<style  scoped>
.login {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.login-title {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 6rem;
  padding: 1rem 1rem 0 1rem;
}
.title-left,
.title-right {
  flex: 1;
}
.logo-img {
  width: 33.3125rem;
  height: 5.375rem;
}
.logo-img img {
  height: 100%;
  width: 100%;
}
#login-form {
  display: flex;
  flex-direction: column;
  padding: 0 2rem;
}

input {
  outline: none;
  border: 0;
  height: 2rem;
  background: transparent;
  color: #fff;
  border-bottom: 0.1rem solid rgba(255, 255, 255, 0.65);
}
.input-row {
  position: relative;
  margin: 2rem 0;
  overflow: hidden;
}
label > span {
  position: fixed;
  width: 1.5625rem;
  height: 1.5625rem;
}
input[type="text"],
input[type="password"] {
  padding: 0 0 1rem 2.8rem;
  font-size: 1rem;
}
.center {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 30rem;
  height: 33.75rem;
  padding: 3rem;
  margin: 6% auto;
  color: #fff;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.65);
}
/* .center {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  width: 43.75rem;
  height: 37.5rem;
  padding: 3rem;
  margin: 8% auto;
  border-radius: 0.5rem;
  color: #fff;
  background: url(../../assets/images/login_bg2.png);
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
} */
.system-login {
  text-align: center;
  margin-bottom: 3rem;
}
.system-login > span {
  display: inline-block;
  font-size: 2rem;
  font-weight: 700;
  font-family: Helvetica, "Hiragino Sans GB", "Microsoft Yahei", "微软雅黑",
    Arial, sans-serif;
}
.sub-line {
  width: 100%;
  height: 0.2rem;
  margin-top: 0.5rem;
  border-radius: 0.1rem;
  background-color: #ffffff;
}

.login_btn {
  margin-top: 2rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: #fff;
  border-radius: 1rem;
  border-bottom: none;
  background: #8f8f8f80;
  transition: all 0.4s;
}
.login_btn:hover {
  /* background: #3990ba; */
  background: #0083b6;
}
</style>

