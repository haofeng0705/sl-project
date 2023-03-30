<!-- 主要的就是这个组件 -->
<template>
  <div class="map-box">
    <div id="cesiumContainer"><slot name="poup-info"></slot></div>
  </div>
</template>

<script>
import CesiumCore from "@/CesiumCore/index.js";
// import * as turf from "@turf/turf";
export default {
  name: "Cesium",
  components: {},
  props: {},
  data() {
    return {
      features: [],
    };
  },
  mounted() {
    this.initViewer();
  },
  methods: {
    //初始化viewer
    initViewer() {
      const viewer = CesiumCore.initViewer();
      CesiumCore.setView(viewer);
      this.$emit("handleViewer", viewer); //调用父组件
    },
  },
};
</script> 
<style scoped>
.map-box {
  position: absolute;
  height: 100vh;
  top: 0;
  bottom: 0;
  width: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
