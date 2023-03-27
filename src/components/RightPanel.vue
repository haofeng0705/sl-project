<template>
  <div :class="istrue ? 'rightpanel-expand' : 'rightpanel-shrink'">
    <div class="content">
      <div class="line"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "RightPanel",
  props: {
    istrue: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    shrink() {
      this.istrue = !this.istrue;
      this.$emit("shrink", this.istrue);
    },
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
.rightpanel-expand,
.rightpanel-shrink {
  position: absolute;
  right: 0;
  z-index: 4;
  height: 100%;
  padding: 6rem 0 0 0;
  width: 32rem;
  transition: all 0.6s;
}
.rightpanel-shrink {
  margin-right: -32rem;
}
.content {
  position: relative;
  height: 95%;
  margin-right: 1rem;
  padding-right: 1rem;
}

.line {
  position: absolute;
  z-index: 1;
  right: 0;
  width: 0.1rem;
  height: 100%;
  background: url("../assets/images/leftline.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
</style>