<template>
  <div class="loading-back">
    <div class="loading">
      <span>加载中...</span>
    </div>
  </div>
</template>



<style scoped>
.loading-back {
  position: absolute;
  z-index: 666;
  height: 100%;
  width: 100%;
  background: #00000080;
}
.loading {
  position: absolute;
  top: 40%;
  left: 45%;
  z-index: 999;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  border-radius: 50%;
  border-top: 10px solid #63a69f;
  /* 相对定位 */

  /* 执行动画（动画a1 时长 线性的 无限次播放） */
  animation: a1 2s linear infinite;
}
.loading::before,
.loading::after {
  content: "";
  width: 200px;
  height: 200px;
  /* 绝对定位 */
  position: absolute;
  left: 0;
  top: -10px;
  box-sizing: border-box;
  border-radius: 50%;
}
.loading::before {
  border-top: 10px solid #acf2f2;
  /* 旋转120度 */
  transform: rotate(120deg);
}
.loading::after {
  border-top: 10px solid #6ba5f2;
  /* 旋转240度 */
  transform: rotate(240deg);
}
.loading span {
  position: absolute;
  width: 200px;
  height: 200px;
  line-height: 200px;
  text-align: center;
  color: #fff;
  /* 执行动画（动画a2 时长 线性的 无限次播放） */
  animation: a2 2s linear infinite;
}

/* 定义动画 */
@keyframes a1 {
  to {
    transform: rotate(360deg);
  }
}
@keyframes a2 {
  to {
    transform: rotate(-360deg);
  }
}
</style>