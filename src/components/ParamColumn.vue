<template>
  <div class="param-column">
    <div class="param-title" v-if="paramdata.title">
      <div class="title-name" @click="totalSelect(paramdata)">
        <span :class="`iconfont icon-${paramdata.name}`"></span>
        <span>{{ paramdata.title }}</span>
      </div>
      <div class="param-select" v-if="paramdata.title == '水文站点列表'">
        <el-select v-model="defaultHvalue" @change="getValue" placeholder="请选择">
          <el-option v-for="(item, index) in selOptions" :key="index" :label="item.label" :value="item.label"> </el-option>
        </el-select>
      </div>
      <div v-show="paramdata.titleSlot" class="slot">
        <slot name="title-slot"></slot>
      </div>
    </div>
    <div class="param-content" v-if="paramdata.type == 'radio'">
      <ul>
        <li v-for="(item, index) in paramdata.value" :key="index" @click="radioFunc(paramdata.value, paramdata.name, item)">
          <div class="param-name">
            <span :class="item.isSelect ? `small-iconfont-slt icon-radio-slt` : `small-iconfont icon-radio`"></span>
            <span class="param-text" :title="item.text">{{ item.text }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="param-content" v-else-if="paramdata.type == 'checkbox'">
      <ul>
        <li v-for="(item, index) in paramdata.value" :key="index" @click="checkboxFunc(paramdata.value, item)">
          <div class="param-name">
            <span :class="item.isSelect ? `small-iconfont-slt icon-checkbox-slt` : `small-iconfont icon-checkbox`"></span>
            <span class="param-text" :title="item.text">{{ item.text }}</span>
          </div>
          <span ref="colorBlock" class="color-block" style="background: transparent"></span>
        </li>
      </ul>
    </div>
    <div class="param-content" v-else-if="paramdata.type == 'switch'">
      <ul>
        <li
          v-for="(item, index) in paramdata.value"
          :key="index"
          class="switch-li"
          @click="switchFunc(paramdata.value, paramdata.name, item)"
        >
          <span class="param-text" :title="item.text">{{ item.text }}</span>
          <span :class="item.isSelect ? `small-iconfont-slt icon-switch-slt` : `small-iconfont icon-switch`"></span>
        </li>
      </ul>
    </div>
    <div v-else class="param-content"><slot name="param-slot"></slot></div>
  </div>
</template>

<script>
import { radioSelect } from '@/selfTools/FormatData.js'
export default {
  name: 'ParamColumn',
  components: {},
  props: {
    paramdata: {
      type: Object,
      default: () => {
        return {}
      }
    },
    checkValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    switchValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    selOptions: {
      type: Array,
      default: () => {
        return []
      }
    },
    defaultValue: {
      type: String,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      value: false,
      actCheckValue: this.checkValue,
      typeValue: '',
      defaultHvalue: this.defaultValue
    }
  },
  methods: {
    radioFunc(items, item) {
      if (item.isSelect) {
        item.isSelect = false
        this.$emit('handleRadioBox', item.id, false)
        return
      }
      radioSelect(items, item) //打开单选按钮
      this.$emit('handleRadioBox', item.id, true)
    },
    switchFunc(items, item) {
      if (item.isSelect) {
        this.switchValue.remove(item.id)
        this.$emit('handleSwitchBox', this.switchValue, false)
        item.isSelect = false
        return
      }
      item.isSelect = true
      this.switchValue.push(item.id)
      this.$emit('handleSwitchBox', this.switchValue, true)
    },
    checkboxFunc(items, item) {
      if (item.isSelect) {
        this.actCheckValue.remove(item.id)
        this.$emit('handleCheckBox', this.actCheckValue, false)
        item.isSelect = false
        return
      }
      item.isSelect = true
      this.actCheckValue.push(item.id)
      this.$emit('handleCheckBox', this.actCheckValue, true)
    },
    totalSelect(param) {
      let that = this
      if (param.titleSelect) {
        param.titleSelect = false
        param.value.forEach(item => {
          item.isSelect = false
          that.actCheckValue = []
        })
        this.$emit('handleCheckBox', this.actCheckValue, false)
      } else {
        param.titleSelect = true
        param.value.forEach(item => {
          item.isSelect = true
          that.actCheckValue.push(item.id)
        })
        this.$emit('handleCheckBox', this.actCheckValue, false)
      }
    },
    changeBlockColor(data) {
      if (data.valueColor && this.$refs.colorBlock) {
        this.$refs.colorBlock.forEach((item, index) => {
          item.attributes.style.value = `background: ${data.value[index].color};`
        })
      }
    },

    getValue(e) {
      let that = this
      that.typeValue = e
      this.actCheckValue = []
      this.$emit('getDataType', that.typeValue)
    }
  },
  created() {},
  mounted() {
    this.changeBlockColor(this.paramdata)
  }
}
</script>

<style scoped>
.param-column .param-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.4rem;
  border-bottom: 0.0625rem solid #ccc;
}
.param-column .param-select {
  display: flex;
  width: 120px;
  justify-content: space-between;
  /* align-items: center; */
  padding-top: 0rem;
  /* border-bottom: 0.0625rem solid #ccc; */
}

.param-column .param-title {
  height: 2.5rem;
  border-bottom: none;
}
.param-column .param-content {
  margin-top: 0.4rem;
}
.param-column .param-content {
  height: 38.75rem;
  overflow-y: auto;
  margin: 0.3rem 0;
  cursor: pointer;
}
.param-column .param-content > ul > li {
  margin: 0.3rem 0;
  padding-right: 0.5rem;
}

.param-column .param-content > ul > li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 1.5rem;
  line-height: 100%;
  font-size: 0.875rem;
}
.param-column .param-content > ul > li > .color-block {
  display: inline-block;
  width: 1.6rem;
  height: 0.8rem;
  border-radius: 0.1rem;
}
/* 滚动条样式 */
.param-column .param-content::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 0.625rem;
  /*高宽分别对应横竖滚动条的尺寸*/
  height: 1rem;
}

.param-column .param-content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  background-color: #0c375f;
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.2) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.2) 75%,
    transparent 75%,
    transparent
  );
}

.param-column .param-content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 0.3125rem rgba(52, 147, 255, 1);
  background: #0884d630;
}

.param-name {
  display: flex;
  align-items: center;
  height: 100%;
  width: 88%;
}
.param-title .title-name {
  cursor: pointer;
}
.param-title .title-name > span {
  display: inline-block;
  height: 1.5rem;
  line-height: 1.5rem;
  margin: 0 0 0.4rem 0.2rem;
}
.param-text {
  display: inline-block;
  margin-left: 0.3rem;
  overflow: hidden;
  white-space: nowrap;
}

.switch-li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-overflow: ellipsis;
}
</style>