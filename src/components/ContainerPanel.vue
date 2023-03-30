<template>
  <div class="container-panel">
    <div class="title">
      <span class="title-text"> {{ title }}</span>
    </div>
    <div class="content">
      <div v-show="tabTitle" class="tab-title">
        <div class="tab-text">
          <span>{{ tabTitle }}</span>
        </div>
        <ul class="tab-items">
          <li
            v-for="(item, index) in containerTab"
            :key="index"
            :class="item.isSelect ? 'tab-select' : 'tab-item'"
            @click="selectItem(containerTab, item)"
          >
            <span>{{ item.text }}</span>
          </li>
        </ul>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
// 左 panel 的内容
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "ContainerPanel",
  props: {
    title: {
      type: String,
      default: "",
    },
    tabTitle: {
      type: String,
      default: "",
    },
    containerTab: {
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
    selectItem(items, item) {
      radioSelect(items, item);
      this.$emit("changeContainerTab", item.text, item.id);
    },
  },
};
</script>

<style scoped>
.container-panel {
  position: relative;
  top: 0;
  width: 100%;
  color: #fff;
  z-index: 3;
}
.title {
  padding-left: 2rem;
  height: 2rem;
  margin: 0.5rem 0;
  width: 70%;
  line-height: 2rem;
  font-size: 1.125rem;
  font-weight: 700;
  background: url("../assets/images/titleback.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.container-panel .title .title-text {
  position: relative;
}
.title span::after {
  content: "";
  position: absolute;
  bottom: -0.65rem;
  width: 3rem;
  height: 2.2rem;
  background: url("../assets/images/titleBackPoint.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}

.content {
  height: calc(100% - 2rem);
  display: flex;
  flex-direction: column;
}

.tab-title {
  width: 100%;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
}
.tab-text {
  flex: 2;
  height: 2rem;
  background: url("../assets/images/tabtitlebac.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.tab-text span {
  display: inline-block;
  width: 85%;
  height: 2rem;
  line-height: 2rem;
  text-align: right;
}
.tab-items {
  flex: 7;
}
.tab-items {
  margin-left: -0.8rem;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.tab-items .tab-item {
  flex: 1;
  height: 2rem;
  background: url("../assets/images/tabitembac.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
  transition: all 0.6s;
}

.tab-items .tab-select {
  flex: 1;
  height: 2rem;
  background: url("../assets/images/tabitembac-slt.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
  transform: translateY(-0.3rem);
}
.tab-items .tab-item:hover {
  transform: translateY(-0.3rem);
}

.tab-items li span {
  width: 100%;
  height: 2rem;
  text-align: center;
  line-height: 2rem;
  display: inline-block;
  font-size: 0.75rem;
}
</style>