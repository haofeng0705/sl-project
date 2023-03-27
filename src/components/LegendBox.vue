<template>
  <div class="legendbox">
    <div class="legend-title">
      <span class="name">{{ legend.legendName }}</span>
      <span class="unit">{{ legend.unit }}</span>
    </div>
    <div class="legend-content">
      <div class="value-bar">
        <ul>
          <li v-for="(item, index) in legend.valueData" :key="index">
            <span class="value-block">{{ item }}</span>
          </li>
        </ul>
      </div>
      <div class="color-bar">
        <ul>
          <li v-for="(item, index) in legend.colorData" :key="index">
            <span
              ref="colorBlock"
              class="color-block"
              style="background: transparent"
              ><span class="legend-text">{{ item.text }}</span></span
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "LegendBox",
  props: {
    legend: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  created() {},
  mounted() {
    this.changeBlockColor(this.legend.colorData);
  },
  methods: {
    changeBlockColor(data) {
      if (data && this.$refs.colorBlock) {
        this.$refs.colorBlock.forEach((item, index) => {
          item.attributes.style.value = `background: ${data[index].color};`;
        });
      }
    },
  },
  watch: {
    //动态监听图例是否发生变化，如果图例名发生变化则调用nextTick修改图列块颜色
    "legend.legendName"(newVal, oldVal) {
      this.$nextTick(() => {
        this.changeBlockColor(this.legend.colorData);
      });
    },
  },
};
</script>

<style scoped>
.legendbox {
  display: flex;
  position: absolute;
  bottom: 9rem;
  right: 2rem;
  z-index: 666;
  flex-direction: column;
  margin: 0 0.3rem;
  padding: 0.75rem 0.5rem;
  width: 3rem;
  background: #23334990;
  border: 0.0625rem #515f77 solid;
  cursor: pointer;
}
.legend-title {
  height: 2.5rem;
  color: #fff;
  font-size: 0.5rem;
  text-align: center;
}

.legend-content {
  display: flex;
}
.value-bar {
  height: 100%;
  width: 50%;
}
.color-bar {
  height: 100%;
  width: 50%;
}
.value-bar ul,
.color-bar ul {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.value-bar ul {
  padding: 1rem 0;
}
.color-bar ul {
  margin-right: 0.3rem;
}
.value-bar ul li,
.color-bar ul li {
  height: 2.1875rem;
  width: 100%;
}
.color-bar ul li {
  padding-left: 0.4rem;
}
.value-bar ul li .value-block,
.color-bar ul li .color-block {
  display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: 0.5rem;
  white-space: nowrap;
}
.value-bar ul li .value-block {
  padding: 0.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.color-bar ul li .color-block .legend-text {
  display: none;
}
.color-bar ul li .color-block:hover .legend-text {
  display: inline-block;
}
</style>