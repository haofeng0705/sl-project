<template>
  <div class="title-right">
    <div
      v-for="(item, index) in list"
      :key="index"
      class="title-func"
      :id="item.id"
    >
      <div class="slash">
        <img :src="imgData.slash" alt="#" />
      </div>
      <div
        v-show="item.img"
        class="title-img"
        @click="item.btn_func ? btnFunc(item) : ''"
      >
        <img :src="item.img" alt="#" />
      </div>
      <div v-show="item.mainText" class="title-text">
        <div class="main-text">{{ item.mainText }}</div>
        <div class="sub-text">{{ item.subText }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import slash from "@/assets/images/slash.png";
export default {
  name: "TitleRight",
  data() {
    return {
      imgData: {
        slash,
      },
    };
  },
  props: {
    list: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  methods: {
    btnFunc(item) {
      console.log('item->',item)
      if (item.isSelect) {
        item.img = require(`@/assets/images/${item.id}.png`);
        item.isSelect = false;
        this.$emit(item.id, false);
        return;
      }
      item.img = require(`@/assets/images/${item.id}-slt.png`);
      item.isSelect = true;
      this.$emit(item.id, true);
    },
  },
  mounted() {},
};
</script>

<style scoped>
.title-right {
  z-index: 2;
  display: flex;
  justify-content: flex-end;
  padding-top: 1rem;
  color: #fff;
}
.title-func {
  display: flex;
}
.slash {
  height: 60%;
  max-width: 100%;
  margin: 0 1rem;
}
.slash img {
  height: 100%;
  width: 100%;
}
.title-img {
  height: 50%;
  max-width: 100%;
  padding: 0.5rem 1rem 0 0;
}
.title-img img {
  width: 100%;
  height: 100%;
}
.main-text {
  font-size: 1.5rem;
  white-space: nowrap;
}
.sub-text {
  font-size: 0.75rem;
  white-space: nowrap;
}
</style>