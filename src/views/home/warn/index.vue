<template>
  <div id="warn">
    <loading v-if="!flag.chartFlag && !flag.chartFlag2" />
    <div :class="flag.maskFlag ? 'display-mask' : 'hidden-mask'"></div>
    <left-Panel
      v-if="flag.chartFlag && flag.chartFlag2"
      @shrink="flag.maskFlag = !flag.maskFlag"
    >
      <div class="warn-time">
        <div class="time-select">
          <el-date-picker
            v-model="warnTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
            @change="confirmTime"
          >
          </el-date-picker>
        </div>
        <!-- <div class="confirm-btn warn-btn">确认</div> -->
      </div>
      <container-panel title="预警级别统计" style="height: 32%">
        <chart-panel
          id="bar-warn-grade"
          @initEcharts="initEcharts"
        ></chart-panel>
      </container-panel>
      <container-panel title="易捞点统计" style="height: 32%">
        <chart-panel
          id="bar-warn-waterlog"
          @initEcharts="initEcharts"
        ></chart-panel
      ></container-panel>
      <container-panel title="内涝点信息" style="height: 36%">
        <common-table
          style="width: 100%; height: 100%"
          :maxHeight="220"
          :columns="tableColumns"
          :data="tableData"
          :pager="tablePage"
          :stripe="false"
          :sort="tableSort"
          @handleCurrentChange="handleCurrentChange"
          @handleRow="handlePointRow"
        ></common-table
      ></container-panel>
    </left-Panel>
    <tools-panel
      style="right: 0; top: 8rem"
      :tools="layerTools"
      @handleToolsPanel="handleToolsPanel"
    ></tools-panel>
    <measure-bar style="right: 12.5rem; top: 8.5rem"></measure-bar>
    <layer-panel
      v-show="flag.layerFlag"
      :layerdata="showLayer"
      @layerLegend="selectLayer"
    ></layer-panel>
    <gis-tools
      style="right: 0; bottom: 4rem"
      :gisTools="gisTools"
      @handleGisToolsPanel="handleGisToolsPanel"
    ></gis-tools>
    <analysis-panel
      v-show="flag.analysisPanelFlag"
      @closeAnalysisPanel="flag.analysisPanelFlag = false"
      v-drag
    ></analysis-panel>
    <Cruise3D
      v-show="flag.cruise3D"
      @closeCruise3DPanel="flag.cruise3D = false"
      v-drag
    ></Cruise3D>
    <!-- <time-axis @playAxis="handleAxis"></time-axis> -->
    <!-- <img
      id="warnimg"
      src="http://192.168.198.1:8060/flood/drainages/2022042100_total.png"
    />
    <canvas id="warncanvas" width="1369" height="1538"></canvas> -->
  </div>
</template>

<script>
import { positionLayer } from "@/views/home/home.js";
import * as warnConfig from "@/views/home/warn/warn.js";
import Loading from "@/components/Loading.vue";
import LeftPanel from "@/components/LeftPanel.vue";
import ContainerPanel from "@/components/ContainerPanel.vue";
import ChartPanel from "@/components/ChartPanel.vue";
import CommonTable from "@/components/CommonTable.vue";
import LayerPanel from "@/components/LayerPanel.vue";
import MeasureBar from "@/components/MeasureBar.vue";
import ToolsPanel from "@/components/ToolsPanel.vue";
import CesiumCore from "@/CesiumCore/index.js";
import TimeAxis from "@/components/TimeAxis.vue";
import GisTools from "@/components/GisTools.vue";
import Cruise3D from "@/components/Cruise3D.vue";
import AnalysisPanel from "@/components/AnalysisPanel.vue";
import { DateFormat } from "@/selfTools/DateTools.js";
import {
  grtDescribeRastertype,
  getStaionInfo,
  getCountryPoints,
  getModelFiles,
} from "@/api/index.js";

import { cloneDeep, formatStreetPolyline } from "@/selfTools/FormatData.js";
import { CanvasInfo } from "@/selfTools/CanvasInfo.js";
import {
  addMoldelPolygon,
  addStreetPolyline,
  addRatePoint,
} from "@/selfTools/Entity.js";
export default {
  name: "Warn",
  components: {
    Loading,
    LeftPanel,
    ContainerPanel,
    ChartPanel,
    CommonTable,
    LayerPanel,
    MeasureBar,
    TimeAxis,
    ToolsPanel,
    GisTools,
    Cruise3D,
    AnalysisPanel,
  },
  data() {
    return {
      flag: {
        maskFlag: true,
        chartFlag: false,
        chartFlag2: false,
        layerFlag: false,
        analysisPanelFlag: false,
        cruise3D: false,
      },
      warnTime: new Date(),
      containerTab: [],
      tableColumns: [],
      tableData: [],
      cRain: [],
      rConfluence: [],
      uRainFlood: [],
      tablePage: {},
      modelLayer: [],
      showLayer: [],
      layerTools: [],
      warnGrade: {},
      warnWaterlog: {},
      modelAxis: {},
      station: [],
      colorFinal: [],
      streetFeatures: [],
      positionLayer: [],
      tableSort: { prop: "grade", order: "descending" },
    };
  },
  created() {
    this.initWarn();
    // this.handleToolsPanel("modelLayer",true);
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
    initWarn() {
      this.positionLayer = positionLayer;
      Object.keys(warnConfig).forEach((item) => {
        this[item] = cloneDeep(warnConfig[item]);
      });
      this.$store.getters.boundary ? "" : this.getBoundary();
      this.getStaion();
    },
    initEcharts(id) {
      if (id == "bar-warn-grade" && Object.keys(this.warnGrade).length != 0) {
        this.$charts.bar(id, this.warnGrade);
      } else if (
        id == "bar-warn-waterlog" &&
        Object.keys(this.warnWaterlog).length != 0
      ) {
        this.$charts.bar(id, this.warnWaterlog);
      }
    },
    initViewer() {
      this.circleDiffusion = new CesiumCore.CircleDiffusion(cesiumViewer);
      CesiumCore.clickGetEntitties(cesiumViewer, this.handleEntityEvent);
    },
    handleEntityEvent(pickdObject) {
      if (Cesium.defined(pickdObject) && pickdObject._name) {
      }
    },
    // 翻页处理
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
    },
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
    handleGisToolsPanel(id, bool) {
      if (bool) {
        if (id == "induationAnalysis") {
          this.flag.cruise3D = false;
          this.flag.analysisPanelFlag = true;
        } else if (id == "Cruise3D") {
          this.flag.analysisPanelFlag = false;
          this.flag.cruise3D = true;
        }
      } else {
        this.flag.cruise3D = false;
        this.flag.analysisPanelFlag = false;
      }
    },
    confirmTime(val) {
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      CesiumCore.deleteDataSource(cesiumViewer);
      this.requireModelInfo(val);
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
    requireModelInfo(warnTime) {
      let formatDate = DateFormat(warnTime, 4);
      this.warnGrade.xAxis = [];
      this.warnGrade.data = [[], [], [], []];
      this.warnWaterlog.data = [];
      let warnData = [];
      getModelFiles({
        name: formatDate,
      })
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            if (data && data.length > 0) {
              for (let i = 0; i < data.length; i++) {
                if (data[i].modelUrl && data[i].modelUrl == "") {
                  console.log(1);
                  this.$message.warning(
                    `${formatDate}时间段模型文件暂未读取完毕`
                  );
                  var frontOneHour = new Date(
                    warnTime.getTime() - 1 * 60 * 60 * 1000
                  );
                  this.warnTime = frontOneHour;
                  this.requireModelInfo(frontOneHour);
                  return;
                }
              }
              data.forEach((item, index) => {
                warnData.push(item.area);
                this.warnGrade.xAxis.push(item.name);
                this.addModelEntity(
                  `model-${item.model}`,
                  item.modelurl,
                  index == 0
                );
                this.createCanvas(this.station, item.modelurl, item.model);
              });
              this.warnGrade.data = warnData[0].map((col, i) =>
                warnData.map((row) => row[i].toFixed(2))
              );
            }
          } else {
            this.$message({
              type: "warning",
              message: `${formatDate}时间段暂无数据`,
            });
            var frontOneHour = new Date(
              warnTime.getTime() - 1 * 60 * 60 * 1000
            );
            this.warnTime = frontOneHour;
            this.requireModelInfo(frontOneHour);
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: `服务器错误`,
          });
        });
    },
    handleAxis(bool) {
      let rate = 0;
      let dayCurrent = 21;
      let dayEnd = 23;
      let hourCurrent = 0;
      let hourEnd = 23;
      let isConstant = false;
      let func = new Cesium.CallbackProperty(function () {
        if (dayCurrent < dayEnd) {
          if (rate == 1) {
            rate = 0;
            if (hourCurrent < hourEnd) {
              hourCurrent++;
              return `/api/workdir/flood/drainages/202204${dayCurrent}${
                hourCurrent < 10 ? "0" + hourCurrent : hourCurrent
              }.png`;
            } else {
              dayCurrent++;
              hourCurrent = 0;
              if (dayCurrent == dayEnd) {
                return `/api/workdir/flood/drainages/2022042100_total.png`;
              }
              return `/api/workdir/flood/drainages/202204${dayCurrent}${
                hourCurrent < 10 ? "0" + hourCurrent : hourCurrent
              }.png`;
            }
          } else {
            rate++;
            return `/api/workdir/flood/drainages/202204${dayCurrent}${
              hourCurrent < 10 ? "0" + hourCurrent : hourCurrent
            }.png`;
          }
        } else {
          return `/api/workdir/flood/drainages/2022042100_total.png`;
        }
      }, isConstant);
      if (modelAxis) {
        if (bool) {
          modelAxis.rectangle.material.image = func;
        }
      }
    },
    changeContainerTab(text, id) {
      this.tableData = this[id];
      this.tablePage.pageNo = 1;
    },
    addModelEntity(modelName, modelUrl, show = false) {
      let dataSource = CesiumCore.creatDataSource(
        cesiumViewer,
        modelName,
        show
      );
      let cRainModel = addMoldelPolygon(
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
        let row = Math.ceil((y0 - item.lat) / yCellsize);
        let col = Math.ceil((item.lon - x0) / xCellsize);
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
                type: "station",
                lon: item.lon,
                lat: item.lat,
                number: item.stationIdC,
                name: item.stationName,
                grade: bandRange[bandGrade],
                bandGrade: bandGrade,
              };
            }
          }
        }
        return {
          type: "station",
          lon: item.lon,
          lat: item.lat,
          number: item.stationIdC,
          name: item.stationName,
          grade: bandRange[bandGrade],
          bandGrade: bandGrade,
        };
      }).sort((a, b) => {
        return b.bandGrade - a.bandGrade;
      });
      if (model == "rConfluence") this.tableData = this[model];
      this.tablePage.total = this.tableData.length;
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
      this.warnWaterlog.data.push(colorCount);
    },
    createCanvas(station, modelUrl, modelName) {
      let canvasObj = new CanvasInfo(modelUrl, 429, 668);
      canvasObj.getCanvasBand().then((imgData) => {
        this.statCanvasBand(
          modelName,
          imgData,
          429,
          668,
          station,
          103.791136663,
          30.670437484,
          0.000588179,
          0.000588179
        );
      });
    },
    handlePointRow(val) {
      let bandRange = ["#19d8dd", "#fff301", "#ffbd01", "#ff6969"];
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      addRatePoint(cesiumViewer, val, require("@/assets/images/shuiku.png"));
      this.circleDiffusion.add(
        [val.lon, val.lat],
        bandRange[val.bandGrade],
        1000,
        5000
      );
      CesiumCore.flyToRecFromPoint(cesiumViewer, val.lon, val.lat);
      //CesiumCore.viewerFlyTo(cesiumViewer, stationEntity);
    },
    getStaion() {
      this.$store.getters.warnstationList.length > 0
        ? (this.station = this.$store.getters.warnstationList)
        : getStaionInfo()
            .then((res) => {
              const { data: station } = res;
              this.station = station;
              this.$store.commit("station/UP_WARNSTATIONLIST", station);
            })
            .catch((error) => {
              console.log(error);
            });
    },
    selectLayer(...args) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      let layer = args[2];
      this.tableData = this[layer];
      this.tablePage.pageNo = 1;
    },
    getBoundary() {
      console.log("warn", this.$store.getters.boundary);
      getCountryPoints({
        token: this.$store.getters.token,
      })
        .then((res) => {
          if (res.code == 200) {
            this.streetFeatures = formatStreetPolyline(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
  watch: {
    "warnGrade.xAxis"(val) {
      this.flag.chartFlag = false;
      if (val.length == 3) {
        this.flag.chartFlag = true;
      }
    },
    "warnWaterlog.data"(val) {
      this.flag.chartFlag2 = false;
      if (val.length == 3) {
        this.flag.chartFlag2 = true;
      }
    },
    streetFeatures(val) {
      this.addStreetPolygonEntity();
    },
    station() {
      //this.warnTime = new Date(2022, 10, 10, 16);
      this.requireModelInfo(this.warnTime);
    },
  },
};
</script>
<style scoped>
#warn {
  width: 100%;
  height: 100vh;
}
.warn-time {
  display: flex;
  align-items: center;
}
.warn-btn {
  margin-left: 2rem;
  width: 8rem;
  height: 2.2rem;
  line-height: 1.9rem;
}
</style>
