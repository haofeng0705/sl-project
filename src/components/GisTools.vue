<template>
  <div class="gistools-panel" ref="gisToolsPanel">
    <ul>
      <li
        v-for="(item, index) in gisTools"
        :key="index"
        :title="item.title"
        @click="selectTarget(gisTools, item)"
      >
        <span
          :class="
            item.isSelect
              ? `big-iconfont-slt icon-${item.id}`
              : `big-iconfont icon-${item.id}`
          "
        ></span>
      </li>
    </ul>
  </div>
</template>

<script>
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "GisToolsPanel",
  props: {
    gisTools: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    selectTarget(items, item) {
      if (item.isSelect) {
        item.isSelect = false;
        this.$emit("handleGisToolsPanel", item.id, false);
        return;
      }
      radioSelect(items, item);
      this.$emit("handleGisToolsPanel", item.id, true);
    },
  },
  mounted() {
    let toolCount = this.gisTools.length;
    this.$refs.gisToolsPanel.style.width = toolCount * 3 + "rem";
  },
};
</script>

<style scoped>
.gistools-panel {
  z-index: 2;
  position: absolute;
  height: 3.5rem;
  display: flex;
  flex-direction: row-reverse;
  background: url("../assets/images/gisTools.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.gistools-panel ul {
  display: flex;
  width: 90%;
  height: 82%;
  justify-content: space-evenly;
}
.gistools-panel ul li {
  display: flex;
  align-items: center;
  height: 100%;
}
.gistools-panel ul li span {
  transition: all 0.3s;
}
.gistools-panel ul li span:hover {
  color: #ffff00;
}
</style>