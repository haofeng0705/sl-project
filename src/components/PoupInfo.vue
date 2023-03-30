<template>
  <div class="poup-info" ref="poupShow">
    <div class="poup-title">
      <div class="title-area">
        <span>{{ info.title }}</span>
        <span class="iconfont icon-close" @click="closePoup"></span>
      </div>
    </div>
    <div class="poup-content" ref="poupContent">
      <ul class="info-items" v-if="info">
        <li
          class="info-item"
          v-for="(item, index) in info.content.generalInfo"
          :key="index"
        >
          <div class="label">{{ item.columnComment }}:</div>
          <div class="value yellowColor">
            {{
              info.content[item.columnName]
                ? info.content[item.columnName]
                : "暂无信息"
            }}
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script >
export default {
  name: "PoupInfo",
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  mounted() {
  },
  methods: {
    closePoup() {
      // this.$refs.poupShow.style.display = "none";
      this.$emit("closePoup", false);
    },
  },
  watch: {},
};
</script>

<style scoped>
.poup-info {
  display: none;
  position: absolute;
  padding: 0.5rem 0;
  z-index: 999;
  /* width: 22rem; */
  /* height: 13.75rem; */
  border: #26436e 0.0625rem solid;
  color: #fff;
  background: rgba(37, 57, 88, 0.3);
  box-shadow: 0.2rem 0.2rem 0.4rem #263d57, -0.2rem -0.2rem 0.4rem #111c29;
  animation: slide 0.5s;
}
.poup-title > div {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 0.5rem;
  width: 100%;
  height: 2rem;
  line-height: 2rem;
  font-weight: 700;
  background-image: linear-gradient(to right, #263d57, #91c3fc);
  border-radius: 0px 0px 0.9375rem 0px;
  animation: title-area 0.8s;
}
.poup-content {
  display: flex;
  flex-direction: column;
  padding: 0 0.5rem;
  overflow: hidden;
}
.info-item {
  display: flex;
  overflow: hidden;
  white-space: nowrap;
}

.yellowColor {
  font-size: 14px;
  font-weight: 600;
  color: #f09e28;
  text-shadow: 0.0625rem 0.0625rem 0.3125rem #002520d2;
  animation: fontColor 0.5s;
}
.label {
  font-size: 0.875rem;
}

@keyframes slide {
  0% {
    border: 0.0625rem solid #26436e00;
    background-color: #26436e00;
    box-shadow: 0.2rem 0.2rem 0.4rem #263d5700, -0.2rem -0.2rem 0.4rem #111c2900;
  }

  100% {
    border: 0.0625rem solid #26436e;
    background-color: rgba(37, 57, 88, 0.3);
    box-shadow: 0.2rem 0.2rem 0.4rem #263d57, -0.2rem -0.2rem 0.4rem #111c29;
  }
}

@keyframes title-area {
  0% {
    width: 0%;
  }

  100% {
    width: 100%;
  }
}

@keyframes fontColor {
  0% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }
  40% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }
  100% {
    color: #ffffff;
    text-shadow: 1px 1px 5px #002520d2;
  }
}
</style>