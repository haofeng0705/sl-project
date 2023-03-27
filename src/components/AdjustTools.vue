<template>
  <div class="adjust-tools">
    <ul>
      <li
        v-for="(item, index) in adjustTools"
        :key="index"
        :title="item.title"
        @click="selectTarget(adjustTools, item)"
      >
        <span :class="`iconfont icon-${item.id}`"></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "AdjustTools",
  components: {},
  data() {
    return {
      adjustTools: [
        {
          id: "green-pen",
          title: "无预警",
          isSelect: false,
        },
        {
          id: "yellow-pen",
          title: "黄色预警",
          isSelect: false,
        },
        {
          id: "orange-pen",
          title: "橙色预警",
          isSelect: false,
        },
        {
          id: "red-pen",
          title: "红色预警",
          isSelect: false,
        },
        {
          id: "updata",
          title: "上传",
          isSelect: false,
        },
        {
          id: "refresh",
          title: "撤销",
          isSelect: false,
        },
      ],
      adjustPosition: [],
    };
  },
  mounted() {
    this.measure = new Cesium.Measure(cesiumViewer, { id: "adjustLayer" }); //创建测量对象
  },
  methods: {
    selectTarget(items, item) {
      if (item.isSelect) {
        item.isSelect = false;
        return;
      }
      radioSelect(items, item);
      let clampToGround = true; //是否贴地测量
      if (item.id == "green-pen") {
        item.isSelect = true;
        this.measure.drawAreaMeasureGraphics({
          id: "greenPenLayer",
          color: 0,
          clampToGround: clampToGround,
          callback: (position) => {
            let strPosition = "";
            position.forEach((item) =>{
              delete item.alt;
              strPosition +=`${item.lat},${item.lng},`
            })
            this.adjustPosition.push({ type: "green", position: strPosition });
          },
        });
      } else if (item.id == "yellow-pen") {
        item.isSelect = true;
        this.measure.drawAreaMeasureGraphics({
          id: "yellowPenLayer",
          color: 1,
          clampToGround: clampToGround,
          callback: (position) => {
             let strPosition = "";
            position.forEach((item) =>{
              delete item.alt;
              strPosition +=`${item.lat},${item.lng},`
            })
            this.adjustPosition.push({ type: "yellow", position: strPosition });
          },
        });
      } else if (item.id == "orange-pen") {
        item.isSelect = true;
        this.measure.drawAreaMeasureGraphics({
          id: "orangePenLayer",
          color: 2,
          clampToGround: clampToGround,
          callback: (position) => {
             let strPosition = "";
            position.forEach((item) =>{
              delete item.alt;
              strPosition +=`${item.lat},${item.lng},`
            })
            this.adjustPosition.push({ type: "orange", position: strPosition });
          },
        });
      } else if (item.id == "red-pen") {
        item.isSelect = true;
        this.measure.drawAreaMeasureGraphics({
          id: "redPenLayer",
          color: 3,
          clampToGround: clampToGround,
          callback: (position) => {
             let strPosition = "";
            position.forEach((item) =>{
              delete item.alt;
              strPosition +=`${item.lat},${item.lng},`
            })
            this.adjustPosition.push({ type: "red", position: strPosition });
            
          },
        });
      } else if (item.id == "updata") {
        this.$confirm(`确认要上传订正结果吗`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((res) => {
            this.$emit("updataModel",this.adjustPosition)
            // console.log(this.adjustPosition);        
          })
          .catch((error) => {});
      } else if (item.id == "refresh") {
        this.$confirm(`确认要还原订正结果吗`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then((res) => {
            this.measure._drawLayer.entities.removeAll();
            this.adjustPosition = [];
            this.$emit("refreshModel",this.adjustPosition)
          })
          .catch((error) => {});
      }
    },
  },
};
</script>

<style scoped>
.adjust-tools {
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
.adjust-tools ul {
  display: flex;
  width: 80%;
  height: 82%;
  justify-content: space-evenly;
}
.adjust-tools ul li {
  display: flex;
  align-items: center;
  height: 100%;
}
.adjust-tools ul li span {
  font-size: 1.125rem;
  transition: all 0.3s;
}
.adjust-tools ul li span:hover {
  transform: translateY(-0.1rem);
}
</style>