<template>
  <div id="monitor">
    <loading v-show="!flag.rainChartFlag && !flag.hyChartFlag" />
    <div :class="flag.maskFlag ? 'display-mask' : 'hidden-mask'"></div>
    <poup-info
      ref="poupInfo"
      :info="infoContent"
      @closePoup="closePoup"
    ></poup-info>
    <left-panel @shrink="flag.maskFlag = !flag.maskFlag">
      <container-panel
        v-if="flag.rainChartFlag"
        title="降水站点统计"
        tabTitle="降雨量"
        :containerTab="containerTab"
        @changeContainerTab="changeContainerTab"
        style="height: 50%"
      >
        <chart-panel
          id="pie-monitor"
          detail
          chartTab
          @clickDetail="clickDetail"
          @initEcharts="initEcharts"
        ></chart-panel>
        <!-- :chartTabList="chartTabList"
          @changeChartTab="changeChartTab" -->
        <chart-panel
          id="point-monitor"
          @initEcharts="initEcharts"
        ></chart-panel>
      </container-panel>
      <container-panel
        v-if="flag.hyChartFlag"
        title="水文监测"
        style="height: 23%"
      >
        <chart-panel
          id="line-monitor"
          detail
          @initEcharts="initEcharts"
          @clickDetail="clickDetail"
        ></chart-panel>
      </container-panel>
      <container-panel v-if="flag.tableFlag" title="最大降水站点排序">
        <common-table
          :maxHeight="180"
          style="width: 100%; height: 100%"
          :columns="tableColumns"
          :data="tableData"
          :pager="outTablePage"
          :stripe="true"
          @handleCurrentChange="handleCurrentChange"
        ></common-table>
      </container-panel>
    </left-panel>
    <tools-panel
      style="right: 0; top: 8rem"
      :tools="layerTools"
      @handleToolsPanel="handleToolsPanel"
    ></tools-panel>
    <measure-bar style="right: 12.5rem; top: 8.5rem"></measure-bar>
    <chart-detail
      v-if="flag.chartDetailFlag"
      @clickDetailIcon="flag.chartDetailFlag = false"
    >
      <template #parameter>
        <param-row
          mode="row"
          :param="detailParam"
          @chartDetailParam="chartDetailParam"
        >
          <template #timeRange>
            <el-date-picker
              v-if="flag.customTime"
              v-model="timeRange"
              @change="setTimeChange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
          </template>
          <template #confirmBtn>
            <div class="confirm-btn" @click="handleConfirm">确认</div>
          </template></param-row
        ></template
      >
      <template #detail-chart>
        <chart-panel id="detail-chart"></chart-panel
      ></template>
      <template #detail-table>
        <common-table
          id="detailTable"
          style="width: 100%; height: 100%"
          :maxHeight="600"
          :columns="detailTableColumn2"
          :data="tableData2"
          :pager="innerTablePage"
          @handleCurrentChange="handleCurrentChange"
        ></common-table>
      </template>
      <template #detail-list>
        <param-column
          ref="paramColumn"
          :paramdata="trueStaionList"
          :checkValue="stationList"
          :selOptions="typeOptions"
          :defaultValue="hydrologyType"
          @handleCheckBox="handleCheckBox"
          @getDataType="getHydrologyType"
        >
          <!-- <template #title-slot>
            <el-select v-model="selectValue" placeholder="请选择">
              <el-option
                v-for="item in DetailListOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select> 
            </template> -->
        </param-column>
      </template></chart-detail
    >
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
    <time-axis
      v-if="flag.axisFlag"
      ref="axis"
      :defaultValue="axisParam.axisValue"
      :marks="axisParam.marks"
      :step="axisParam.step"
      :max="axisParam.max"
      @playAxis="handleAxis"
      @change="changeAxis"
    ></time-axis>
    <layer-panel
      v-show="flag.layerFlag"
      :layerdata="showLayer"
      @layerLegend="setLegendData"
      v-drag
    ></layer-panel>
    <legend-box v-if="flag.legendFlag" :legend="legendData"></legend-box>
  </div>
</template>

<script>
import { positionLayer } from "@/views/home/home.js";
import * as monitorConfig from "@/views/home/monitor/monitor.js";
import CesiumCore from "@/CesiumCore/index.js";
import Loading from "@/components/Loading.vue";
import LeftPanel from "@/components/LeftPanel.vue";
import ContainerPanel from "@/components/ContainerPanel.vue";
import ChartPanel from "@/components/ChartPanel.vue";
import CommonTable from "@/components/CommonTable.vue";
import ToolsPanel from "@/components/ToolsPanel.vue";
import MeasureBar from "@/components/MeasureBar.vue";
import TimeAxis from "@/components/TimeAxis.vue";
import LayerPanel from "@/components/LayerPanel.vue";
import ChartDetail from "@/components/ChartDetail.vue";
import StationPanel from "@/components/StationPanel.vue";
import ParamRow from "@/components/ParamRow.vue";
import ParamColumn from "@/components/ParamColumn.vue";
import PoupInfo from "@/components/PoupInfo.vue";
import LegendBox from "@/components/LegendBox.vue";
import {
  addWeatherPoint,
  addFollowPoint,
  addRedarPolygon,
  addStreetPolyline,
} from "@/selfTools/Entity.js";
import { DateFormat, SpecifTime } from "@/selfTools/DateTools.js";
import {
  unique,
  cloneDeep,
  formatStreetPolyline,
  formatDetailLine,
  formatDetailLineforHour,
  singleLineforMin,
  singleLineforHour,
  sliceMinData,
  formatDifferentTime,
} from "@/selfTools/FormatData.js";
import {
  getRainStat,
  getDifferTypesRainDatabyType,
  getRainStationOrderbyTag,
  getRainDistributionbyP,
  getRegionalFocusDatabyType,
  getMinRainFallbyP,
  getStaionInfo,
  getHourRainFallbyP,
  getSysDataClassify,
  getCountryPoints,
  getWatercourseKey,
  getHydrologyStations,
  getWatercourseRecentData,
  getReservoirWaterRecentData,
  getWatercourseData,
  getReservoirWaterData,
  getRadarQpeQpfByHours,
  getTestPoint,
  getTestRainLine,
  getTestSingleLine,
  getTestRainLineForHour,
} from "@/api/index.js";
export default {
  name: "Monitor",
  components: {
    Loading,
    LeftPanel,
    ChartPanel,
    ContainerPanel,
    CommonTable,
    ToolsPanel,
    MeasureBar,
    TimeAxis,
    LayerPanel,
    ChartDetail,
    StationPanel,
    ParamRow,
    ParamColumn,
    PoupInfo,
    LegendBox,
  },
  data() {
    return {
      flag: {
        layerDataFlag: false,
        pieFlag: false,
        maskFlag: true,
        tableFlag: false,
        rainChartFlag: false,
        hyChartFlag: false,
        layerFlag: false,
        chartDetailFlag: false,
        stationPanelFlag: false,
        customTime: false,
        legendFlag: false,
        stationFlag: false,
        axisFlag: false,
      },
      stationLoading: true,
      modelReady: false,
      timeLayerData: "",
      stationTitle: "",
      timeRange: [],
      detailsRainType: "",
      stationList: [],
      hydrologyType: "水库水情",
      selectValue: "",
      interval: "",
      tableColumns: [],
      detailTableColumns: [],
      chartDetailList: [],
      hydrologyStationsList: [],
      trueStaionList: [],
      tableData: [],
      tableData2: [],
      outTablePage: {},
      innerTablePage: {},
      containerTab: [],
      chartTabList: [],
      pie: {},
      line: {},
      point: {},
      stationChart: {},
      showLayer: [],
      weatherLayer: [],
      timeLayer: [],
      follow: [],
      positionLayer: [],
      layerTools: [],
      bottomTools: [],
      detailParam: [],
      pieDetailParam: [],
      lineDetailWaterParam: [],
      lineDetailRiverParam: [],
      warnPoints: [],
      floodHazardPoints: [],
      riverRiskPoints: [],
      reservoirPoints: [],
      tunnelPoints: [],
      streetFeatures: [],
      pointType: [],
      infoContent: {
        title: "",
        content: "",
      },
      legendData: {},
      typeOptions: [
        {
          value: "选项1",
          label: "河道水情",
        },
        {
          value: "选项2",
          label: "水库水情",
        },
      ],
      axisTimer: null,
      axisParam: { axisValue: 0, marks: {}, urls: {}, step: 10, max: 100 },
      QPEParam: { axisValue: 0, marks: {}, urls: {}, step: 10, max: 100 },
      QPFParam: {
        axisValue: 0,
        marks: {},
        urls: {},
        step: 10,
        max: 100,
      },
      playerRadar: "",
      detailTableColumn2: [],
    };
  },
  created() {
    this.initMonitor();
  },
  mounted() {
    this.initViewer();
  },
  beforeDestroy() {
    this.closePoup();
    CesiumCore.deleteEntity(cesiumViewer);
    CesiumCore.deleteDataSource(cesiumViewer);
    CesiumCore.removeEventHandler(cesiumViewer); //移除所有handle事件
  },
  methods: {
    initMonitor() {
      this.positionLayer = positionLayer;
      Object.keys(monitorConfig).forEach((item) => {
        this[item] = cloneDeep(monitorConfig[item]);
      });
      this.$store.getters.boundary ? "" : this.getBoundary();

      let startTime = DateFormat(SpecifTime(12));
      let endTime = DateFormat(new Date());
      this.getRainStats(
        {
          intval: "10分钟",
          type: "站点统计",
        },
        {
          stTime: startTime,
          endTime: endTime,
          intval: "10分钟",
        }
      ).then((res) => {
        this.flag.rainChartFlag = true;
      });
      this.gethydrology({
        hours: "12",
      }).then((res) => {
        this.flag.hyChartFlag = true;
      });
      this.getTableData({
        orderTag: "pre_1h",
      });
      // this.getStaionListInfo();
      this.getLayerData().then((res) => {
        this.addPointEntity();
        this.addRadarPolygonEntity();
      });

      this.getFollowData().then((res) => {
        this.addFollowEntity();
      });
    },
    initEcharts(id) {
      if (id == "pie-monitor" && Object.keys(this.pie).length != 0) {
        this.$charts.pie(id, this.pie);
      } else if (id == "line-monitor" && Object.keys(this.line).length != 0) {
        this.$charts.line(id, this.line);
      } else if (id == "point-monitor" && Object.keys(this.point).length != 0) {
        this.$charts.point(id, this.point);
      }
    },
    initViewer() {
      CesiumCore.clickGetEntitties(cesiumViewer, this.handleEntityEvent);
    },
    handleEntityEvent(pickdObject) {
      let that = this;
      let startTime = DateFormat(SpecifTime(12), 1);
      let endTime = DateFormat(new Date(), 1);
      if (Cesium.defined(pickdObject) && pickdObject._name) {
        //rain图层点击事件;
        if (pickdObject._type.indexOf("weather") != -1) {
          if (pickdObject.information.type == "weather-10mRain") {
            this.flag.stationPanelFlag = true;
            this.stationLoading = true;
            this.stationTitle = `${pickdObject.information.name}(${pickdObject.information.id})`;
            getMinRainFallbyP({
              endTime: endTime,
              stTime: startTime,
              stationId: pickdObject.information.id,
            }).then((res) => {
              if (res.data.length != 0) {
                let singleData = singleLineforMin(res.data);
                that.$charts.station("Station", singleData);
                this.stationLoading = false;
              } else {
                this.stationLoading = false;
              }
            });
          } else {
            this.getSingleLine(pickdObject, startTime, endTime);
          }
          CesiumCore.flyToRecFromPoint(
            cesiumViewer,
            pickdObject.information.lon,
            pickdObject.information.lat,
            1500
          );
        } else if (pickdObject._type == "follow") {
          this.infoContent.title = pickdObject.name;
          this.infoContent.content = pickdObject.information;
          this.addPoup(pickdObject);
        }
      }
    },

    getSingleLine(pickObject, startTime, endTime) {
      this.stationLoading = true;
      this.flag.stationPanelFlag = true;
      this.stationTitle = `${pickObject.information.name}(${pickObject.information.id})`;
      // getTestSingleLine
      getHourRainFallbyP({
        endTime: endTime,
        stTime: startTime,
        stationId: pickObject.information.id,
      })
        .then((res) => {
          if (res.data.length != 0) {
            let data = singleLineforHour(
              res.data,
              pickObject.information.interval
            );
            this.$charts.station("Station", data);
            this.stationLoading = false;
          } else {
            this.stationLoading = false;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "服务器错误",
          });
        });
    },
    getBoundary() {
      getCountryPoints({
        token: this.$store.getters.token,
      })
        .then((res) => {
          if (res && res.code == 200) {
            this.streetFeatures = formatStreetPolyline(res.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    addPointEntity() {
      let that = this;
      this.warnPoints.forEach((features, index) => {
        let weather = CesiumCore.creatDataSource(
          cesiumViewer,
          features[index].type
        );
        features.forEach((feature) => {
          addWeatherPoint(
            weather,
            feature,
            require(`@/assets/images/${feature.grade}.png`)
          );
        });
        if (weather.name == "weather-10mRain") {
          that.setLegendData("weather", "rain", "10mRain", true);
          weather.show = true;
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
    addFollowEntity() {
      this.follow[0][0].value.forEach((item) => {
        let DataSource = CesiumCore.creatDataSource(
          cesiumViewer,
          `follow-${item.id}`
        );
        this[item.id].forEach((feature) => {
          feature.type = "follow";
          addFollowPoint(DataSource, feature, item.url);
        });
      });
    },
    addRadarPolygonEntity() {
      getRadarQpeQpfByHours({ hour: 2000, type: "QPE" })
        .then((res) => {
          this.QPFParam = { marks: {}, axisValue: 0, urls: {}, step: 10 };
          if (res && res.code == 200) {
            const { data: QPEData } = res;
            if (QPEData.length > 0) {
              let picPath = QPEData[0].picPath;
              let QPESource = CesiumCore.creatDataSource(
                cesiumViewer,
                "radar-QPE"
              );
              this.QPEParam.step = Math.floor(100 / QPEData.length);
              this.QPEParam.max = Math.floor(
                (QPEData.length - 1) * this.QPEParam.step
              );
              QPEData.map((item, index) => {
                this.QPEParam.marks[index * this.QPEParam.step] =
                  item.time.slice(11, 16);
                this.QPEParam.urls[index * this.QPEParam.step] = item.picPath;
              });
              let QPEEntity = addRedarPolygon(
                QPESource,
                new Cesium.Rectangle.fromDegrees(
                  QPEData[0].lonLt,
                  QPEData[0].latRb,
                  QPEData[0].lonRb,
                  QPEData[0].latLt
                ),
                picPath
              );
              global.QPERedarAxis = QPEEntity;
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      getRadarQpeQpfByHours({ hour: 2000, type: "QPF" }).then((res) => {
        this.QPFParam = { marks: {}, axisValue: 0, urls: {}, step: 10 };
        if (res && res.code == 200) {
          const { data: QPFData } = res;
          if (QPFData.length > 0) {
            let picPath = QPFData[0].picPath;
            let QPFSource = CesiumCore.creatDataSource(
              cesiumViewer,
              "radar-QPF"
            );
            this.QPFParam.step = Math.floor(100 / QPFData.length);
            this.QPFParam.max = (QPFData.length - 1) * this.QPFParam.step;
            QPFData.map((item, index) => {
              this.QPFParam.marks[index * this.QPFParam.step] =
                item.forecastValidity.toString();
              this.QPFParam.urls[index * this.QPFParam.step] = item.picPath;
            });
            let QPFEntity = addRedarPolygon(
              QPFSource,
              new Cesium.Rectangle.fromDegrees(
                QPFData[0].lonLt,
                QPFData[0].latRb,
                QPFData[0].lonRb,
                QPFData[0].latLt
              ),
              picPath
            );
            global.QPFRedarAxis = QPFEntity;
          }
        }
      });
    },
    addPoup(pickdObject) {
      if (this.poupInfo) this.poupInfo.destoryPoup(); //判断poupInfo是否存在 存在则把已注册的点击事件销毁 否则多次注册
      if (this.$refs.poupInfo) {
        let poupDom = this.$refs.poupInfo.$refs.poupShow;
        this.poupInfo = new CesiumCore.PoupInfo(
          cesiumViewer,
          pickdObject,
          poupDom
        );
        poupDom.style.display = "block";
        this.poupInfo.addPostRender(); //事件注册
      } else {
        return;
      }
    },
    closePoup() {
      if (this.poupInfo) {
        this.poupInfo.destoryPoup(); //事件销毁
        this.$refs.poupInfo.$el.style.display = "none";
      }
    },
    //查看详情点击事件
    clickDetail(id) {
      console.log(id);
      this.flag.customTime = false;
      this.timeRange = [SpecifTime(3), new Date()];
      this.detailTableColumn2 = [];
      this.tableData2 = [];
      if (id == "pie-monitor") {
        this.getStaionListInfo().then((res) => {
          // this.getMinRainFallbyStation({
          //   stTime: DateFormat(this.timeRange[0]),
          //   endTime: DateFormat(this.timeRange[1]),
          //   stationId: this.stationList.toString(),
          // });
          this.getMinRainFallbyStation();
        });
        this.hydrologyType = "";
        this.flag.stationFlag = true;
        // this.defaultStaionList = ["56288", "S1013"];
        this.detailsRainType = "10分钟";
        this.detailParam = cloneDeep(this.pieDetailParam);
        this.trueStaionList = this.chartDetailList;
      } else if (id == "line-monitor") {
        this.hydrologyType = "水库水情";
        // this.defaultStaionList = ["606KA001", "90006321"];
        this.getHydrologyStationList("水库水情").then((res) => {
          this.getDefaultHydrology();
        });
        // .then((res) => {
        //   this.getAllHydrologyTable();
        // })
        // .catch((error) =>{
        //   console.log(error);
        // })
        this.flag.stationFlag = true;
        this.detailsRainType = "presentStageAlertStageOver";
        this.detailParam = cloneDeep(this.lineDetailWaterParam);
        this.trueStaionList = this.hydrologyStationsList;
      }
      this.flag.chartDetailFlag = true;
    },
    chartDetailParam(val, bool) {
      console.log(val);
      if (val == "自定义时间范围") {
        this.interval = val;
        this.flag.customTime = true;
      } else if (val == "最近3小时" || val == "最近24小时") {
        this.interval = "";
        this.flag.customTime = false;
        if (val == "最近3小时") {
          this.interval = "";
          this.timeRange[0] = SpecifTime(3);
          this.timeRange[1] = new Date();
        } else if (val == "最近24小时") {
          this.timeRange[0] = SpecifTime(24);
          this.timeRange[1] = new Date();
        }
      } else {
        this.detailsRainType = val;
      }
    },
    getHydrologyType(val) {
      this.hydrologyType = val;
      console.log(val);
      if (val == "水库水情") {
        console.log(this.stationList);
        // this.stationList = ["606KA001", "90006321"];
        this.detailParam = cloneDeep(this.lineDetailWaterParam);
        this.detailsRainType = "presentStageAlertStageOver";
        this.getHydrologyStationList(val).then((res) => {
          this.getDefaultHydrology();
        });
        // .then((res) =>{
        //   this.getAllHydrologyTable();
        // })
        // .catch((error) =>{
        //   console.log(error);
        // })
      } else {
        // this.stationList = ["5100282001", "5100282003"];
        console.log(this.stationList);
        this.detailParam = cloneDeep(this.lineDetailRiverParam);
        this.detailsRainType = "presentAlertStageOver";
        this.getHydrologyStationList(val).then((res) => {
          this.getDefaultHydrology();
        });

        // .then((res) =>{
        //   this.getAllHydrologyTable();
        // })
        // .catch((error) =>{
        //   console.log(error);
        // })
      }
      this.initDetailTable();
    },
    initDetailTable() {
      this.timeRange[0] = SpecifTime(3);
      this.timeRange[1] = new Date();
      this.$refs.paramColumn.actCheckValue = this.stationList;
    },
    handleCheckBox(val) {
      this.stationList = val;
    },
    handleConfirm() {
      if (this.stationList.length == 0) {
        this.$message.warning("查询站点数量不能为空");
        return;
      }
      let startTime = DateFormat(this.timeRange[0]);
      let endTime = DateFormat(this.timeRange[1]);
      if (this.hydrologyType == "") {
        if (this.detailsRainType == "10分钟") {
          // getTestRainLine()
          getMinRainFallbyP({
            endTime: endTime,
            stTime: startTime,
            stationId: this.stationList.toString(),
          })
            .then((res) => {
              if (res.data.length != 0) {
                console.log(res);
                let detailLine = formatDetailLine(
                  res.data,
                  this.chartDetailList.value,
                  this.stationList
                );
                this.getRainTable(detailLine);
                console.log(detailLine);
                this.$charts.detail("detail-chart", detailLine);
                // limitMinData = sliceMinData(detailLine)
              } else {
                this.$message.warning("该时间段暂无数据");
              }
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.getMixRainFallbyP();
        }
      } else {
        this.getDifferentTypeHydrologyData();
      }
    },
    // getAllRainTableData() {
    //   let startTime = DateFormat(this.timeRange[0]);
    //   let endTime = DateFormat(this.timeRange[1]);
    //   let allList = [];
    //   this.chartDetailList.value.forEach((item) => {
    //     allList.push(item.id);
    //   });
    //   //getTestRainLine
    //   getMinRainFallbyP({
    //     stTime: startTime,
    //     endTime: endTime,
    //     stationId: allList.toString(),
    //   }).then((res) => {
    //     console.log(res);
    //     if (res && res.data.length != 0) {
    //       let allDetailLine = formatDetailLine(
    //         res.data,
    //         this.chartDetailList.value,
    //         allList
    //       );
    //       console.log(allDetailLine);
    //       // this.detailTableColumn2 = [
    //       //   { prop: "number", label: "站号", align: "center" },
    //       //   { prop: "name", label: "站名", align: "center" },
    //       // ];
    //       // for (let i = 2; i < allDetailLine.min.length + 2; i++) {
    //       //   this.detailTableColumn2[i] = {
    //       //     prop: allDetailLine.min[i - 2],
    //       //     label: allDetailLine.min[i - 2],
    //       //     align: "center",
    //       //   };
    //       // }
    //       // for (let i = 0; i < allDetailLine.name.length; i++) {
    //       //   let num = "";
    //       //   let eng = "";
    //       //   let stationName = "";
    //       //   if (allDetailLine.name[i]) {
    //       //     num = allDetailLine.name[i].replace(/[^0-9]/gi, "");
    //       //     eng = allDetailLine.name[i].replace(/[^a-z]+/gi, "");
    //       //     stationName = allDetailLine.name[i].replace(
    //       //       /[^\u4e00-\u9fa5]/gi,
    //       //       ""
    //       //     );
    //       //     this.tableData2[i] = {
    //       //       number: eng + num,
    //       //       name: stationName,
    //       //     };
    //       //     for (let j = 0; j < allDetailLine.min.length; j++) {
    //       //       let title = allDetailLine.min[j];
    //       //       this.tableData2[i]["" + title + ""] = allDetailLine.value[i][j];
    //       //     }
    //       //   }
    //       // }
    //       // limitMinData = sliceMinData(detailLine)
    //     } else {
    //       this.$message.warning("该时间段暂无数据");
    //     }
    //   });
    // },
    // getAllHydrologyTable() {
    //   let hydrologyDetailData = {};
    //   let startHour = DateFormat(this.timeRange[0], 6);
    //   let endHour = DateFormat(this.timeRange[1], 6);
    //   let interval = endHour - startHour == 0 ? 24 : endHour - startHour;
    //   if (this.hydrologyType == "水库水情") {
    //     getReservoirWaterRecentData({
    //       hours: interval,
    //       stationcodes: this.hydrologyAllStationId.toString(),
    //     }).then((res) => {
    //       hydrologyDetailData = formatDifferentTime(
    //         res.data,
    //         this.detailsRainType
    //       );
    //       this.getHyTable(hydrologyDetailData);
    //     });
    //   } else if (this.hydrologyType == "河道水情") {
    //     getWatercourseRecentData({
    //       hours: interval,
    //       stationcodes: this.hydrologyAllStationId.toString(),
    //     }).then((res) => {
    //       console.log(res);
    //       hydrologyDetailData = formatDifferentTime(
    //         res.data,
    //         this.detailsRainType
    //       );
    //       this.getHyTable(hydrologyDetailData);
    //     });
    //   }
    // },
    getHyTable(data) {
      console.log(data);
      this.detailTableColumn2 = [];
      this.tableData2 = [];
      this.detailTableColumn2 = [
        { prop: "number", label: "站号", align: "center", width: 100 },
        { prop: "name", label: "站名", align: "center", width: 100 },
      ];
      for (let i = 0; i < data.xzhou.length; i++) {
        this.detailTableColumn2[i + 2] = {
          prop: String(data.xzhou[i]),
          label: String(data.xzhou[i]),
          align: "center",
        };
      }
      for (let i = 0; i < data.name.length; i++) {
        if (data.name[i]) {
          let bracket = data.name[i].indexOf("(");
          // let reg = /\((.+?)\)/gi;
          // let tmp = hydrologyDetailData.name[i].match(reg);
          let statioNumber = data.name[i].slice(bracket + 1, -2);
          let stationName = data.name[i].slice(0, bracket);
          this.tableData2[i] = {
            number: statioNumber,
            name: stationName,
          };
          for (let j = 0; j < data.xzhou.length; j++) {
            let title = data.xzhou[j];
            this.tableData2[i]["" + title + ""] = data.shuju[i][j];
          }
        }
      }
    },
    getRainTable(mindata, hourdata) {
      this.detailTableColumn2 = [];
      this.tableData2 = [];
      console.log(hourdata);
      if (hourdata == undefined) {
        this.detailTableColumn2 = [
          {
            prop: "number",
            label: "站号",
            align: "center",
            width: 100,
          },
          { prop: "name", label: "站名", align: "center", width: 100 },
        ];
        for (let i = 2; i < mindata.xzhou.length + 2; i++) {
          this.detailTableColumn2[i] = {
            prop: mindata.xzhou[i - 2],
            label: mindata.xzhou[i - 2],
            align: "center",
          };
        }
        for (let i = 0; i < mindata.name.length; i++) {
          let num = "";
          let eng = "";
          let stationName = "";
          if (mindata.name[i]) {
            num = mindata.name[i].replace(/[^0-9]/gi, "");
            eng = mindata.name[i].replace(/[^a-z]+/gi, "");
            stationName = mindata.name[i].replace(/[^\u4e00-\u9fa5]/gi, "");
            this.tableData2[i] = {
              number: eng + num,
              name: stationName,
            };
            for (let j = 0; j < mindata.xzhou.length; j++) {
              let title = mindata.xzhou[j];
              this.tableData2[i]["" + title + ""] = mindata.shuju[i][j];
            }
          }
        }
      } else {
        let mixDetailLine = JSON.parse(JSON.stringify(hourdata));
        mixDetailLine.xzhou.push.apply(
          mixDetailLine.xzhou,
          mindata.xzhou.slice(-4)
        );
        // for (let i = 0; i < mindata.xzhou.length; i++) {
        //   console.log(mindata.xzhou[i]);
        //   mixDetailLine.xAxis.push(mindata.xzhou[i]);
        // }
        for (let i = 0; i < mindata.shuju.length; i++) {
          for (
            let j = mindata.shuju[i].length - 4;
            j < mindata.shuju[i].length;
            j++
          ) {
            mixDetailLine.shuju[i].push(mindata.shuju[i][j]);
          }
        }
        console.log(mindata);
        console.log(mixDetailLine);
        this.detailTableColumn2 = [
          { prop: "number", label: "站号", align: "center" },
          { prop: "name", label: "站名", align: "center" },
        ];
        for (let i = 2; i < mixDetailLine.xzhou.length + 2; i++) {
          this.detailTableColumn2[i] = {
            prop: String(mixDetailLine.xzhou[i - 2]),
            label: String(mixDetailLine.xzhou[i - 2]),
            align: "center",
          };
        }
        for (let i = 0; i < hourdata.name.length; i++) {
          let num = "";
          let eng = "";
          let stationName = "";
          if (hourdata.name[i]) {
            num = hourdata.name[i].replace(/[^0-9]/gi, "");
            eng = hourdata.name[i].replace(/[^a-z]+/gi, "");
            stationName = hourdata.name[i].replace(/[^\u4e00-\u9fa5]/gi, "");
            this.tableData2[i] = {
              number: eng + num,
              name: stationName,
            };
            for (let j = 0; j < mixDetailLine.xzhou.length; j++) {
              let title = mixDetailLine.xzhou[j];
              this.tableData2[i]["" + title + ""] = mixDetailLine.shuju[i][j];
            }

            // for(let i =this.detailTableColumn2.length;i<this.detailTableColumn2.length+4;i++){
            //     this.detailTableColumn2[i] = {
            //     prop:mindata.xzhou[i-25],
            //     label:mindata.xzhou[i-25],
            //     align:"center"
            //   }
            // }
          }
        }
        console.log(this.tableData2);
        console.log(this.detailTableColumn2);
      }
    },
    getDefaultHydrology() {
      let hydrologyDetailData = {};
      if (this.hydrologyType == "水库水情") {
        getReservoirWaterRecentData({
          hours: 3,
          stationcodes: this.stationList.toString(),
        }).then((res) => {
          hydrologyDetailData = formatDifferentTime(
            res.data,
            "presentStageAlertStageOver"
          );
          this.$charts.detail("detail-chart", hydrologyDetailData);
          this.getHyTable(hydrologyDetailData);
        });
      } else if (this.hydrologyType == "河道水情") {
        getWatercourseRecentData({
          hours: 3,
          stationcodes: this.stationList.toString(),
        }).then((res) => {
          hydrologyDetailData = formatDifferentTime(
            res.data,
            "presentAlertStageOver"
          );
          console.log(hydrologyDetailData);
          this.$charts.detail("detail-chart", hydrologyDetailData);
          this.getHyTable(hydrologyDetailData);
        });
      }
      // this.detailTableColumn2 = [];
      // this.tableData2 = [];
      // this.detailTableColumn2 = [
      //   { prop: "number", label: "站号", align: "center" },
      //   { prop: "name", label: "站名", align: "center" },
      // ];
      // for (let i = 2; i < hydrologyDetailData.xzhou.length + 2; i++) {
      //   this.detailTableColumn2[i] = {
      //     prop: String(hydrologyDetailData.xzhou[i - 2]),
      //     label: String(hydrologyDetailData.xzhou[i - 2]),
      //     align: "center",
      //   };
      // }
      // for (let i = 0; i < hydrologyDetailData.name.length; i++) {
      //   if (hydrologyDetailData.name[i]) {
      //     let bracket = hydrologyDetailData.name[i].indexOf("(");
      //     // let reg = /\((.+?)\)/gi;
      //     // let tmp = hydrologyDetailData.name[i].match(reg);
      //     let statioNumber = hydrologyDetailData.name[i].slice(bracket + 1, -2);
      //     let stationName = hydrologyDetailData.name[i].slice(0, bracket);
      //     this.tableData2[i] = {
      //       number: statioNumber,
      //       name: stationName,
      //     };
      //     for (let j = 0; j < hydrologyDetailData.xzhou.length; j++) {
      //       let title = hydrologyDetailData.xzhou[j];
      //       this.tableData2[i]["" + title + ""] =
      //         hydrologyDetailData.shuju[i][j];
      //     }
      //   }
      // }
    },
    handleAxis(bool) {
      if (bool) {
        if (this.axisParam.axisValue == this.axisParam.max)
          this.axisParam.axisValue = 0;
        this.axisTimer = setInterval(() => {
          if (this.axisParam.axisValue < this.axisParam.max) {
            this.axisParam.axisValue += this.axisParam.step;
          } else {
            clearInterval(this.axisTimer);
            this.axisTimer = null;
            this.$refs.axis.isPlayer = false;
          }
        }, 200);
      } else {
        if (this.axisTimer) {
          clearInterval(this.axisTimer);
          this.axisTimer = null;
        }
      }
    },
    changeAxis(val) {
      this.axisParam.axisValue = val;
      if (this.playerRadar == "QPE") {
        QPERedarAxis.rectangle.material.image = this.QPEParam.urls[val];
      } else if (this.playerRadar == "QPF") {
        QPFRedarAxis.rectangle.material.image = this.QPFParam.urls[val];
      }
    },
    setTimeChange(data) {
      let startTime = data[0];
      let endTime = data[1];
      if (startTime.getTime() <= endTime.getTime() - 3 * 24 * 3600 * 1000) {
        //结束时间只能在开始时间后三天
        this.$message({
          message: "时间范围不能超过三天",
          type: "warning",
        });
        return (this.timeRange[1] = new Date(
          startTime.getTime() + 2 * 24 * 3600 * 1000
        ));
      }
      console.log(data);
    },
    setLegendData(source, layerName, id, bool) {
      if (source == "weather") {
        if (bool) {
          this.getLegendData({ type: id })
            .then((res) => {
              if (layerName == "rain") {
                res.legendName = "降雨";
                res.unit = "(mm)";
              } else if (layerName == "temper") {
                res.legendName = "气温";
                res.unit = "(°)";
              } else if (layerName == "wind") {
                res.legendName = "风速";
                res.unit = "(M/s)";
              }
              this.legendData = res;
              this.flag.legendFlag = true;
            })
            .catch((error) => {
              console.log(error);
            });
        } else {
          this.flag.legendFlag = false;
        }
      } else if (source == "radar") {
        if (!bool) {
          this.flag.axisFlag = false;
          return;
        }
        if (id == "QPE") {
          this.playerRadar = "QPE";
          this.axisParam = this.QPEParam;
          this.flag.axisFlag = true;
        } else if (id == "QPF") {
          this.playerRadar = "QPF";
          this.axisParam = this.QPFParam;
          this.flag.axisFlag = true;
        }
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
    //chart  Tab切换事件
    changeContainerTab(id) {
      let startTime = DateFormat(SpecifTime(12));
      let endTime = DateFormat(new Date());
      this.getRainStats(
        {
          intval: id,
          type: "站点统计",
        },
        {
          stTime: startTime,
          endTime: endTime,
          intval: id,
        }
      ).then((res) => {
        if (Object.keys(this.pie).length != 0) {
          this.$charts.pie("pie-monitor", this.pie);
        }
        if (Object.keys(this.point).length != 0) {
          this.$charts.point("point-monitor", this.point);
        }
      });
    },
    changeChartTab(bool) {
      console.log(bool);
    },
    // 表格翻页处理
    handleCurrentChange(currentPage) {
      this.outTablePage.pageNo = currentPage;
    },
    getTableData(params) {
      let that = this;
      getRainStationOrderbyTag(params)
        .then((res) => {
          if (res.data) {
            const { data } = res;
            that.tableData = data.map((item) => {
              return {
                number: item.stationIdC,
                name: item.stationName,
                // tenMin: item.pre1mi,
                oneHour: item.pre1h > 9999 ? "null" : item.pre1h,
                threeHour: item.pre3h > 9999 ? "null" : item.pre3h,
                sixHour: item.pre6h > 9999 ? "null" : item.pre6h,
                twelveHour: item.pre12h > 9999 ? "null" : item.pre12h,
                twentyFHour: item.pre24h > 9999 ? "null" : item.pre24h,
              };
            });
            that.outTablePage.total = that.tableData.length;
            that.flag.tableFlag = true;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getStaionListInfo() {
      await getStaionInfo({})
        .then((res) => {
          if (res && res.data) {
            this.stationList = [];
            this.chartDetailList.value = [];
            res.data.forEach((item, index) => {
              let valueItem = {
                id: item.stationIdC,
                text: item.stationName,
                color: `rgb(${item.red},${item.green},${item.blue})`,
                isSelect: false,
              };
              if (index == 0 || index == 2) {
                valueItem.isSelect = true;
                this.stationList.push(valueItem.id);
              }
              this.chartDetailList.value.push(valueItem);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getHydrologyStationList(type) {
      await getHydrologyStations({
        typename: type,
      })
        .then((res) => {
          this.stationList = [];
          if (res && res.data) {
            this.hydrologyStationsList.value = [];
            res.data.forEach((item, index) => {
              let valueItem = {
                id: item.stcd,
                text: item.stnm,
                isSelect: false,
                sType: item.stationtype,
              };
              if (index == 0 || index == 2) {
                valueItem.isSelect = true;
                this.stationList.push(valueItem.id);
              }
              this.hydrologyStationsList.value.push(valueItem);
            });
            this.initDetailTable();
            console.log(this.stationList);
          }
        })
        .catch((error) => {});
    },
    getMinRainFallbyStation(param) {
      //  getTestRainLine
      getMinRainFallbyP(param)
        .then((res) => {
          console.log(res);
          if (res && res.data.length != 0) {
            let that = this;
            let detailLine = formatDetailLine(
              res.data,
              that.chartDetailList.value,
              that.stationList
            );
            console.log(detailLine);
            this.getRainTable(detailLine);
            this.$charts.detail("detail-chart", detailLine);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getLegendData(param) {
      let legendData = {
        legendName: "",
        unit: "",
        valueData: [],
        colorData: [],
      };
      await getSysDataClassify(param)
        .then((res) => {
          if (res.data) {
            const { data } = res;
            data.forEach((item, index) => {
              let colorItem = {
                color: `rgb(${item.r},${item.g},${item.b})`,
                text: item.dislab,
              };
              index < data.length - 1
                ? legendData.valueData.unshift(item.max)
                : legendData.valueData;
              legendData.colorData.unshift(colorItem);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
      return legendData;
    },
    //获取灾害点 传给Cesium
    async getLayerData() {
      let that = this;
      await getDifferTypesRainDatabyType({ Type: "分钟" })
        .then((res) => {
          if (res && res.data) {
            let Sources = [];
            if (res.data && res.data.minutepres.length > 0) {
              const { data } = res;
              data.minutepres.forEach((item) => {
                let source = {
                  type: "weather-10mRain",
                  id: item.stationIdC,
                  name: item.stationName,
                  lon: item.lon,
                  lat: item.lat,
                  value: item.pre < 100 ? item.pre : "null",
                  grade: `level${item.preLev}`,
                };
                Sources.push(source);
              });
              that.warnPoints = [Sources];
            }
          }
        })
        .catch((error) => {
          console.log(error);
        });
      await getDifferTypesRainDatabyType({ Type: "小时" })
        .then((res) => {
          if (res.data && res.data.rainstationstats.length > 0) {
            const { data } = res;
            this.pointType.forEach((pointItemType) => {
              let Sources = [];
              data.rainstationstats.forEach((item) => {
                let source = {
                  type: pointItemType.type,
                  id: item.stationIdC,
                  name: item.stationName,
                  lon: item.lon,
                  lat: item.lat,
                  value:
                    item[pointItemType.value] < 1000
                      ? item[pointItemType.value]
                      : "null",
                  grade: `level${item[pointItemType.grade]}`,
                  interval: pointItemType.value,
                };
                Sources.push(source);
              });
              that.warnPoints.push(Sources);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getFollowData() {
      await getRegionalFocusDatabyType({ type: "防汛隐患点" })
        .then((res) => {
          this.floodHazardPoints = res.data.floodHazardPoints;
        })
        .catch((error) => {
          console.log(error);
        });
      await getRegionalFocusDatabyType({ type: "江河堤防险工险段" })
        .then((res) => {
          this.riverRiskPoints = res.data.embankmentDangers;
        })
        .catch((error) => {
          console.log(error);
        });
      await getRegionalFocusDatabyType({ type: "下穿式立交" })
        .then((res) => {
          this.tunnelPoints = res.data.tunnels;
        })
        .catch((error) => {
          console.log(error);
        });
      await getRegionalFocusDatabyType({ type: "重要水库" })
        .then((res) => {
          this.reservoirPoints = res.data.reservoirBases;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getRainStats(Param1, Param2) {
      await getRainStat(Param1)
        .then((res) => {
          if (res && res.data) this.pie = res;
        })
        .catch((error) => {
          console.log(error);
        });
      // getTestPoint
      await getRainDistributionbyP(Param2)
        .then((res) => {
          if (res && res.data) {
            let scatterData = {
              xAxis: [],
              yAxis: [],
              value: [],
            };
            res.data.forEach((item) => {
              scatterData.yAxis.push(item.typename);
              if (item.intval == "10分钟") {
                scatterData.xAxis.push(item.dataDate.slice(11, 16));
              } else {
                scatterData.xAxis.push(item.dataDate.slice(11, 13));
              }
            });
            scatterData.yAxis = unique(scatterData.yAxis);
            scatterData.xAxis = unique(scatterData.xAxis);
            scatterData.value = Object.values(
              res.data.reduce((res, item) => {
                res[item.typename]
                  ? res[item.typename].push(item.value)
                  : (res[item.typename] = [item.value]);
                return res;
              }, {})
            );
            this.point = scatterData;
          }
        })
        .catch((error) => {
          {
            console.log(error);
          }
        });
    },
    async gethydrology(Param) {
      await getWatercourseKey(Param)
        .then((res) => {
          if (res.code == 200 && res.data.length > 0) {
            let waterType = "presentAlertStageOver";
            let lineData = formatDifferentTime(res.data, waterType, 1);
            this.line = lineData;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async getMixRainFallbyP() {
      let startTime = DateFormat(this.timeRange[0]);
      let endTime = DateFormat(this.timeRange[1]);
      let detailLine2 = {};
      let detailLine = {};
      let minData = {};
      // await getTestRainLine()
      getMinRainFallbyP({
        endTime: endTime,
        stTime: startTime,
        stationId: this.stationList.toString(),
      })
        .then((res) => {
          if (res.data.length != 0) {
            detailLine2 = formatDetailLine(
              res.data,
              this.chartDetailList.value,
              this.stationList
            );
            //minData = sliceMinData(detailLine2);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      // await getTestRainLineForHour();
      await getHourRainFallbyP({
        endTime: endTime,
        stTime: startTime,
        stationId: this.stationList.toString(),
      }).then((res) => {
        console.log(res);
        if (res.data.length != 0) {
          detailLine = formatDetailLineforHour(
            res.data,
            this.chartDetailList.value,
            this.stationList,
            this.detailsRainType
          );
          console.log(detailLine);
          this.$charts.detail("detail-chart", detailLine);
          this.getRainTable(detailLine2, detailLine);
          // let mixDetailLine = JSON.parse(JSON.stringify(detailLine));
          // for (let i = 0; i < minData.min.length; i++) {
          //   mixDetailLine.xAxis.push(minData.min[i]);
          // }
          // for (let i = 0; i < minData.value.length; i++) {
          //   for (let j = 0; j < minData.value[i].length; j++) {
          //     mixDetailLine.value[i].push(minData.value[i][j]);
          //   }
          // }
          // this.detailTableColumn2 = [
          //   { prop: "number", label: "站号", align: "center" },
          //   { prop: "name", label: "站名", align: "center" },
          // ];
          // for (let i = 2; i < mixDetailLine.xAxis.length + 2; i++) {
          //   this.detailTableColumn2[i] = {
          //     prop: String(mixDetailLine.xAxis[i - 2]),
          //     label: String(mixDetailLine.xAxis[i - 2]),
          //     align: "center",
          //   };
          // }
          // for (let i = 0; i < detailLine.name.length; i++) {
          //   let num = "";
          //   let eng = "";
          //   let stationName = "";
          //   if (detailLine.name[i]) {
          //     num = detailLine.name[i].replace(/[^0-9]/gi, "");
          //     eng = detailLine.name[i].replace(/[^a-z]+/gi, "");
          //     stationName = detailLine.name[i].replace(
          //       /[^\u4e00-\u9fa5]/gi,
          //       ""
          //     );
          //     this.tableData2[i] = {
          //       number: eng + num,
          //       name: stationName,
          //     };
          //     for (let j = 0; j < mixDetailLine.xAxis.length; j++) {
          //       let title = mixDetailLine.xAxis[j];
          //       this.tableData2[i]["" + title + ""] = mixDetailLine.value[i][j];
          //     }
          //     // for(let i =this.detailTableColumn2.length;i<this.detailTableColumn2.length+4;i++){
          //     //     this.detailTableColumn2[i] = {
          //     //     prop:limitMinData.min[i-25],
          //     //     label:limitMinData.min[i-25],
          //     //     align:"center"
          //     //   }
          //     // }
          //   }
          // }
        } else {
          this.$message.warning("该时间段暂无数据");
        }
      });
    },
    getDifferentTypeHydrologyData() {
      console.log(this.stationList);
      if (this.stationList == 0) {
        this.$message.warning("查询站点数量不能为空");
        return;
      }
      let hydrologyDetailData = {};
      if (this.interval == "自定义时间范围") {
        let startTime = DateFormat(this.timeRange[0]);
        let endTime = DateFormat(this.timeRange[1]);
        if (this.hydrologyType == "河道水情") {
          getWatercourseData({
            stTime: startTime,
            endTime: endTime,
            stationcodes: this.stationList.toString(),
          }).then((res) => {
            hydrologyDetailData = formatDifferentTime(
              res.data,
              this.detailsRainType
            );
            this.$charts.detail("detail-chart", hydrologyDetailData);
            this.getHyTable(hydrologyDetailData);
          });
        } else {
          getReservoirWaterData({
            stTime: startTime,
            endTime: endTime,
            stationcodes: this.stationList.toString(),
          }).then((res) => {
            console.log(res);
            hydrologyDetailData = formatDifferentTime(
              res.data,
              this.detailsRainType
            );
            console.log(hydrologyDetailData);
            this.$charts.detail("detail-chart", hydrologyDetailData);
            this.getHyTable(hydrologyDetailData);
          });
        }
      } else {
        let startHour = DateFormat(this.timeRange[0], 6);
        let endHour = DateFormat(this.timeRange[1], 6);
        let interval = endHour - startHour == 0 ? 24 : endHour - startHour;
        if (this.hydrologyType == "河道水情") {
          getWatercourseRecentData({
            hours: interval,
            stationcodes: this.stationList.toString(),
          }).then((res) => {
            hydrologyDetailData = formatDifferentTime(
              res.data,
              this.detailsRainType
            );
            console.log(hydrologyDetailData);
            this.$charts.detail("detail-chart", hydrologyDetailData);
            this.getHyTable(hydrologyDetailData);
          });
        } else {
          getReservoirWaterRecentData({
            hours: interval,
            stationcodes: this.stationList.toString(),
          }).then((res) => {
            hydrologyDetailData = formatDifferentTime(
              res.data,
              this.detailsRainType
            );
            this.$charts.detail("detail-chart", hydrologyDetailData);
            this.getHyTable(hydrologyDetailData);
          });
        }
      }
      // this.detailTableColumn2 = [];
      // this.tableData2 = [];
      // this.detailTableColumn2 = [
      //   { prop: "number", label: "站号", align: "center" },
      //   { prop: "name", label: "站名", align: "center" },
      // ];
      // for (let i = 2; i < hydrologyDetailData.xzhou.length + 2; i++) {
      //   this.detailTableColumn2[i] = {
      //     prop: String(hydrologyDetailData.xzhou[i - 2]),
      //     label: String(hydrologyDetailData.xzhou[i - 2]),
      //     align: "center",
      //   };
      // }
      // for (let i = 0; i < hydrologyDetailData.name.length; i++) {
      //   if (hydrologyDetailData.name[i]) {
      //     let bracket = hydrologyDetailData.name[i].indexOf("(");
      //     // let reg = /\((.+?)\)/gi;
      //     // let tmp = hydrologyDetailData.name[i].match(reg);
      //     let statioNumber = hydrologyDetailData.name[i].slice(bracket + 1, -2);
      //     let stationName = hydrologyDetailData.name[i].slice(0, bracket);
      //     this.tableData2[i] = {
      //       number: statioNumber,
      //       name: stationName,
      //     };
      //     for (let j = 0; j < hydrologyDetailData.xzhou.length; j++) {
      //       let title = hydrologyDetailData.xzhou[j];
      //       this.tableData2[i]["" + title + ""] =
      //         hydrologyDetailData.shuju[i][j];
      //     }
      //   }
      // }
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
#monitor {
  width: 100%;
  height: 100vh;
}
.legends {
  display: flex;
  position: absolute;
  bottom: 6rem;
  right: 3rem;
  z-index: 999;
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
