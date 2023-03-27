<template>
  <div class="tileModelTool">
    <p>比例：</p>
    <el-input-number
      v-model="tileModelTool.scale"
      label="描述文字"
      @change="update3dtilesMaxtrix()"
      :step="0.1"
    ></el-input-number>
    <!-- <p>位置：</p> -->
    <p>经度：</p>
    <el-input-number
      v-model="tileModelTool.longitude"
      label="描述文字"
      @change="update3dtilesMaxtrix()"
      :step="0.00001"
    ></el-input-number>
    <p>纬度：</p>
    <el-input-number
      v-model="tileModelTool.latitude"
      label="描述文字"
      @change="update3dtilesMaxtrix()"
      :step="0.00001"
    ></el-input-number>
    <p>高度：</p>
    <el-slider
      v-model="tileModelTool.height"
      @input="update3dtilesMaxtrix"
      :min="-1000"
      :max="1000"
    ></el-slider>
    <p>以x轴旋转</p>
    <el-slider
      v-model="tileModelTool.rx"
      @input="update3dtilesMaxtrix"
      :min="-100"
      :max="100"
    ></el-slider>
    <p>以y轴旋转</p>
    <el-slider
      v-model="tileModelTool.ry"
      @input="update3dtilesMaxtrix"
      :min="-100"
      :max="100"
    ></el-slider>
    <p>以z轴旋转</p>
    <el-slider
      v-model="tileModelTool.rz"
      @input="update3dtilesMaxtrix"
      :min="-100"
      :max="100"
    ></el-slider>

    <p>透明度</p>
    <el-slider
      v-model="tileModelTool.alpha"
      @input="update3dtilesMaxtrix"
      :min="0"
      :max="1"
      :step="0.1"
    ></el-slider>
  </div>
</template>
<script>
export default {
  name: "TileModelTool",
  props: {
    tileModelTool: {
      type: Object,
      default: () => {
        return {
          scale: 1.0,
          longitude: 104.307272,
          latitude: 30.608324,
          height: 419, //修改高度
          rx: 0,
          ry: 0,
          rz: 33.5, //修改旋转
          alpha: 0.5,
        };
      },
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  mounted() {},
  methods: {
    update3dtilesMaxtrix() {
      var mx = Cesium.Matrix3.fromRotationX(
        Cesium.Math.toRadians(this.tileModelTool.rx)
      );
      var my = Cesium.Matrix3.fromRotationY(
        Cesium.Math.toRadians(this.tileModelTool.ry)
      );
      var mz = Cesium.Matrix3.fromRotationZ(
        Cesium.Math.toRadians(this.tileModelTool.rz)
      );
      var rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      var rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      var rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);
      //平移 修改经纬度
      var position = Cesium.Cartesian3.fromDegrees(
        this.tileModelTool.longitude,
        this.tileModelTool.latitude,
        this.tileModelTool.height
      );
      var m = Cesium.Transforms.eastNorthUpToFixedFrame(position);
      //旋转、平移矩阵相乘
      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m);
      //缩放 修改缩放比例
      var scale = Cesium.Matrix4.fromUniformScale(this.tileModelTool.scale);
      Cesium.Matrix4.multiply(m, scale, m);
      //赋值给tileset
      global.tileModel._root.transform = m;
      //调整地下透明度
      global.viewer.scene.globe.translucency.frontFaceAlphaByDistance.nearValue =
        Cesium.Math.clamp(this.tileModelTool.alpha, 0.0, 1.0);
    },
  },
  watch: {
    tileModelTool(curVal, oldVal) {
      //动态监听info数据
      if (curVal) {
        this.tileModelTool = curVal;
        console.log(curVal);
      }
    },
  },
};
</script>

<style scoped>
.tileModelTool {
  color: #fff;
  position: absolute;
  padding: 1rem;
  width: 30rem;
  border-radius: 1rem;
  z-index: 2;
  top: 20%;
  left: 50%;
  background: #17253180;
}
</style>