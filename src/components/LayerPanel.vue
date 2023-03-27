<template>
  <div class="layer-panel">
    <ul
      class="layer-items"
      v-for="(supItems, supIndex) in layerdata"
      :key="supIndex"
    >
      <li v-for="(subItems, subIndex) in supItems" :key="subIndex">
        <div class="layer-title" v-if="subItems.title">
          <div class="title-name">
            <span :class="`iconfont icon-${subItems.name}`"></span>
            <span>{{ subItems.title }}</span>
          </div>
          <div v-show="subItems.titleSlot" class="slot">
            <slot name="title-slot"></slot>
          </div>
        </div>
        <div class="layer-content" v-if="subItems.type == 'radio'">
          <ul>
            <li
              v-for="(item, index) in subItems.value"
              :key="index"
              @click="radioFunc(subItems.source, subItems.name, supItems, item)"
            >
              <div class="layer-name">
                <span
                  :class="
                    item.isSelect
                      ? `small-iconfont-slt icon-radio-slt`
                      : `small-iconfont icon-radio`
                  "
                ></span>
                <span class="layer-text" :title="item.text">{{
                  item.text
                }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="layer-content" v-else-if="subItems.type == 'checkbox'">
          <ul>
            <li
              v-for="(item, index) in subItems.value"
              :key="index"
              @click="checkboxFunc(subItems.source, subItems.value, item)"
            >
              <div class="layer-name">
                <span
                  :class="
                    item.isSelect
                      ? `small-iconfont-slt icon-checkbox-slt`
                      : `small-iconfont icon-checkbox`
                  "
                ></span>
                <span class="layer-text" :title="item.text">{{
                  item.text
                }}</span>
              </div>
            </li>
          </ul>
        </div>
        <div class="layer-content" v-else-if="subItems.type == 'switch'">
          <ul>
            <li
              v-for="(item, index) in subItems.value"
              :key="index"
              class="switch-li"
              @click="
                switchFunc(
                  subItems.source,
                  subItems.value,
                  subItems.layer,
                  item
                )
              "
            >
              <div class="img-text">
                <img
                  class="switch-img"
                  v-if="item.url"
                  :src="item.url"
                  alt=""
                />
                <span class="layer-text" :title="item.text">{{
                  item.text
                }}</span>
              </div>

              <span
                :class="
                  item.isSelect
                    ? `small-iconfont-slt icon-switch-slt`
                    : `small-iconfont icon-switch`
                "
              ></span>
            </li>
          </ul>
        </div>
        <div v-else class="layer-content"><slot name="layer-slot"></slot></div>
      </li>
    </ul>
  </div>
</template>

<script>
import CesiumCore from "@/CesiumCore/index.js";
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "LayerPanel",
  components: {},
  props: {
    layerdata: {
      type: Array,
      default: () => {
        return [];
      },
    },
    checkValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      value: false,
    };
  },
  methods: {
    radioFunc(source, layerName, items, item) {
      let DataSourceName = `${source}-${item.id}`; //拼接实体数据集name
      let layer = CesiumCore.getDataSourcesByAttr(
        //通过实体数据集的name属性查找数据集
        cesiumViewer,
        "name",
        DataSourceName
      );
      if (layer[0]) {
        //判断layer是否存在
        if (item.isSelect) {
          this.$emit("layerLegend", source, layerName, item.id, false);
          layer[0].show = false; //关闭图层显示状态
          item.isSelect = false; //关闭单选按钮状态
          return;
        }
        this.$emit("layerLegend", source, layerName, item.id, true);
        items.forEach((layerItems) => {
          layerItems.value.forEach((layerItem) => {
            layerItem.isSelect = false;
          });
        });
        item.isSelect = true; //打开单选按钮
        CesiumCore.viewerFlyTo(cesiumViewer, layer[0]); //视角移动到实体
        CesiumCore.closeDataSourcesByFuzzy(cesiumViewer, "name", source); //单选关闭其他实体
        layer[0].show = true; //打开指定图层显示状态
      } else {
        this.$message.warning("暂无图层信息");
      }
    },
    switchFunc(source, items, name, item) {
      let DataSourceName = `${source}-${item.id}`; //拼接实体数据集name
      let layer = CesiumCore.getDataSourcesByAttr(
        //通过实体数据集的name属性查找数据集
        cesiumViewer,
        "name",
        DataSourceName
      );
      if (layer[0]) {
        //判断layer是否存在
        if (item.isSelect) {
          layer[0].show = false; //关闭图层显示状态
          item.isSelect = false; //关闭单选按钮状态
          return;
        }
        // if (source == "street") {
        //   layer[0].entities._entities.values.forEach((item) => {
        //     item.polyline.material = Cesium.Color.fromCssColorString("#ffff00");
        //   });
        // }
        item.isSelect = true;
        // CesiumCore.viewerFlyTo(cesiumViewer, layer[0]); //视角移动到实体
        layer[0].show = true; //打开指定图层显示状态
        CesiumCore.viewerFlyTo(cesiumViewer, layer[0]); //视角移动到实体
      } else {
        this.$message.warning("暂无图层信息");
      }
    },
    checkboxFunc(source, items, item) {
      let entity = CesiumCore.getDataSourcesByAttr(
        //通过实体数据集的name属性查找数据集
        cesiumViewer,
        "name",
        source
      );

      let layers = CesiumCore.getSourceAllEntities(entity[0]._entityCollection);
      let layer = CesiumCore.getEntityByAttr(layers, "name", item.id);
      if (layer[0]) {
        //判断layer是否存在
        if (item.isSelect) {
          layer[0].show = false; //关闭图层显示状态
          item.isSelect = false; //关闭单选按钮状态
          return;
        }
        item.isSelect = true;
        CesiumCore.viewerFlyTo(cesiumViewer, layer[0]); //视角移动到实体
        layer[0].show = true; //打开指定图层显示状态
      } else {
        this.$message.warning("暂无图层信息");
      }
    },
    totalSelect(param) {
      let layer = CesiumCore.getDataSourcesByFuzzy(
        cesiumViewer,
        "name",
        param.source
      );
      let that = this;
      if (param.titleSelect) {
        param.titleSelect = false;
        param.value.forEach((item) => {
          item.isSelect = false;
        });
        layer.forEach((item) => {
          item.show = false;
        });
      } else {
        param.titleSelect = true;
        param.value.forEach((item) => {
          item.isSelect = true;
          layer.forEach((item) => {
            item.show = true;
          });
        });
      }
    },
  },
  created() {},
  mounted() {},
};
</script>

<style scoped>
.layer-panel {
  z-index: 10;
  position: absolute;
  top: 11.5rem;
  right: 2rem;
  width: 14rem;
  color: #fff;
  cursor: pointer;
}
.layer-items {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #0b1f3190;
  border: 0.0625rem solid #fff;
}
.layer-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem;
  border-bottom: 0.0625rem solid #ccc;
}
.layer-content {
  margin-top: 0.4rem;
}
.layer-content > ul > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  line-height: 100%;
  font-size: 0.875rem;
}
.layer-content > ul > li > .color-block {
  display: inline-block;
  width: 1.6rem;
  height: 0.8rem;
  border-radius: 0.1rem;
}
.layer-name {
  display: flex;
  align-items: center;
  height: 100%;
  width: 88%;
}
.layer-title .title-name > span {
  display: inline-block;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0 0 0.4rem 0.2rem;
}
.layer-text {
  display: inline-block;
  margin-left: 0.3rem;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: middle;
}

.switch-li {
  text-overflow: ellipsis;
}
.img-text {
  height: 100%;
}
.switch-img {
  height: 100%;
  width: auto;
  vertical-align: middle;
}
</style>