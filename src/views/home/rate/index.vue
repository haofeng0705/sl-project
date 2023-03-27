<template>
  <div id="rate">
    <loading v-show="!this.flag.chartFlag" />
    <div :class="flag.maskFlag ? 'total-mask ' : 'hidden-mask'"></div>
    <left-panel @shrink="flag.maskFlag = !flag.maskFlag">
      <div class="rate-time">
        <div class="time-select">
          <el-date-picker
            v-model="rateTime"
            type="datetime"
            default-time="12:00:00"
            @change="confirmTime"
          >
          </el-date-picker>
        </div>
      </div>
      <container-panel
        v-if="flag.chartFlag"
        title="综合评估指标"
        style="height: 35%"
      >
        <chart-panel id="bar-rate" @initEcharts="initEcharts"></chart-panel>
      </container-panel>
      <container-panel title="评估指标及等级" style="height: 13%">
        <common-table
          :maxHeight="800"
          style="width: 100%; height: 100%"
          :columns="staticColumns"
          :data="staticTableData"
          :pager="staticPage"
          :stripe="false"
          @handleCurrentChange="handleStaticChange"
        ></common-table>
      </container-panel>
      <container-panel title="径流汇流易损性分析" style="height: 45%">
        <common-table
          :maxHeight="800"
          style="width: 100%; height: 100%"
          :columns="fragilityColumns"
          :data="fragilityData"
          :pager="fragilityPage"
          :stripe="false"
        ></common-table>
      </container-panel>
    </left-panel>
    <right-panel>
      <container-panel title="受灾点详情" style="height: 100%">
        <common-table
          :maxHeight="1000"
          style="width: 100%; height: 100%"
          :columns="pointColumns"
          :data="pointTableData"
          :pager="pointPage"
          :stripe="false"
          @handleCurrentChange="handlePointChange"
          @handleRow="handlePointRow"
        ></common-table> </container-panel
    ></right-panel>
    <tools-panel
      style="right: 0; top: 5rem"
      :tools="layerTools"
      @handleToolsPanel="handleToolsPanel"
    ></tools-panel>
    <layer-panel
      v-show="flag.layerFlag"
      :layerdata="showLayer"
      @layerLegend="selectLayer"
    ></layer-panel>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue";
import LeftPanel from "@/components/LeftPanel.vue";
import RightPanel from "@/components/RightPanel.vue";
import ContainerPanel from "@/components/ContainerPanel.vue";
import ToolsPanel from "@/components/ToolsPanel.vue";
import ChartPanel from "@/components/ChartPanel.vue";
import LayerPanel from "@/components/LayerPanel.vue";
import CommonTable from "@/components/CommonTable.vue";
import CesiumCore from "@/CesiumCore/index.js";
import { cloneDeep, formatStreetPolyline } from "@/selfTools/FormatData.js";
import { DateFormat } from "@/selfTools/DateTools.js";
import { positionLayer } from "@/views/home/home.js";
import * as rateConfig from "@/views/home/rate/rate.js";
import { CanvasInfo } from "@/selfTools/CanvasInfo.js";
import {
  addStreetPolyline,
  addMoldelPolygon,
  addRatePoint,
} from "@/selfTools/Entity.js";
import {
  getPoiStation,
  getCountryPoints,
  getStaticRate,
  getModelFiles,
  getFragility,
} from "@/api/index.js";
export default {
  name: "Rate",
  components: {
    Loading,
    LeftPanel,
    RightPanel,
    ContainerPanel,
    ChartPanel,
    CommonTable,
    ToolsPanel,
    LayerPanel,
  },
  data() {
    return {
      flag: {
        maskFlag: true,
        chartFlag: false,
        layerFlag: false,
      },
      evaluation: {},
      damageArea: {},
      colorFinal: [],
      pointColumns: [],
      pointTableData: [],
      staticColumns: [],
      fragilityColumns: [],
      fragilityData: [],
      staticTableData: [],
      containerTab: [],
      showLayer: [],
      positionLayer: [],
      streetFeatures: [],
      poiList: [],
      rateChart: {},
      rateTime: new Date(),
      pointPage: {
        pageNo: 1,
        limit: 23,
        total: 0, //总数据量
        show: true,
        layout: " prev, pager,next",
      },
      staticPage: {
        pageNo: 1,
        limit: 1,
        total: 1, //总数据量
        show: false,
      },
      fragilityPage: {
        pageNo: 1,
        limit: 1,
        total: 1, //总数据量
        show: false,
      },
    };
  },
  created() {
    this.initRate();
  },
  mounted() {
    this.initViewer();
  },
  beforeDestroy() {
    this.circleDiffusion.clear();
    CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
    CesiumCore.deleteDataSource(cesiumViewer);
    CesiumCore.removeEventHandler(cesiumViewer);
  },
  methods: {
    initRate() {
      this.positionLayer = positionLayer;
      Object.keys(rateConfig).forEach((item) => {
        this[item] = cloneDeep(rateConfig[item]);
      });
      this.$store.getters.boundary ? "" : this.getBoundary();
      this.getPoi();
      this.staticRateData({
        name: DateFormat(this.rateTime, 4),
        token: this.$store.getters.token,
      });
      //this.rateTime = new Date(2022, 10, 10, 16);
      this.getFragilityData({
        name: DateFormat(this.rateTime, 4),
        model: "rConfluence",
        token: this.$store.getters.token,
      });
    },

    initViewer() {
      this.circleDiffusion = new CesiumCore.CircleDiffusion(cesiumViewer);
      CesiumCore.clickGetEntitties(cesiumViewer, this.handleEntityEvent);
    },
    initEcharts(id) {
      if (id == "bar-rate" && Object.keys(this.rateChart).length != 0) {
        this.$charts.bar(id, this.rateChart);
      }
    },
    requireModelInfo(rateTime) {
      let formatDate = DateFormat(rateTime, 4);
      getModelFiles({ name: formatDate })
        .then((res) => {
          if (res && res.code == 200) {
            this.rateChart.data = [];
            const { data } = res;
            if (data && data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].modelUrl && data[i].modelUrl == "") {
                  this.$message.warning(`${formatDate}时间段暂无数据`);
                  var frontOneHour = new Date(
                    rateTime.getTime() - 1 * 60 * 60 * 1000
                  );
                  this.rateTime = frontOneHour;
                  this.requireModelInfo(frontOneHour);
                  return;
                }
              }
              data.forEach((item, index) => {
                this.addModelEntity(
                  `model-${item.model}`,
                  item.modelurl,
                  index == 0
                );
                this.createCanvas(this.poiList, item.modelurl, item.model);
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: `${formatDate}时间段暂无数据`,
            });
            var frontOneHour = new Date(
              rateTime.getTime() - 1 * 60 * 60 * 1000
            );
            this.rateTime = frontOneHour;
            this.requireModelInfo(frontOneHour);
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            type: "error",
            message: `服务器错误`,
          });
        });
    },
    handlePointRow(val) {
      this.getRateLocation(val);
    },
    // changeContainerTab(text, id) {
    //   this.pointTableData = this[id];
    //   this.pointPage.pageNo = 1;
    // },

    handleToolsPanel(id, bool) {
      if (id && this[id]) {
        if (bool) {
          this.showLayer = this[id];
          this.flag.layerFlag = true;
          return;
        }
        this.flag.layerFlag = false;
      }
    },
    selectLayer(...args) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      let layer = args[2];
      if (layer == "Fragility") return;
      this.pointTableData = this[layer];
      this.pointPage.pageNo = 1;
    },
    getRateLocation(waterLog) {
      let bandRange = ["#19d8dd", "#fff301", "#ffbd01", "#ff6969"];
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      let point = {
        id: waterLog.location,
        type: "waterlog",
        name: waterLog.name,
        lon: waterLog.lon,
        lat: waterLog.lat,
        status: waterLog.status,
      };
      addRatePoint(cesiumViewer, point, require("@/assets/images/shuiku.png"));
      this.circleDiffusion.add(
        [waterLog.lon, waterLog.lat],
        bandRange[waterLog.bandGrade],
        1000,
        5000
      );
      CesiumCore.flyToRecFromPoint(cesiumViewer, waterLog.lon, waterLog.lat);
      //CesiumCore.viewerFlyTo(cesiumViewer, followEntity);
    },
    handlePointChange(currentPage) {
      this.pointPage.pageNo = currentPage;
    },
    handleStaticChange(currentPage) {
      this.staticPage.pageNo = currentPage;
    },
    confirmTime(val) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      CesiumCore.deleteDataSource(cesiumViewer);
      this.staticRateData({
        name: DateFormat(this.rateTime, 4),
        token: this.$store.getters.token,
      });
      this.getFragilityData({
        name: DateFormat(this.rateTime, 4),
        model: "rConfluence",
        token: this.$store.getters.token,
      });
      this.requireModelInfo(val);
    },

    statCanvasBand(
      model,
      imgData,
      width,
      height,
      PointArr,
      x0,
      y0,
      xCellsize,
      yCellsize
    ) {
      let bandRange = ["无预警", "黄色预警", "橙色预警", "红色预警"];
      this[model] = PointArr.map((item) => {
        let row = Math.ceil((y0 - item[1]) / yCellsize);
        let col = Math.ceil((item[0] - x0) / xCellsize);
        let startRow = row == 0 ? row : row - 1;
        let endRow = row == height - 1 ? row : row + 1;
        let startCol = col == 0 ? col : col - 1;
        let endCol = col == width - 1 ? col : col + 1;
        let bandGrade = 0;
        for (let i = startRow; i <= endRow; i++) {
          for (let j = startCol; j <= endCol; j++) {
            let bandValue = imgData[i][j]; //bandValue[index]是为了判断当前片元的颜色，bandGrade是为了判断3*3范围的片元此时最高等级是什么
            if (!bandValue) continue;
            if (bandValue[0] == 0) {
              continue; //当前等级为0 继续遍历;
            } else if (bandValue[1] == 255 && bandGrade < 1) {
              bandGrade = 1;
            } else if (bandValue[1] == 128 && bandGrade < 2) {
              bandGrade = 2; //bandGrade等级小于2时进入
            } else if (bandValue[1] == 0 && bandGrade < 3) {
              bandGrade = 3; //如果3*3邻域的网格中有红色预警 直接返回红黄色预警等级不再继续循环
              return {
                name: item[2],
                status: item[4],
                location: item[3],
                lat: item[1],
                lon: item[0],
                grade: bandRange[bandGrade],
                bandGrade: bandGrade,
              };
            }
          }
        }
        return {
          name: item[2],
          status: item[4],
          location: item[3],
          lat: item[1],
          lon: item[0],
          grade: bandRange[bandGrade],
          bandGrade: bandGrade,
        };
      }).sort((a, b) => {
        return b.bandGrade - a.bandGrade;
      });
      if (model == "rConfluence") this.pointTableData = this[model];
      this.pointPage.total = this.pointTableData.length;
      let colorCount = [0, 0, 0, 0];
      this[model].forEach((item) => {
        if (item.grade == "无预警") {
          colorCount[0]++;
        } else if (item.grade == "黄色预警") {
          colorCount[1]++;
        } else if (item.grade == "橙色预警") {
          colorCount[2]++;
        } else if (item.grade == "红色预警") {
          colorCount[3]++;
        }
      });
      this.rateChart.data.push(colorCount);
    },
    addStreetPolygonEntity() {
      let dataSource = CesiumCore.creatDataSource(
        cesiumViewer,
        "street",
        true,
        1
      );
      this.streetFeatures.forEach((features) => {
        addStreetPolyline(dataSource, features);
      });
      this.$store.commit("station/UP_BOUNDARY", 1);
    },
    createCanvas(station, modelUrl, modelName) {
      let canvasObj = new CanvasInfo(modelUrl, 429, 668);
      canvasObj
        .getCanvasBand()
        .then((imgData) => {
          this.statCanvasBand(
            modelName,
            imgData,
            429,
            668,
            station,
            103.791136663,
            30.670437484,
            0.000588,
            0.000588
          );
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getPoi() {
      this.$store.getters.ratestationList.length > 0
        ? (this.poiList = this.$store.getters.ratestationList)
        : getPoiStation({
            token: this.$store.getters.token,
          })
            .then((res) => {
              if (res.code !== 404) {
                const { data: station } = res;
                this.poiList = station;
                this.$store.commit("station/UP_RATESTATIONLIST", station);
              } else {
                this.$message({ type: "error", message: "灾损点请求失败" });
              }
            })
            .catch((error) => {
              console.log(error);
            });
    },
    getFragilityData(param) {
      getFragility(param).then((res) => {
        if (res && res.code == 200) {
          if (res.data.length > 0) {
            const { vill } = res.data[0];
            this.addModelEntity("model-Fragility", res.data[0].modelurl, false);
            this.fragilityData = vill.map((item) => {
              return {
                name: item.Name,
                area: item.area,
                per: item.per,
                value: item.value,
              };
            });
            this.fragilityPage.total = this.fragilityData.length;
            this.fragilityPage.limit = this.fragilityData.length;
          }
        }
      });
    },
    staticRateData(param) {
      getStaticRate(param)
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            const statisData = {
              pre: data.I_Pre,
              pin: data.I_Pin,
              cov: data.I_Cov,
              hra: data.I_Hra,
              grade: data.grade,
            };
            this.staticTableData.push(statisData);
          } else {
            this.$message({ type: "error", message: "获取评估指标数据失败" });
          }
        })
        .catch((error) => {
          this.$message({ type: "error", message: "获取评估指标数据失败" });
          console.log(error);
        });
    },
    addModelEntity(modelName, modelUrl, show = false) {
      let dataSource = CesiumCore.creatDataSource(
        cesiumViewer,
        modelName,
        show
      );
      addMoldelPolygon(
        dataSource,
        new Cesium.Rectangle.fromDegrees(
          103.791136663,
          30.2775335384,
          104.043465694,
          30.670437484
        ),
        modelUrl
      );
      //global.modelAxis = cRainModel;
    },
    getBoundary() {
      console.log("rate", this.$store.getters.boundary);
      getCountryPoints({
        token: this.$store.getters.token,
      })
        .then((res) => {
          if (res && res.code == 200) {
            this.streetFeatures = formatStreetPolyline(res.data);
            console.log(res);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    "rateChart.data"(val) {
      this.flag.chartFlag = false;
      if (val.length == 3) {
        this.flag.chartFlag = true;
      }
    },
    poiList(val) {
      //this.rateTime = new Date(2022, 10, 10, 16);
      this.requireModelInfo(this.rateTime);
    },
    streetFeatures(val) {
      this.addStreetPolygonEntity();
    },
  },
};
</script>
<style scoped>
#rate {
  width: 100%;
  height: 100vh;
}
.rate-time {
  display: flex;
  align-items: center;
}
#rate .commonTable {
  overflow: auto;
}

#rate .commonTable::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
  border-radius: 0.625rem;
}

#rate .commonTable::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #0084ff40;
}

#rate .commonTable::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(76, 92, 132, 0.8);
  background: #0084ff40;
}
</style>
