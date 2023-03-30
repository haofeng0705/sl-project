<template>
    <div class="scroll-message">
        <div class="message-content">
            <div class="text-content" id="review_box" @mouseover="rollStop()" @mouseout="rollStart(60)">
                <div class="begin" id="comment1">
                    <div class="info-item" v-for="(item, index) in warnTextList" :key="index">
                        <span class="info-name">{{ item.name }}</span
                        >-<span class="info-text">{{ item.text }}</span>
                    </div>
                </div>
                <div class="end" id="comment2">
                    <div class="info-item" v-for="(item, index) in warnTextList" :key="index">
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
    name: 'ScrollMessage',
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
        this.roll(60);
    },
    methods: {
        roll(t) {
            var ul1 = document.getElementById('comment1');
            var ul2 = document.getElementById('comment2');
            var ulbox = document.getElementById('review_box');
            ul2.innerHTML = ul1.innerHTML;
            ulbox.scrollLeft = 0;
            this.rollStart(t);
        },
        rollStart(t) {
            // console.log('666->',666)
            
            var ul1 = document.getElementById('comment1');
          var ulbox = document.getElementById('review_box');

          // console.log('ul1.scrollWidth->',ul1.scrollWidth)
            this.rollStop(); //先清空
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
            const ws = new WebSocket('ws://localhost:9998/echo');

            ws.onopen = function () {
                // Web Socket 已连接上，使用 send() 方法发送数据
                ws.send('发送数据');
                console.log('数据发送中...');
            };

            ws.onmessage = (data) => {
              console.log('连接已接受...');
              console.log('data->',data)
                let text = JSON.parse(data.data);
                if (that.warnTextList.length > 20) {
                    that.warnTextList.shift();
                }
                that.warnTextList.push(text);
            };

            ws.onclose = function () {
                // 关闭 websocket
                console.log('连接已关闭...');
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
    background: url('../assets/images/warnback.png');
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
