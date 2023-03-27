<template>
  <div class="parameter">
    <div v-for="(row, index) in param" :key="index" class="param-row">
      <div class="factor-name">{{ row.name }} :</div>
      <ul class="factor-items">
        <li
          v-for="(item, i) in row.values"
          :key="i"
          class="factor-item"
          @click="radioFunc(row.values, item)"
        >
          <span
            :class="
              item.isSelect
                ? `small-iconfont-slt icon-radio-slt`
                : `small-iconfont icon-radio`
            "
          ></span>
          <span>{{ item.value }}</span>
        </li>
      </ul>
      <div class="slot time-range" v-show="row.timeRange">
        <slot name="timeRange"></slot>
      </div>
      <div class="slot confirm-button" v-show="row.confirmBtn">
        <slot name="confirmBtn"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import { radioSelect } from "@/selfTools/FormatData.js";
export default {
  name: "Parameter",
  props: {
    param: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: {},
  data() {
    return {};
  },
  created() {},
  methods: {
    radioFunc(items, item) {
      if (item.isSelect) {
        return;
      }
      radioSelect(items, item);
      this.$emit("chartDetailParam", item.code, true);
    },
  },
};
</script>
<style scoped>
.parameter {
  display: flex;
  color: #c2dfec;
  flex-direction: column;
}
.param-row {
  height: 2.1875rem;
  display: flex;
  align-items: center;
  margin: 0.4rem 0.5rem;
}
.factor-items {
  display: flex;
  flex-wrap: wrap;
}
.factor-item {
  margin: 0 0.5rem;
}
.factor-item span {
  margin: 0 0.2rem;
}
.slot {
  margin-left: 2rem;
}
</style>