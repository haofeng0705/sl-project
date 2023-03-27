<template>
  <div class="analysis-panel">
    <div class="analysis-title">
      <div class="title-text">淹没分析</div>
      <div class="title-close" @click="closePanel">
        <span class="iconfont icon-close"></span>
      </div>
    </div>
    <div class="analysis-param">
      <div class="param-item">
        <span class="param-label">最大高度:</span>
        <el-input-number
          v-model="maxHeight"
          label="最大高度"
          :step="1"
        ></el-input-number>
      </div>
      <div class="param-item">
        <span class="param-label">最小高度:</span>
        <el-input-number
          v-model="minHeight"
          label="最小高度"
          :step="1"
        ></el-input-number>
      </div>
      <div class="param-item">
        <span class="param-label">淹没时间:</span>
        <el-input-number
          v-model="analysisTime"
          label="淹没时间"
          :step="1"
        ></el-input-number>
      </div>
      <div class="param-item">
        <span class="param-label">透明度:</span>
        <el-input-number
          v-model="waterAlpha"
          label="透明度"
          :min="0"
          :max="1"
          :step="0.1"
        ></el-input-number>
      </div>
    </div>
    <div class="analysis-button">
      <el-button type="primary" plain @click="drawPolygon"
        >绘制分析区域</el-button
      >
      <el-button type="success" @click="startAnalysis" plain
        >开始分析</el-button
      >
      <el-button type="danger" @click="clear" plain>清除</el-button>
    </div>
  </div>
</template>
<script>
import CesiumCore from "@/CesiumCore/index.js";
export default {
  name: "AnalysisPanel",
  props: {
    analysisData: {
      type: Object,
      default: () => {},
    },
  },
  components: {},
  data() {
    return {
      flag: false,
      maxHeight: 10,
      minHeight: 0,
      analysisTime: 8,
      waterAlpha: 0.8,
      position: [],
      induationEntity: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    drawPolygon() {
      if (this.position.length != 0) {
        this.$message.warning("请先清除已绘制分析区域");
        return;
      } else {
        this.measure = new Cesium.Measure(cesiumViewer, {
          id: "induationAnalysis",
        }); //创建测量对象
        this.measure.drawAreaMeasureGraphics({
          id: "induationAnalysis",
          clampToGround: true,
          callback: (position) => {
            this.position = position;
          },
        });
      }
    },
    startAnalysis() {
      if (this.position.length != 0) {
        let degree = [];
        this.position.forEach((item) => {
          degree.push(item.lng, item.lat);
        });
        this.measure._drawLayer.entities.removeAll();
        if (this.flag == true) {
          cesiumViewer.entities.remove(this.induationEntity);
          this.flag = false;
        }
        this.induationEntity = CesiumCore.induationAnalysis(
          cesiumViewer,
          degree,
          this.minHeight,
          this.maxHeight,
          this.analysisTime,
          this.waterAlpha
        );
        this.flag = true;
      } else {
        this.$message.warning("请先绘制分析区域");
      }
    },
    clear() {
      if (this.position.length != 0) {
        this.position = [];
        this.measure._drawLayer.entities.removeAll();
        cesiumViewer.entities.remove(this.induationEntity);
        this.flag = false;
      }
    },
    closePanel() {
      this.$emit("closeAnalysisPanel", false);
    },
  },
  watch: {},
};
</script>

<style scoped>
.analysis-panel {
  z-index: 2;
  position: absolute;
  padding: 1rem;
  border-radius: 1rem;
  top: 20%;
  left: 80%;
  background: rgba(46, 67, 90, 0.8);
  color: #fff;
}
.analysis-title {
  display: flex;
  justify-content: space-between;
  padding: 0.125rem 0.125rem 0.225rem 0;
  font-weight: 700;
  border-bottom: 0.0625rem solid #ccc;
}
.analysis-title .title-close span {
  transition: all 0.3s;
}
.analysis-title .title-close span:hover {
  color: #31bccb;
}
.analysis-param {
  display: flex;
  flex-direction: column;
  margin: 0.1875rem 0;
}
.param-label {
  display: inline-block;
  width: 7.8rem;
  height: 2.5rem;
  margin: 0.125rem 0;
  border-radius: 0.225rem;
  line-height: 2.5rem;
  text-align: center;
  background: rgba(165, 181, 249, 0.6);
}
.param-item {
  display: flex;
  justify-content: space-between;
  margin: 0.1875rem 0;
}
</style>