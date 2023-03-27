<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  created() {
    // if (sessionStorage.getItem("store")) {
    //   this.$store.replaceState(
    //     Object.assign(
    //       {},
    //       this.$store.state,
    //       JSON.parse(sessionStorage.getItem("store"))
    //     )
    //   );
    // }
    // //在页面刷新时将vuex里的信息保存到sessionStorage里
    // window.addEventListener("beforeunload", () => {
    //   sessionStorage.setItem("store", JSON.stringify(this.$store.state));
    // });
  },
  mounted() {},
  methods: {},
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
}
body {
  background: url(./assets/images/back.jpg);
  /* background: url(./assets/images/login_bg.png); */
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
  user-select: none;
}
a {
  text-decoration: none;
  color: rgb(255, 255, 255);
  border: 0;
}
li {
  list-style: none;
}
#app {
  height: 100%;
}
</style>
