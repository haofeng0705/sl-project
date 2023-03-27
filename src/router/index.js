import Vue from "vue";
import store from '../store'
import VueRouter from "vue-router";

Vue.use(VueRouter);

// 解决ElementUI导航栏中重复点菜单报错问题
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "login",
    meta: { title: "登录" },
    component: () => import("../views/login/index.vue"),
  },

  {
    path: "/home",
    name: "home",
    meta: { title: "首页" },
    component: () => import("../views/home/index.vue"),
    children: [
      {
        path: "/monitor",
        name: "monitor",
        meta: { title: "实况监测" },
        component: () => import("../views/home/monitor/index.vue"),
      },
      {
        path: "/warn",
        name: "warn",
        meta: { title: "内涝预警" },
        component: () => import("../views/home/warn/index.vue"),
      },
      {
        path: "/rate",
        name: "rate",
        meta: { title: "灾损评估" },
        component: () => import("../views/home/rate/index.vue"),
      },
      {
        path: "/product",
        name: "product",
        meta: { title: "产品制作" },
        component: () => import("../views/home/product/index.vue"),
      },
      {
        path: "/history",
        name: "history",
        meta: { title: "历史灾情" },
        component: () => import("../views/home/history/index.vue"),
      },
      {
        path: "/system",
        meta: { title: "系统管理" },
        component: () => import("../views/home/system/index.vue"),
        children: [{
          path: "/",
          redirect: "/user",
        }, {
          path: "/user",
          name: "user",
          meta: { title: "用户管理" },
          component: () => import("../views/home/system/user/index.vue"),
        },
        {
          path: "/journal",
          name: "journal",
          meta: { title: "日志管理" },
          component: () => import("../views/home/system/journal/index.vue"),
        }, {
          path: "/historyware",
          name: "historyware",
          meta: { title: "灾情入库" },
          component: () => import("../views/home/system/historyware/index.vue"),
        }, {
          path: "/model",
          name: "model",
          meta: { title: "模型配置" },
          component: () => import("../views/home/system/model/index.vue"),

        }, {
          path: "/stationbreak",
          name: "stationbreak",
          meta: { title: "站点阈值" },
          component: () => import("../views/home/system/stationbreak/index.vue"),

        },{
          path: "/sendmessage",
          name: "sendmessage",
          meta: { title: "推送信息管理" },
          component: () => import("../views/home/system/sendmessage/index.vue"),

        },{
          path: "/querymessage",
          name: "querymessage",
          meta: { title: "历史发送信息" },
          component: () => import("../views/home/system/querymessage/index.vue"),

        }]
      },
    ],
  },
];




const router = new VueRouter({
  routes,
  linkExactActiveClass: "active",
});

router.beforeEach((to, from, next) => {
  if (to.path != '/login') {
    if (store.getters.token && sessionStorage.getItem('token')) {
      next()
    } else {
      alert("登录失效!")
      next({ path: '/login' })
    }
  } else {
    next()
  }
})


export default router;
