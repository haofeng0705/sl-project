import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Echarts from "./plugin/echarts";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import "@/plugin/drag.js";
import "@/plugin/cesium-measure.js";
import "cesium/Widgets/widgets.css";
import "./assets/font/iconfont.css";
import "./App.css";
import "./custom.css";


Vue.use(Echarts);
Vue.use(ElementUI);
Vue.config.productionTip = false;
Array.prototype.remove = function (val) {
  let index = this.indexOf(val)
  if (index > -1) {
    this.splice(index, 1);
  }
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
