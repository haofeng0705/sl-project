<template>
  <div class="chart-detail-mask">
    <div class="chart-detail">
      <div class="left-panel">
        <div class="left-title">
          <div class="title-left">
            <span>详情</span>
          </div>
          <div class="title-right">
            <ul>
              <li v-for="(item, index) in icon" :key="item.id" :title="item.title" @click="clickIcon(item, index)">
                <span :class="`iconfont icon-${item.icon}`"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="left-content">
          <div v-show="cutStatus" class="param">
            <slot name="parameter"></slot>
          </div>
          <div v-show="cutStatus" class="inner-chart">
            <slot name="detail-chart"></slot>
          </div>
          <div v-show="!cutStatus" class="inner-table">
            <slot name="detail-table"></slot>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div class="detail-list"><slot name="detail-list"></slot></div>
      </div>
    </div>
  </div>
</template>

<script>
import htmlToExcel from '@/selfTools/htmlToExcel.js'
export default {
  name: 'ChartDetail',
  components: {},
  props: {},
  data() {
    return {
      cutStatus: true,
      icon: [
        {
          id: 'cut',
          title: '切换',
          icon: 'repeat',
          status: 'chart'
        },
        {
          id: 'close',
          title: '关闭',
          icon: 'close'
        }
      ]
    }
  },
  methods: {
    clickIcon(item, index) {
      if (item.id == 'cut') {
        if (item.status == 'chart') {
          this.cutStatus = false
          this.icon.unshift({
            id: 'export',
            title: '导出',
            icon: 'export'
          })
          item.status = 'table'
        } else {
          this.cutStatus = true
          this.icon.shift()
          item.status = 'chart'
        }
      } else if (item.id == 'export') {
        htmlToExcel.getExcel('#detailTable', '降雨数据')
      } else if (item.id == 'close') {
        this.$emit('clickDetailIcon', 'close')
      }
    }
  }
}
</script>
<style scoped>
.chart-detail-mask {
  position: absolute;
  z-index: 888;
  width: 100vw;
  height: 100vh;
}
.chart-detail {
  position: absolute;
  top: 18%;
  left: 28%;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  width: 84rem;
  height: 43rem;
}
.left-panel {
  height: 100%;
  width: 64rem;
  padding: 0.8rem;
  border: 0.0625rem solid #c2dfec;
  border-radius: 0.625rem;
  background: #002240a8;
}
.right-panel {
  height: 100%;
  padding: 0.8rem;
  width: calc(100% - 66rem);
  border: 0.0625rem solid #c2dfec;
  border-radius: 0.625rem;
  background: #002240a8;
}
.left-panel .left-title {
  height: 2.5rem;
  padding: 0.5rem;
  color: #fff;
  display: flex;
  border-bottom: 0.0625rem solid #c2dfec;
}
.left-panel .left-title .ltitle-left {
  flex: 1;
}
.left-panel .left-title .title-right {
  display: flex;
  justify-content: flex-end;
  flex: 1;
}
.left-panel .left-title .title-right ul li {
  width: 1.5rem;
  height: 1.625rem;
  display: inline-block;
}
.left-panel .left-title .title-right ul li span {
  transition: all 0.3s;
}
.left-panel .left-title .title-right ul li span:hover {
  color: #31bccb;
}
.left-panel .left-content {
  height: calc(100% - 2.5rem);
  width: 100%;
}
.left-panel .left-content .parameter {
  height: 6rem;
}
.left-panel .left-content .inner-chart {
  height: calc(100% - 6rem);
}
.left-panel .left-content .inner-table {
  margin-top: 1rem;
  width: 100%;
}
.right-panel .detail-list {
  color: #c2dfec;
  height: 100%;
}
</style>