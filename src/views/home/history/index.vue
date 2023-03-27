<template>
  <div id="history">
    <div :class="flag.maskFlag ? 'display-mask' : 'hidden-mask'"></div>
    <left-panel @shrink="flag.maskFlag = !flag.maskFlag">
      <div class="history-time">
        <div class="time-select">
          <el-date-picker
            v-model="historyTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </div>
        <div class="confirm-btn history-btn" @click="confirm">确认</div>
      </div>
      <container-panel title="历史内涝数据" style="height: 33%">
        <common-table
          :maxHeight="270"
          style="width: 100%; height: 100%"
          :columns="firstColumns"
          :data="firstTableData"
          :pager="firstPage"
          :stripe="false"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @handleRow="handleHistoryRow"
        ></common-table>
      </container-panel>
      <container-panel title="内涝点详情" style="height: 33%">
        <common-table
          :maxHeight="270"
          style="width: 100%; height: 100%"
          :columns="secondColumns"
          :data="secondTableData"
          :pager="secondPage"
          :stripe="false"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @handleRow="handleWaterLogRow"
        ></common-table>
      </container-panel>
      <container-panel title="内涝描述信息" style="height: 33%">
        <el-input
          class="history-textarea"
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="historyContent"
        >
        </el-input>
      </container-panel>
    </left-panel>
    <layer-panel
      v-show="flag.layerFlag"
      :layerdata="showLayer"
      @layerLegend="handleLayer"
      v-drag
    ></layer-panel>
    <tools-panel
      style="right: 0; top: 8rem"
      :tools="layerTools"
      @handleToolsPanel="handleToolsPanel"
    ></tools-panel>
    <transition name="station">
      <station-panel
        v-drag
        v-if="flag.stationPanelFlag"
        :stationTitle="stationTitle"
        :stationLoading="stationLoading"
        @handleStationClose="flag.stationPanelFlag = false"
      >
        <template #station-chart>
          <chart-panel id="Station"></chart-panel
        ></template>
      </station-panel>
    </transition>
  </div>
</template>

<script>
import CesiumCore from "@/CesiumCore/index.js";
import {
  getHistorical,
  getWaterlogStationbyId,
  getStationbyWaterlog,
  getHourRainFallbyP,
  getCountryPoints,
  getVerify,
  getinStanceFiles,
} from "@/api/index.js";
import {
  addWeatherPoint,
  addFollowPoint,
  addStreetPolyline,
  addRatePoint,
  addMoldelPolygon,
} from "@/selfTools/Entity.js";
import { cloneDeep, formatStreetPolyline,formatDetailLine } from "@/selfTools/FormatData.js";
import { DateFormat } from "@/selfTools/DateTools.js";
import { positionLayer } from "@/views/home/home.js";
import * as historyConfig from "@/views/home/history/history.js";
import LeftPanel from "@/components/LeftPanel.vue";
import ContainerPanel from "@/components/ContainerPanel.vue";
import CommonTable from "@/components/CommonTable.vue";
import ChartPanel from "@/components/ChartPanel.vue";
import ToolsPanel from "@/components/ToolsPanel.vue";
import LayerPanel from "@/components/LayerPanel.vue";
import StationPanel from "@/components/StationPanel.vue";
export default {
  name: "History",
  components: {
    LeftPanel,
    ContainerPanel,
    CommonTable,
    ChartPanel,
    ToolsPanel,
    LayerPanel,
    StationPanel,
  },
  data() {
    return {
      flag: {
        maskFlag: true,
        stationPanelFlag: false,
        layerFlag: false,
        verifyFlag: true,
      },
      historyTime: [],
      stationLoading: true,
      singleStartTime: "",
      singleEndTime: "",
      historyList: [],
      historyContent: "",
      firstColumns: [],
      secondColumns: [],
      firstTableData: [],
      secondTableData: [],
      streetFeatures: [],
      firstPage: {},
      secondPage: {},
      layerTools: [],
      showLayer: [],
      selectLayer: "rConfluence",
      verifyValue: 0,
      defaultStartTime:"",
      defaultEndTime:""
    };
  },
  created() {
    this.initHistory();
  },
  mounted() {
    this.initViewer();
  },
  beforeDestroy() {
    this.circleDiffusion.clear();
    CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
    CesiumCore.deleteDataSource(cesiumViewer);
    CesiumCore.removeEventHandler(cesiumViewer);
    // cesiumViewer._dataSourceCollection.removeAll(true); //清除实体数据集
    // cesiumViewer._dataSourceCollection.add(this.$store.getters.boundaryEntity);
  },
  methods: {
    initHistory() {
      this.positionLayer = positionLayer;
      Object.keys(historyConfig).forEach((item) => {
        this[item] = cloneDeep(historyConfig[item]);
      });
      this.$store.getters.boundary ? "" : this.getBoundary();
      this.getHistory({});
    },
    initEcharts(id) {},
    initViewer() {
      this.circleDiffusion = new CesiumCore.CircleDiffusion(cesiumViewer);
      CesiumCore.clickGetEntitties(cesiumViewer, this.handleEntityEvent);
    },
    handleEntityEvent(pickdObject) {
      let that = this;
      console.log(pickdObject);
      if (pickdObject.type == "historyStation") {
        this.getSingleLine(pickdObject);
        CesiumCore.flyToRecFromPoint(
          cesiumViewer,
          pickdObject.information.lon,
          pickdObject.information.lat
        );
      } else {
        if (pickdObject && pickdObject.information) {
          this.handleWaterLogRow(pickdObject.information);
          // CesiumCore.cameraFlyTo(
          //   cesiumViewer,
          //   pickdObject.information.lon,
          //   pickdObject.information.lat
          // );
        }
      }
    },
    confirm() {
      if (this.historyTime.length != 0) {
        this.getHistory({
          stTime: DateFormat(this.historyTime[0], 2),
          endTime: DateFormat(this.historyTime[1], 2),
        });
      } else {
        this.$message({
          type: "error",
          message: "请选择需要查询的时间段后点击确认。",
        });
      }
    },
    getSingleLine(pickObject) {
      this.flag.stationPanelFlag = true;
      this.stationLoading = true;
      this.stationTitle = `${pickObject.information.name}(${pickObject.information.id})`;
      console.log(this.singleStartTime,this.singleEndTime);
      if (this.singleStartTime != "") {
        getHourRainFallbyP({
          endTime: this.singleEndTime,
          stTime: this.singleStartTime,
          // endTime:"2018-05-18 00:00",
          // stTime:"2018-05-17 00:00",
          stationId: pickObject.information.id,
        })
          .then((res) => {
            if (res.data.length != 0) {
              console.log(res);
            let singleRainData = formatDetailLine(res.data)
            console.log(singleRainData);
            this.$charts.station("Station",singleRainData)
            this.stationLoading = false;
            }
            else{
              this.stationLoading = false;
              this.$message.warning("该时间段暂无数据");
            }
            
          })
          .catch((error) => {
            console.log(error);
            this.stationLoading = false;
            this.$message({ type: "error", message: "服务器错误" });
          });
      }
    },
    //图层面板点击事件，控制显示与隐藏
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
    handleSizeChange(pageSize) {
      this.page.limit = pageSize;
    },
    // 翻页处理
    handleCurrentChange(currentPage) {
      this.page.pageNo = currentPage;
    },
    handleHistoryRow(val) {
      this.singleStartTime = val.startTime;
      this.singleEndTime = val.endTime;
      this.getWaterlogStation(val.id);
      this.getModel(val.id);
    },
    handleWaterLogRow(val) {
      this.getHistoryStation(val, {
        id: val.id,
        lat: val.lat,
        lon: val.lon,
      });
    },
    getHistory(param) {
      getHistorical(param)
        .then((res) => {
          console.log(res);
          let tableData = res.data;
          this.singleEndTime = tableData[0].endtime;
          this.singleStartTime = tableData[0].starttime;
          this.firstTableData = tableData.map((item) => {
            return {
              id: item.id,
              startTime: item.starttime.slice(0, 10),
              endTime: item.endtime.slice(0, 10),
              name: item.town,
              exStaCount: item.overstationamount,
            };
          });
          this.firstPage.total = tableData.length;
          this.firstPage.limit = tableData.length;
          this.getWaterlogStation(tableData[0].id);
          this.historyList = tableData;
          this.historyContent = tableData[0].remark;
          this.getModel(tableData[0].id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getModelVerify(id) {
      getVerify({
        id: id,
        token: this.$store.getters.token,
        model: this.selectLayer,
      }).then((res) => {
        if (res && res.code == 200 && res.items.length > 0) {
          res.items.forEach((supItem) => {
            this.secondTableData.forEach((subItem) => {
              if (supItem.name == subItem.areastation) {
                subItem.modelResult = "正确";
              }
            });
          });
        }
      });
    },
    getModel(id) {
      CesiumCore.deleteDataSource(cesiumViewer);
      getinStanceFiles({
        id: id,
        token: this.$store.getters.token,
      })
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            data.forEach((item, index) => {
              this.addModelEntity(
                `model-${item.model}`,
                item.modelurl,
                index == 0
              );
            });
          } else {
            this.$message({
              type: "warning",
              message: `该历史内涝个例暂无模型数据`,
            });
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
    getWaterlogStation(id) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      getWaterlogStationbyId({ id: id })
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            if (data && data.length > 0) {
              this.secondTableData = data.map((item) => {
                let point = {
                  id: item.id,
                  type: "waterlog",
                  name: item.areastation,
                  lat: item.lat,
                  lon: item.lon,
                  status: item.areainfluence,
                };
                addFollowPoint(
                  cesiumViewer,
                  point,
                  require("@/assets/images/shuiku.png")
                );
                // this.circleDiffusion.add(
                //   [item.lon, item.lat],
                //   "#19d8dd",
                //   1000,
                //   5000
                // );
                return {
                  id: item.id,
                  areainfluence: item.areainfluence,
                  lon: item.lon,
                  lat: item.lat,
                  areastation: item.areastation,
                  modelResult: "未验证",
                };
              });
              this.getModelVerify(id);
              this.historyList.forEach((item) => {
                if (item.id == id) {
                  this.historyContent = item.remark;
                }
              });
              this.secondPage.total = data.length;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    closeVerify(val) {
      this.flag.verifyFlag = !this.flag.verifyFlag;
    },
    handleLayer(...arg) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      this.selectLayer = arg[2];
    },
    getHistoryStation(waterLog, param) {
      this.circleDiffusion.clear();
      CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
      let point = {
        id: waterLog.id,
        type: "waterlog",
        name: waterLog.areastation || waterLog.name,
        lat: waterLog.lat,
        lon: waterLog.lon,
        status: waterLog.areainfluence,
      };
      addRatePoint(cesiumViewer, point, require("@/assets/images/shuiku.png"));
      CesiumCore.flyToRecFromPoint(cesiumViewer, waterLog.lon, waterLog.lat);
      //CesiumCore.viewerFlyTo(cesiumViewer, followEntity);
      this.circleDiffusion.add(
        [waterLog.lon, waterLog.lat],
        "#19d8dd",
        1000,
        5000
      );
      getStationbyWaterlog(param).then((res) => {
        const { data } = res;
        if (data && data.length != 0) {
          data.forEach((item) => {
            let station = {
              type: "historyStation",
              lon: item.lon,
              lat: item.lat,
              name: item.stationName,
              id: item.stationIdC,
              value: item.stationName,
            };
            addWeatherPoint(
              cesiumViewer,
              station,
              require(`@/assets/images/waterlog.png`)
            );
          });
        }
      });
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
    getBoundary() {
      console.log("his", this.$store.getters.boundary);
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
    streetFeatures(val) {
      this.addStreetPolygonEntity();
    },
  },
};
</script>
<style scoped>
#history {
  width: 100%;
  height: 100vh;
}

.history-time {
  display: flex;
  align-items: center;
}
.history-btn {
  margin-left: 0.5rem;
  height: 2.2rem;
  width: 6rem;
  line-height: 1.9rem;
}
.station-enter-active,
.station-leave-active {
  transition: all 0.8s;
}
.station-enter,
.station-leave-to {
  transform: scale(0);
  opacity: 0;
}
.station-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>
