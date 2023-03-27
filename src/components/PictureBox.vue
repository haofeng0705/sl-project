<template>
  <div class="picture-box" id="fullscreen">
    <img
      class="small"
      :src="picUrl"
      draggable="false"
      @click="handlePic"
      alt="#"
    />
    <transition name="pic">
      <img class="large" v-if="largeShow" :src="picUrl" alt="" />
    </transition>
  </div>
</template>

<script>
export default {
  name: "PictureBox",
  props: { picUrl: {} },
  data() {
    return {
      largeShow: false,
    };
  },
  methods: {
    handlePic() {
      if (this.largeShow) {
        this.largeShow = false;
      } else {
        this.largeShow = true;
      }
    },
  },
};
</script>

<style scoped>
.picture-box {
  width: 100%;
  height: 100%;
  border: 0.1rem solid #31bccb;
}
.picture-box .small {
  width: 100%;
  height: 100%;
}
.large {
  position: absolute;
  top: -15rem;
  left: 35rem;
  height: 50rem;
  width: 46rem;
  border: 0.1rem solid #31bccb;
}
.pic-enter-active,
.pic-leave-active {
  transition: all 0.8s ease;
}
.pic-enter,
.pic-leave-to {
  top: -15rem;
  left: 0;
  transform: scale(0);
  opacity: 0;
}
.pic-enter-to {
  transform: scale(1);
  opacity: 1;
}
</style>