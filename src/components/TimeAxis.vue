<template>
  <div class="time-axis">
    <div class="player-btn" @click="playerfunc">
      <span
        :title="isPlayer ? '暂停' : '开始'"
        :class="
          isPlayer ? `big-iconfont icon-pause` : `big-iconfont icon-player`
        "
      ></span>
    </div>
    <el-slider
      v-model="axisValue"
      :marks="marks"
      :step="step"
      :max="max"
      :show-tooltip="false"
    ></el-slider>
  </div>
</template>

<script>
export default {
  name: "TimeAxis",
  props: {
    defaultValue: {
      type: Number,
      default: 0,
    },
    step: {
      type: Number,
      default: 10,
    },
    max: {
      type: Number,
      default: 100,
    },
    marks: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      isPlayer: false,
      axisValue: this.defaultValue,
    };
  },
  methods: {
    playerfunc() {
      if (this.isPlayer) {
        this.$emit("playAxis", false);
      } else this.$emit("playAxis", true);
      this.isPlayer = !this.isPlayer;
    },
    formatTooltip(val) {
      return val / 100;
    },
  },
  mounted() {},
  watch: {
    defaultValue(val) {
      this.axisValue = val;
    },

    axisValue(val) {
      this.$emit("change", val);
    },
  },
};
</script>

<style scoped>
.time-axis {
  height: 3.8rem;
  width: 55rem;
  position: absolute;
  bottom: 8rem;
  left: 50%;
  transform: translateX(-50%);
  background: url("../assets/images/timeaxis.png");
  background-size: 100% 100%;
  background-position: center center;
  overflow: hidden;
}
.player-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 3.5rem;
  height: 80%;
}
</style>