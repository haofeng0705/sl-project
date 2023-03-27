<template>
  <div id="home">
    <cesium-box @handleViewer="initViewer"> </cesium-box>
    <div class="home-title" ref="homeTitle">
      <div class="title-left">
        <div class="logo-img"><img :src="imgData.logo" alt="#" /></div>
      </div>
      <div class="title-center">
        <scroll-message :warnTextList="warnTextList"></scroll-message>
      </div>
      <title-right
        :list="titleList"
        @visualization="hiddenNavPanel()"
      ></title-right>
    </div>

    <div id="navigation" ref="navigation">
      <ul>
        <li
          v-for="(item, index) in navList"
          :key="index"
          @click="handleNav(navList, item, index)"
          :class="activeIndex === index ? 'select' : ''"
        >
          <router-link :to="item.link">
            <img :src="item.img" alt="#" />
            <div class="nav-text">
              <div class="navsub-text">{{ item.subText }}</div>
              <div class="navmain-text">{{ item.mainText }}</div>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <div class="footer">
      <div class="updata-time" @click="hiddenTitlePanel">
        <p>数据时间: {{ updataTime }}</p>
      </div>
    </div>
    <div id="main-content" v-if="render && viewerFlag">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import CesiumCore from "@/CesiumCore/index.js";
import TitleRight from "@/components/TitleRight.vue";
import CesiumBox from "@/components/Cesium.vue";//
import ScrollMessage from "@/components/ScrollMessage.vue";
import { DateFormat } from "@/selfTools/DateTools.js";
import logo from "@/assets/images/logo.png";
import { getWarningMsgList } from "@/api/index.js";
export default {
  components: {
    TitleRight,
    CesiumBox,
    ScrollMessage,
  },
  data() {
    return {
      activeIndex: 0,
      navigationShow: true,
      titleShow: true,
      viewerFlag: false,
      updataTime: "",
      warnTextList: [],
      imgData: {
        logo,
      },
      render: true,
      titleList: [
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
          mainText: "",
          subText: "",
        },
        {
          id: "visualization",
          img: require("@/assets/images/visualization.png"),
          mainText: "",
          subText: "",
          btn_func: true,
          isSelect: false,
        },
      ],
      navList: [
        {
          id: "monitor",
          link: "/monitor",
          img: require("@/assets/images/monitor.png"),
          mainText: "实况监测",
          subText: "MONITORING",
        },
        {
          id: "warn",
          link: "/warn",
          img: require("@/assets/images/warn.png"),
          mainText: "内涝预警",
          subText: "WATERLOGGING",
        },
        {
          id: "product",
          link: "/product",
          img: require("@/assets/images/product.png"),
          mainText: "预警产品",
          subText: "PRODUCTION",
        },
        {
          id: "rate",
          link: "/rate",
          img: require("@/assets/images/rate.png"),
          mainText: "灾损评估",
          subText: "ASSESSMENT",
        },

        {
          id: "history",
          link: "/history",
          img: require("@/assets/images/history.png"),
          mainText: "历史灾情",
          subText: "HISTORICAL",
        },
        {
          id: "system",
          link: "/system",
          img: require("@/assets/images/system.png"),
          mainText: "系统管理",
          subText: "SYSTEM",
        },
      ],
      positionLayer: [],
    };
  },

  created() {
    this.initHome();
  },
  mounted() {
    //window.addEventListener("resize", lodash.debounce(this.reload, 500)); //给浏览器添加注册事件 resize  当浏览器窗口发生改变 调用reload函数  利用防抖函数减少请求
  },
  beforeDestroy() {
    //window.removeEventListener("resize", this.reload); //移除注册事件 resize  reload函数
  },
  methods: {
    //初始化主页面
    initHome() {
      this.initNav();
      this.titleList[1].mainText = this.$store.getters.weatherStatus;
      this.titleList[1].subText = this.$store.getters.weatherTem;
      this.getWarnMsg();
      this.getRealTime();
      this.updataTime = this.acquireDataTime();
      setInterval(() => {
        this.getRealTime();
      }, 1000);
    },
    initNav() {
      this.activeIndex = this.$store.getters.activeRouter;
      this.navList.forEach((item, index) => {
        if (index == this.activeIndex)
          item.img = require(`@/assets/images/${item.id}-slt.png`);
      });
    },
    //初始化Cesium视图
    initViewer(viewer) {
      global.cesiumViewer = viewer; //将viewer保存到windows
      this.viewerFlag = true;
      try {
        CesiumCore.add3DTileset(
          viewer,
          "http://192.168.198.1:8087/building/3dBuildMax/tileset.json"
        );
      } catch (error) {
        console.log(error);
      }
    },
    getWarnMsg() {
      getWarningMsgList({ hour: 1000 })
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            this.warnTextList = data.map((item) => {
              return { name: item.type, text: item.msg };
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    acquireDataTime() {
      let updataTime = DateFormat();
      return updataTime;
    },
    getRealTime() {
      this.titleList[2].mainText = DateFormat(new Date(), 3);
      this.titleList[2].subText = DateFormat(new Date(), 2);
    },
    handleVisual() {
      console.log("大屏监测事件");
    },
    //导航切换事件
    handleNav(items, item, index) {
      this.activeIndex = index;
      this.$store.commit("app/UP_ACTIVE_ROUTER", index);
      items.forEach((item) => {
        item.img = require(`@/assets/images/${item.id}.png`);
      });
      item.img = require(`@/assets/images/${item.id}-slt.png`);
    },
    hiddenTitlePanel() {
      if (this.titleShow) {
        this.titleShow = false;
        this.$refs.homeTitle.style.transform = "translateY(-8rem)";
      } else {
        this.titleShow = true;
        this.$refs.homeTitle.style.transform = "translateY(0)";
      }
    },
    hiddenNavPanel() {
      if (this.navigationShow) {
        this.navigationShow = false;
        this.$refs.navigation.style.transform = "translate(-50%,8rem)";
      } else {
        this.navigationShow = true;
        this.$refs.navigation.style.transform = "translate(-50%,0)";
      }
    },
    reload() {
      //重新渲染函数
      // 重新渲染
      this.render = false;
      this.$nextTick(() => {
        this.render = true;
      });
    },
  },
  watch: {
    activeIndex(curVal, oldVal) {
      if (curVal == 5) {
        this.$router.push({ name: "user" });
      }
      //动态监听info数据
      this.updataTime = this.acquireDataTime();
    },
  },
};
</script>

<style >
#home {
  height: 100%;
  width: 100%;
  position: relative;
  perspective: 30rem;
  overflow: hidden;
}
.home-title {
  z-index: 5;
  display: flex;
  position: absolute;
  justify-content: space-between;
  width: 100%;
  height: 6rem;
  padding: 0.5rem 1rem 0 1rem;
  background: linear-gradient(to bottom, #0b1c2c, transparent);
  transition: all 0.6s ease-out;
}
.title-left,
.title-center,
.title-right {
  flex: 1;
}
.title-center {
  margin-top: 0.8rem;
  height: 70%;
  width: 100%;
}
.title-center p {
  color: rgb(190, 190, 190);
  text-align: center;
}
.logo-img {
  width: 33.3125rem;
  height: 5.375rem;
}
.logo-img img {
  height: 100%;
  width: 100%;
}

.golbal {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #0b1c2c;
  z-index: 1;
}

#navigation {
  position: absolute;
  width: 76rem;
  height: 4rem;
  bottom: 0.5rem;
  left: 50%;
  padding: 0 1rem 0 1rem;
  transform: translateX(-50%);
  z-index: 999;
  background: url("../../assets/images/navback.png");
  background-size: 100% 100%;
  background-position: center center;
  transition: all 0.6s ease-out;
  /* overflow: hidden; */
}
#navigation ul {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

#navigation ul li {
  width: 6rem;
  flex: 1;
  text-align: center;
  font-size: 1rem;
  transform: translate(2rem, -0.6rem);
  /* transition: all 0.5s; */
  color: #fff;
}
#navigation ul li a {
  display: inline-block;
  display: flex;
  width: 100%;
  height: 100%;
  color: inherit;
  transition: all 0.5s;
}
#navigation ul li a img {
  width: 50%;
  height: 50%;
  transform: translateY(-0.6rem);
}
.nav-text {
  transform: translate(-0.2rem, 1rem);
}
.nav-select {
  color: rgba(255, 228, 138, 0.774) !important;
}
.navmain-text {
  font-size: 1rem;
  white-space: nowrap;
  text-align: left;
  transform: translate(-1.4rem);
}
.navsub-text {
  font-size: 0.75rem;
  text-align: left;
  white-space: nowrap;
}

.active {
  transform: translateY(-0.5rem);
}
#navigation ul li a:hover {
  transform: translateY(-0.5rem);
}
.footer {
  z-index: 2;
  position: absolute;
  bottom: 0rem;
  height: 5%;
  width: 100%;
  padding-left: 2rem;
}
.updata-time {
  position: absolute;
  right: -1.5rem;
  width: 16rem;
  height: 2rem;
  background: url("../../assets/images/updataTime.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.updata-time p {
  line-height: 2rem;
  padding-left: 1rem;
  font-size: 0.875rem;
  color: #ffd900;
}
</style>