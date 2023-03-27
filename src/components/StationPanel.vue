<template>
  <div class="station-panel">
    <div class="panel-title">
      <span>{{ stationTitle }}</span>
      <span
        class="iconfont icon-close"
        title="关闭"
        @click="handleclose"
      ></span>
    </div>
    <div
      class="station-content"
      v-loading="stationLoading"
      element-loading-text="加载站点数据中......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <!-- <div class="param"><slot name="data-param"></slot></div> -->
      <div class="chart"><slot name="station-chart"></slot></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "StationPanel",
  components: {},
  props: {
    stationTitle: {
      type: String,
      default: "",
    },
    stationLoading: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    handleclose() {
      this.$emit("handleStationClose", false);
    },
  },
  watch: {
    getStationTitle(newValue, oldValue) {
      if (newValue) {
        this.stationTitle = newValue;
      }
    },
  },
};
</script>

<style scoped>
.station-panel {
  position: absolute;
  top: 25%;
  left: 30%;
  z-index: 888;
  width: 60rem;
  height: 25rem;
  padding: 0.5rem 0.8rem;
  border: 0.0625rem solid #ccc;
  border-radius: 0.625rem;
  background: #002240a8;
}
.iconfont {
  line-height: 1.3125rem;
}
.panel-title {
  height: 2.5rem;
  display: flex;
  justify-content: space-between;
  color: #fff;
  padding: 0.5rem;
  border-bottom: 0.0625rem solid #ccc;
}
.panel-title span {
  transition: all 0.5s;
}
.panel-title span:hover {
  color: #00bffa;
}
.station-content {
  height: calc(100% - 2.5rem);
  display: flex;
  flex-direction: column;
}
.param {
  flex: 1;
}
.chart {
  flex: 6;
}
</style>