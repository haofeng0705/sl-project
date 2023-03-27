<template>
  <div class="main-chart">
    <div v-show="detail" class="chart-tab">
      <ul v-show="chartTab" class="tab-items">
        <li
          v-for="(item, index) in chartTabList"
          :key="index"
          :class="item.isSelect ? 'chartTab-select' : 'chartTab-item'"
          @click="selectItem(chartTabList, item)"
        >
          <span>{{ item.text }}</span>
        </li>
      </ul>
      <div class="detail-link" @click="clickDetail(id)">
        <span>查看详情</span>
      </div>
    </div>
    <div :id="id" class="chart-panel">
      <span class="none-data">暂无数据</span>
    </div>
  </div>
</template>

<script>
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "ChartPanel",
  components: {},
  props: {
    id: {
      type: String,
    },
    chartTab: {
      type: Boolean,
      default: false,
    },
    detail: {
      type: Boolean,
      default: false,
    },
    chartTabList: {
      type: Array,
      required: false,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  watch: {},
  methods: {
    selectItem(items, item) {
      radioSelect(items, item);
      this.$emit("changeChartTab", true);
    },
    initEcharts() {
      this.$emit("initEcharts", this.id);
    },
    clickDetail(id) {
      this.$emit("clickDetail", id);
    },
  },
  mounted() {
    this.initEcharts();
  },
};
</script>

<style scoped>
.main-chart {
  flex: 1;
  height: 100%;
  z-index: 998;
}
.chart-tab {
  position: relative;
}
.chart-panel {
  z-index: 2;
  height: 100%;
  width: 100%;
}

.chart-tab .tab-items {
  position: absolute;
  height: 2rem;
  left: 0;
  bottom: -1.5rem;
  z-index: 999;
}
.chart-tab .tab-items .chartTab-item,
.chart-tab .tab-items .chartTab-select {
  display: inline-block;
  cursor: pointer;
  font-size: 0.875rem;
  width: 8rem;
  height: 2.5rem;
  text-align: center;
  line-height: 2rem;
  background: url("../assets/images/chartTab.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.chart-tab .tab-items .chartTab-select {
  background: url("../assets/images/chartTab-slt.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.chart-tab .detail-link {
  position: absolute;
  z-index: 999;
  cursor: pointer;
  right: 2rem;
  /* bottom: 0.5rem; */
  font-size: 0.75rem;
}
.chart-tab .detail-link:hover {
  color: rgb(250, 237, 61);
}
.chart-tab .detail-link span::after {
  content: "";
  position: absolute;
  top: 0.25rem;
  right: -0.8rem;
  width: 0.5rem;
  height: 0.5rem;
  background: url("../assets/images/detail_tri.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}

.chart-panel {
  display: flex;
  justify-content: center;
  align-items: center;
}
.none-data {
  color: #98a8f4;
  font-size: 0.875rem;
}
</style>