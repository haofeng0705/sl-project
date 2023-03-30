<template>
  <div class="measure-bar">
    <ul>
      <li
        v-for="(item, index) in measureBar"
        :key="index"
        :title="item.title"
        @click="selectTarget(measureBar, item)"
      >
        <span
          :class="
            item.isSelect
              ? `iconfont-slt icon-${item.id}`
              : `iconfont icon-${item.id}`
          "
        ></span>
      </li>
    </ul>
  </div>
</template>

<script>
//主要调用 api
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "MeasureBar",
  components: {},
  data() {
    return {
      measureBar: [
        {
          id: "ranging",
          title: "测距",
          isSelect: false,
        },
        {
          id: "M-surface",
          title: "测面",
          isSelect: false,
        },
        {
          id: "triangulation",
          title: "三角测量",
          isSelect: false,
        },
        {
          id: "erase",
          title: "清除",
          isSelect: false,
        },
      ],
    };
  },
  mounted() {
    this.measure = new Cesium.Measure(cesiumViewer, { id: "measureLayer" }); //创建测量对象
  },
  methods: {
    selectTarget(items, item) {
      if (item.isSelect) {
        item.isSelect = false;
        return;
      }
      radioSelect(items, item);
      let clampToGround = true; //是否贴地测量
      if (item.id == "ranging") {
        item.isSelect = true;
        this.measure.drawLineMeasureGraphics({
          id: "measureLayer",
          clampToGround: clampToGround,
          callback: (position) => {
            console.log(position);
          },
        });
      } else if (item.id == "M-surface") {
        item.isSelect = true;
        this.measure.drawAreaMeasureGraphics({
          id: "measureLayer",
          clampToGround: clampToGround,
          callback: (position) => {},
        });
      } else if (item.id == "triangulation") {
        item.isSelect = true;
        this.measure.drawTrianglesMeasureGraphics({
          id: "measureLayer",
          callback: () => {},
        });
      } else if (item.id == "erase") {
        item.isSelect = true;
        this.measure.cancelDraw();
      }
    },
  },
};
</script>

<style scoped>
.measure-bar {
  z-index: 2;
  position: absolute;
  width: 10rem;
  height: 2.6rem;
  display: flex;
  justify-content: center;
  background: url("../assets/images/measurebar.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.measure-bar ul {
  display: flex;
  width: 80%;
  height: 82%;
  justify-content: space-evenly;
}
.measure-bar ul li {
  display: flex;
  align-items: center;
  height: 100%;
}
.measure-bar ul li span {
  transition: all 0.3s;
}
.measure-bar ul li span:hover {
  color: #ffff00;
}
</style>