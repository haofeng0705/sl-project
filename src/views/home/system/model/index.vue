<template>
  <div id="model">
    <div
      v-for="(item, index) in domains"
      :id="item.id"
      :key="item.id"
      class="model-row"
    >
      <el-container>
        <el-header height="1rem">{{ item.text }}</el-header>
        <el-main>
          <div class="break-items">
            <div v-for="i in item.breaks" :key="i.id" class="break-item">
              <label style="border: none" :class="i.id" :for="i.id">{{
                i.label
              }}</label
              ><input
                :class="i.id"
                type="text"
                :name="i.id"
                v-model.number="i.value"
              />
            </div>
          </div>
          <div class="confirm-btn" @click="handleModify(item, index)">修改</div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import { getBreakPoint, modifyBreakPoint } from "@/api/model.js";
export default {
  name: "Model",
  data() {
    return {
      domains: [
        {
          id: "cRain",
          text: "临界雨量模型",
          breaks: [
            { id: "yellow", label: "黄色预警", value: 0 },
            { id: "orange", label: "橙色预警", value: 0 },
            { id: "red", label: "红色预警", value: 0 },
          ],
        },
        {
          id: "rConfluence",
          text: "大范围径流汇流模型",
          breaks: [
            { id: "yellow", label: "黄色预警", value: 0 },
            { id: "orange", label: "橙色预警", value: 0 },
            { id: "red", label: "红色预警", value: 0 },
          ],
        },
        {
          id: "uRainFlood",
          text: "城市雨洪径流模型",
          breaks: [
            { id: "yellow", label: "黄色预警", value: 0 },
            { id: "orange", label: "橙色预警", value: 0 },
            { id: "red", label: "红色预警", value: 0 },
          ],
        },
      ],
    };
  },
  created() {
    this.getBreakPoint();
  },
  methods: {
    getBreakPoint() {
      getBreakPoint({ token: this.$store.getters.token }).then((res) => {
        if (res && res.code == 200) {
          const { data } = res;
          data.map((item) => {
            this.domains.forEach((i) => {
              if (i.id == item.name) {
                this.$set(i, "breaks", [
                  { id: "yellow", label: "黄色预警", value: item.breaks[0] },
                  { id: "orange", label: "橙色预警", value: item.breaks[1] },
                  { id: "red", label: "红色预警", value: item.breaks[2] },
                ]);
              }
            });
          });
        }
      });
    },

    handleModify(item, index) {
      this.$confirm(`确认要修改${item.text}吗`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          let breakPoint = [];
          for (let i = 0; i < item.breaks.length; i++) {
            console.log(Object.prototype.toString.call(item.breaks[i].value));
            if (
              Object.prototype.toString.call(item.breaks[i].value) !==
              "[object Number]"
            ) {
              this.$message({
                type: "error",
                message: "输入数据格式不正确",
              });
              return;
            } else {
              breakPoint.push(item.breaks[i].value);
            }
          }
          modifyBreakPoint({ name: item.id, breaks: breakPoint.toString() })
            .then((res) => {
              if (res && res.code == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.getBreakPoint();
              } else {
                this.$message({
                  type: "success",
                  message: "修改失败",
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
#model {
  display: flex;

  width: 100%;
  height: 100%;
}
.el-header {
  padding: 0.5rem;
  font-size: 1.625rem;
  color: #98a8f4;
}
#model .el-main {
  padding: 0.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.model-row {
  flex: 1;
  margin: 0 1rem;
  border-radius: 0.5rem;
  background: rgba(2, 13, 24, 0.8);
  color: #fff;
}
#model label {
  display: inline-block;
  font-size: 1.625rem;
  margin-bottom: 0.5rem;
}
#model input {
  background: transparent;
  outline: none;
  height: 2.5rem;
  padding: 0.5rem;
  font-size: 1.5rem;
}
.yellow {
  color: rgb(238, 238, 110);
  border: 0.0625rem solid rgb(238, 238, 110);
}
.orange {
  color: rgb(236, 179, 72);
  border: 0.0625rem solid rgb(236, 179, 72);
}
.red {
  color: rgb(214, 77, 77);
  border: 0.0625rem solid rgb(214, 77, 77);
}
.break-items {
  padding: 3rem 1rem;
}
.break-item {
  margin: 1.5rem;
}
.confirm-btn {
  width: 20rem;
  height: 2.5rem;
  line-height: 2.5rem;
  text-align: center;
  border-color: #98a8f4;
  color: #98a8f4;
}
.confirm-btn:hover {
  background: #98a8f4;
  color: #fff;
}
</style>
