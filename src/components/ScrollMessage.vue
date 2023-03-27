<template>
  <div class="scroll-message">
    <div class="message-content">
      <div
        class="text-content"
        id="review_box"
        @mouseover="rollStop()"
        @mouseout="rollStart(60)"
      >
        <div class="begin" id="comment1">
          <div
            class="info-item"
            v-for="(item, index) in warnTextList"
            :key="index"
          >
            <span class="info-name">{{ item.name }}</span
            >-<span class="info-text">{{ item.text }}</span>
          </div>
        </div>
        <div class="end" id="comment2">
          <div
            class="info-item"
            v-for="(item, index) in warnTextList"
            :key="index"
          >
            <span class="info-name">{{ item.name }}</span
            >-<span class="info-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ScrollMessage",
  props: {
    warnTextList: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      timer: null,
    };
  },
  created() {},
  beforeDestroy() {
    if (this.timer) clearInterval(this.timer);
  },
  mounted() {
    // this.webScoket();
    //this.scrollLeft();
    this.roll(60);
  },
  methods: {
    roll(t) {
      var ul1 = document.getElementById("comment1");
      var ul2 = document.getElementById("comment2");
      var ulbox = document.getElementById("review_box");
      ul2.innerHTML = ul1.innerHTML;
      ulbox.scrollLeft = 0;
      this.rollStart(t);
    },
    rollStart(t) {
      var ul1 = document.getElementById("comment1");
      var ulbox = document.getElementById("review_box");
      this.rollStop();
      this.timer = setInterval(() => {
        // 当滚动高度大于列表内容高度时恢复为0
        if (ulbox.scrollLeft >= ul1.scrollWidth) {
          ulbox.scrollLeft = 0;
        } else {
          ulbox.scrollLeft++;
        }
      }, t);
    },
    rollStop() {
      clearInterval(this.timer);
    },
    webScoket() {
      let that = this;
      const ws = new WebSocket("ws://127.0.0.1:3000/websocket/test");
      ws.onopen = (e) => {
        console.log(`WebSocket 连接状态： ${ws.readyState}`);
      };
      ws.onmessage = (data) => {
        let text = JSON.parse(data.data);
        if (that.warnTextList.length > 20) {
          that.warnTextList.shift();
        }
        that.warnTextList.push(text);
      };
      ws.onclose = (data) => {
        console.log("WebSocket连接已关闭");
      };
    },
  },
};
</script>

<style scoped>
.scroll-message {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 39rem;
  height: 3.75rem;
  overflow: hidden;
  background: url("../assets/images/warnback.png");
  background-size: 100% 100%;
  background-position: center center;
}
.message-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 96%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}
.text-content {
  display: flex;
  width: auto;
  overflow: hidden;
}

.begin,
.end {
  display: flex;
}
.info-item {
  margin-right: 6rem;
  color: #fff;
  white-space: nowrap;
}
.info-item .info-name {
  color: #06abe4;
}
.info-item .info-value {
  color: #fffc66;
}
</style>