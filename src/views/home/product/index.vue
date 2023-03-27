<template>
  <div id="product">
    <loading v-if="!flag.drawFlag" />
    <div :class="flag.maskFlag ? 'total-mask ' : 'hidden-mask'"></div>
    <left-panel @shrink="flag.maskFlag = !flag.maskFlag">
      <div class="publish">
        <div class="time-select">
          <el-date-picker
            v-model="publishTime"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00"
            @change="confirmTime"
          >
          </el-date-picker>
        </div>
        <el-select
          v-model="selectValue"
          @change="handleSelect"
          placeholder="临界雨量模型"
        >
          <el-option
            v-for="item in modelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <div class="confirm-btn publish-btn" @click="createProduct">创建</div>
      </div>
      <container-panel title="预警产品信息"
        ><div class="title-row">
          <el-input
            style="width: 20%"
            placeholder="年份"
            v-model="publishParams.year"
            clearable
          ></el-input>
          <span class="separate"></span>
          <el-input
            style="width: 20%"
            placeholder="版号"
            v-model="publishParams.No"
            clearable
          ></el-input>
          <span class="separate"></span
          ><el-input
            style="width: 55%"
            placeholder="请输入公报标题"
            v-model="publishParams.title"
            clearable
          >
          </el-input>
        </div>
        <div class="title-row">
          <el-input
            style="width: 65%"
            placeholder="请输入发布单位"
            v-model="publishParams.drawunit"
            clearable
          >
          </el-input>
          <span class="separate"></span
          ><el-input
            style="width: 30%"
            placeholder="请输入制作人"
            v-model="publishParams.drawer"
            clearable
          >
          </el-input>
        </div>
        <el-input
          class="publish-textarea"
          type="textarea"
          autosize
          placeholder="请输入内容"
          v-model="publishParams.alertinfo"
        >
        </el-input>
      </container-panel>
      <container-panel title="专题图预览" style="height: 70%">
        <picture-box :picUrl="picUrl"></picture-box>
      </container-panel>
    </left-panel>
    <right-panel :istrue="flag.maskFlag">
      <container-panel title="产品文件管理" style="height: 100%">
        <common-table
          :maxHeight="800"
          style="width: 100%; height: 100%"
          :columns="tableColumns"
          :data="tableData"
          :pager="tablePage"
          :tableHandle="tableHandle"
          :stripe="false"
          @handleCurrentChange="handleCurrentChange"
          @handleDown="handleDown"
        ></common-table>
      </container-panel>
    </right-panel>
    <adjust-tools
      v-if="flag.drawFlag"
      @updataModel="modifyBorder"
      style="z-index: 999; right: 5.5rem; top: 6rem"
    ></adjust-tools>

    <!-- <div class="mask" id="mask">
            <div class="bigpic" id="bigpic">
                <img style="height: 100%;width: 100%" >
            </div>
        </div> -->
  </div>
</template>

<script>
import CesiumCore from "@/CesiumCore/index.js";
import Loading from "@/components/Loading.vue";
import {
  getAllProductFiels,
  creatProduction,
  modifyModel,
  getModelFiles,
  getCountryPoints,
} from "@/api/index.js";
import * as productConfig from "@/views/home/product/product.js";
import { cloneDeep, formatStreetPolyline } from "@/selfTools/FormatData.js";
import {
  DateFormat,
  string2Date,
  intervalDateDay,
} from "@/selfTools/DateTools.js";
import LeftPanel from "@/components/LeftPanel.vue";
import RightPanel from "@/components/RightPanel.vue";
import ContainerPanel from "@/components/ContainerPanel.vue";
import CommonTable from "@/components/CommonTable.vue";
import PictureBox from "@/components/PictureBox.vue";
import AdjustTools from "@/components/AdjustTools.vue";
import { addMoldelPolygon, addStreetPolyline } from "@/selfTools/Entity.js";
export default {
  name: "Product",
  components: {
    LeftPanel,
    Loading,
    RightPanel,
    ContainerPanel,
    CommonTable,
    PictureBox,
    AdjustTools,
  },
  data() {
    return {
      flag: {
        maskFlag: true,
        drawFlag: true,
      },
      publishTime: new Date(),
      tableColumns: [],
      tablePage: {},
      tableData: [],
      streetFeatures: [],
      tableHandle: {
        down: true,
        delete: false,
      },
      cRainInfo: "",
      rConfluenceInfo: "",
      uRainFloodInfo: "",
      selectValue: "cRain",
      modelOptions: [
        {
          value: "cRain",
          label: "临界雨量模型",
        },
        {
          value: "rConfluence",
          label: "大范围径流汇流模型",
        },
        {
          value: "uRainFlood",
          label: "城市雨洪径流模型",
        },
      ],
      picUrl: "",
      publishParams: {
        year: "2022",
        No: "(01)",
        title: "双流内涝风险预警",
        drawunit: "双流气象局",
        drawer: this.$store.getters.userName || "成信大",
        alertinfo: "",
        time: "",
        model: "",
        fileName: "",
        token: this.$store.getters.token,
      },
      returnParam: {
        modelName: "",
        fileName: "",
      },
    };
  },
  created() {
    this.initProduct();
  },
  mounted() {
    this.initViewer();
  },
  beforeDestroy() {
    CesiumCore.deleteEntity(cesiumViewer); //移除所有挂载到viewer上的实体
    CesiumCore.deleteDataSource(cesiumViewer);
    CesiumCore.removeEventHandler(cesiumViewer);
  },
  methods: {
    initProduct(val) {
      Object.keys(productConfig).forEach((item) => {
        this[item] = cloneDeep(productConfig[item]);
      });
      this.$store.getters.boundary ? "" : this.getBoundary();
      this.getAllProductFiles().then((res) => {
        if (typeof res[0] == "string" && typeof res[1] == "string") {
          this.publishTime = string2Date(res[0]);
          this.selectValue = res[1];
          this.getPubilsh({
            name: res[0],
            model: res[1],
            token: this.$store.getters.token,
          });
          this.flag.dataFlag = true;
        } else {
          this.$message({
            type: "warning",
            message: "暂无模型文件",
          });
        }
      });
    },
    initViewer() {
      CesiumCore.clickGetEntitties(cesiumViewer, this.handleEntityEvent);
    },
    handleSelect() {},
    // 翻页处理
    handleCurrentChange(currentPage) {
      this.tablePage.pageNo = currentPage;
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
    createProduct() {
      this.publishParams.model = this.selectValue;
      this.publishParams.time = DateFormat(this.publishTime, 5);
      this.publishParams.fileName = DateFormat(this.publishTime, 4);
      creatProduction(this.publishParams)
        .then((res) => {
          if (res.code == 200) {
            this.$confirm(`创建成功`, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
            this.getAllProductFiles();
          } else {
            this.$confirm(`创建失败`, "提示", {
              confirmButtonText: "确定",
              type: "warning",
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getAllProductFiles() {
      let lastFileTime = null;
      let lastFileModel = null;
      await getAllProductFiels({
        token: this.$store.getters.token,
      })
        .then((res) => {
          console.log(res);
          if (res && res.code == 200) {
            if (res.data.length > 0) {
              lastFileTime = res.data[0].fileName;
              lastFileModel = res.data[0].model;
              this.tableData = res.data.map((item) => {
                return {
                  id: item.id,
                  type: item.name,
                  time: item.fileName,
                  handle: "下载",
                  ref: item.wordurl,
                };
              });
              this.tablePage.total = res.length;
            } else {
              this.$message({ type: "warning", message: "暂未生成公报文件" });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({ type: "error", message: "服务器出错" });
        });
      return [lastFileTime, lastFileModel];
    },
    handleDown(index, item) {
      if (item.ref) {
        var a = document.createElement("a");
        a.href = item.ref;
        a.download = item.time;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        this.$message.warning("找不到对应文件");
      }
    },
    confirmTime(val) {
      CesiumCore.deleteDataSource(cesiumViewer); //清除实体数据集
      this.getPubilsh({
        name: DateFormat(val, 4),
        model: this.selectValue,
        token: this.$store.getters.token,
      });
      this.publishTime = val;
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
    modifyBorder(position) {
      // let interval=intervalDateDay(new Date(),this.publishTime)
      // if(interval>=7){
      //   this.$message.warning('不能修改一周前的模型数据')
      //   return
      // }
      this.flag.drawFlag = false;
      let modifyPosition = [];
      let modifyType = [];
      let fileName = DateFormat(this.publishTime, 4);
      for (let i = 0; i < position.length; i++) {
        modifyPosition[i] = position[i].position;
        modifyType[i] = position[i].type;
      }
      console.log("数据变化，开始执行");
      modifyModel({
        modelName: this.selectValue,
        fileName: fileName,
        position: modifyPosition,
        type: modifyType,
        token: this.$store.getters.token,
      })
        .then((res) => {
          this.flag.drawFlag = true;
          if ((res.code = 200)) {
            CesiumCore.deleteDataSource(cesiumViewer);
            this.getPubilsh({
              name: fileName,
              model: this.selectValue,
              token: this.$store.getters.token,
            });
            this.$message({
              type: "success",
              message: "修改成功",
            });
          } else {
            this.$message({
              type: "error",
              message: "修改失败",
            });
          }
        })
        .catch((error) => {
          this.flag.drawFlag = true;
          this.$message({
            type: "error",
            message: "服务器出错",
          });
          console.log(error);
        });
    },

    getPubilsh(param) {
      this.flag.drawFlag = false;
      getModelFiles(param)
        .then((res) => {
          if (res && res.code == 200) {
            const { data } = res;
            if (data.length > 0) {
              data.forEach((item) => {
                this.picUrl = `${item.producturl}?time=${Math.random()}`;
                this.publishParams.alertinfo = item.text;
                this.addModelEntity(item.model, item.modelurl, true);
              });
              this.flag.drawFlag = true;
            } else {
              this.flag.drawFlag = true;
              this.$message({
                type: "warning",
                message: "暂无数据",
              });
            }
          } else {
            this.$message({
              type: "warning",
              message: "该时间段暂无数据",
            });
            this.flag.drawFlag = true;
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: "服务器错误",
          });
          this.flag.drawFlag = true;
        });
    },
    getBoundary() {
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
    selectValue(val) {
      CesiumCore.deleteDataSource(cesiumViewer); //清除实体数据集
      this.getPubilsh({
        name: DateFormat(this.publishTime, 4),
        model: val,
        token: this.$store.getters.token,
      });
    },
    streetFeatures(val) {
      this.addStreetPolygonEntity();
    },
  },
};
</script>
<style scoped>
#product {
  width: 100%;
  height: 100vh;
}

.publish {
  display: flex;
  align-items: center;
}
.publish-btn {
  margin-left: 0.5rem;
  height: 2.2rem;
  line-height: 1.9rem;
}
.title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2rem 0;
}
.publish-textarea {
  margin: 0.2rem 0;
}
.separate {
  width: 0.125rem;
  height: 2rem;
  background: #31bccb;
  border-radius: 0.2rem;
}
</style>
