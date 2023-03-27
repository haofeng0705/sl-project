<template>
  <div class="Breadcrumb">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item
        v-for="(item, index) in breadList"
        :key="index"
        :to="{ path: item.path }"
        >{{ item.meta.title }}</el-breadcrumb-item
      >
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  data() {
    return {
      breadList: [],
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },

  created() {
    this.getBreadcrumb();
  },
  mounted() {},
  methods: {
    isHome(route) {
      return route.name === "user";
    },
    getBreadcrumb() {
      this.breadList = [];
      let matched = this.$route.matched;
      //如果不是首页
      //   if (!this.isHome(matched[2])) {
      //     matched = [{ path: "/user", meta: { title: "用户管理" } }].concat(
      //       matched
      //     );
      //   }
      matched.forEach((route, index) => {
        if (index > 0) {
          this.breadList.push(route);
        }
      });
    },
  },
};
</script>