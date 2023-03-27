<template>
  <div class="Cruise3D">
    <div class="Cruise-title">
      <div class="title-text">三维巡航</div>
      <div class="title-close" @click="closePanel">
        <span class="iconfont icon-close"></span>
      </div>
    </div>
    <div class="Cruise-param">
      <div class="param-item">
        <span class="param-label">巡航高度:</span>
        <el-input-number
          v-model="cruiseHeight"
          label="巡航高度"
          :step="1"
        ></el-input-number>
      </div>
    </div>
    <div class="Cruise-button">
      <el-button type="primary" plain @click="drawLine">规划巡航路线</el-button>
      <el-button type="success" @click="startCruise" plain>开始巡航</el-button>
      <el-button type="danger" @click="clear" plain>停止巡航</el-button>
    </div>
  </div>
</template>
<script>
import CesiumCore from "@/CesiumCore/index.js";
export default {
  name: "Cruise3D",
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
      cruiseHeight: 8000,
      position: [],
      airEntity: {},
    };
  },
  created() {},
  mounted() {},
  methods: {
    drawLine() {
      if (this.position.length != 0) {
        this.$message.warning("请先清除已绘制巡航路线");
        return;
      } else {
        this.measure = new Cesium.Measure(cesiumViewer, {
          id: "Cruise3D",
        }); //创建测量对象
        this.measure.drawLineMeasureGraphics({
          id: "Cruise3D",
          clampToGround: true,
          callback: (position) => {
            this.position = position;
          },
        });
      }
    },
    startCruise() {
      if (this.position.length != 0) {
        this.measure._drawLayer.entities.removeAll();
        if (this.flag == true) {
          cesiumViewer.entities.remove(this.airEntity);
          this.flag = false;
        }
        const air = new CesiumCore.AirRoute(
          cesiumViewer,
          this.position,
          this.cruiseHeight
        );
        this.airEntity = air.startFly();
        this.flag = true;
      } else {
        this.$message.warning("请先绘制分析区域");
      }
    },
    clear() {
      if (this.position.length != 0) {
        this.position = [];
        this.measure._drawLayer.entities.removeAll();
        cesiumViewer.entities.remove(this.airEntity);
        this.flag = false;
      }
    },
    closePanel() {
      this.$emit("closeCruise3DPanel", false);
    },
  },
  watch: {},
};
</script>

<style scoped>
.Cruise3D {
  z-index: 2;
  position: absolute;
  padding: 1rem;
  border-radius: 1rem;
  top: 20%;
  left: 80%;
  background: rgba(46, 67, 90, 0.8);
  color: #fff;
}
.Cruise-title {
  display: flex;
  justify-content: space-between;
  padding: 0.125rem 0.125rem 0.225rem 0;
  font-weight: 700;
  border-bottom: 0.0625rem solid #ccc;
}
.Cruise-title .title-close span {
  transition: all 0.3s;
}
.Cruise-title .title-close span:hover {
  color: #31bccb;
}
.Cruise-param {
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