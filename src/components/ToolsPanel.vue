<template>
  <div class="tools-panel" ref="toolsPanel">
    <ul>
      <li
        v-for="(item, index) in tools"
        :key="index"
        :title="item.title"
        @click="selectTarget(tools, item)"
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
  name: "ToolsPanel",
  props: {
    tools: {
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
        this.$emit("handleToolsPanel", item.id, false);
        return;
      }
      radioSelect(items, item);
      this.$emit("handleToolsPanel", item.id, true);
    },
  },
  mounted() {
    let toolCount = this.tools.length;
    this.$refs.toolsPanel.style.width = toolCount * 3 + "rem";
  },
};
</script>

<style scoped>
.tools-panel {
  z-index: 8;
  position: absolute;
  height: 3.5rem;
  display: flex;
  flex-direction: row-reverse;
  background: url("../assets/images/toolsback.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.tools-panel ul {
  display: flex;
  width: 90%;
  height: 82%;
  justify-content: space-evenly;
}
.tools-panel ul li {
  display: flex;
  align-items: center;
  height: 100%;
}
.tools-panel ul li span {
  transition: all 0.3s;
}
.tools-panel ul li span:hover {
  color: #ffff00;
}
</style>