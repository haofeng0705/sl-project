<template>
  <div :class="istrue ? 'leftpanel-expand' : 'leftpanel-shrink'">
    <div
      :title="istrue ? scaleExpand : scaleShrink"
      :class="istrue ? 'scale-button-expand' : 'scale-button-shrink'"
      @click="shrink()"
    ></div>
    <div class="content">
      <div class="line"></div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LeftPanel",
  props: {},
  data() {
    return {
      istrue: true,
      scaleExpand: "点击收起",
      scaleShrink: "点击展开",
    };
  },
  methods: {
    shrink() {
      this.istrue = !this.istrue;
      this.$emit("shrink", this.istrue);
    },
  },
  created() {},
};
</script>

<style scoped>
.leftpanel-expand,
.leftpanel-shrink {
  position: absolute;
  z-index: 3;
  height: 100%;
  padding: 6rem 0 0 0;
  width: 31.5rem;
  transition: all 0.6s;
}
.leftpanel-shrink {
  margin-left: -31.5rem;
}
.content {
  position: relative;
  height: 95%;
  margin-left: 1rem;
  padding-left: 1rem;
}

.scale-button-expand,
.scale-button-shrink {
  z-index: 4;
  width: 1.2rem;
  position: absolute;
  padding: 0 0.4rem;
  right: -1rem;
  height: 1.2rem;
  cursor: pointer;
  margin-top: 0.2rem;
  background: url("../assets/images/shrink.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.scale-button-shrink {
  right: -1.2rem;
  background: url("../assets/images/expand.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.scale-button span {
  display: inline-block;
  height: 1.5rem;
}
.line {
  position: absolute;
  z-index: 1;
  left: 0;
  width: 0.1rem;
  height: 100%;
  background: url("../assets/images/leftline.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
</style>