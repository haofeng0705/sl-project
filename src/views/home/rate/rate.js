export let pointColumns = [
  { prop: "name", label: "受灾点名称", align: "center", },
  { prop: "status", label: "类型", align: "center" },
  { prop: "grade", label: "预警级别", align: "center" },
  {
    prop: "location",
    label: "位置",
    align: "center",
    // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
  },
]
export let staticColumns = [
  { prop: "pre", label: "平均降水量", align: "center", },
  { prop: "pin", label: "降水强度极值", align: "center" },
  { prop: "cov", label: "覆盖范围指标", align: "center" },
  {
    prop: "hra",
    label: "综合评估指标",
    align: "center",
  }, {
    prop: "grade",
    label: "评估等级",
    align: "center",
  },
]
export let fragilityColumns = [
  { prop: "name", label: "区域名称", align: "center", },
  { prop: "area", label: "区域面积", align: "center" },
  { prop: "per", label: "平均值", align: "center" },
  {
    prop: "value",
    label: "易损性",
    align: "center",
  }
]
export let containerTab = [
  {
    id: "rConfluence",
    text: "大范围径流汇流模型",
    isSelect: true,
  },
  {
    id: "cRain",
    text: "临界雨量模型",
    isSelect: false,
  },

  {
    id: "uRainFlood",
    text: "城市雨洪径流模型",
    isSelect: false,
  },

];
export let layerTools = [
  {
    id: "modelLayer",
    title: "模型",
    isSelect: false,
  }, {
    id: "positionLayer",
    title: "定位",
    isSelect: false,
  },
];
export let modelLayer = [
  [
    {
      type: "radio",
      source: 'model',
      name: "modelLayer",
      title: "内涝模型",
      value: [{
        id: "rConfluence",
        text: "大范围径流汇流模型",
        isSelect: true,
      },
      { id: "cRain", text: "临界雨量模型", isSelect: false },

      { id: "uRainFlood", text: "城市雨洪径流模型", isSelect: false },
      { id: "Fragility", text: "易损性分析", isSelect: false },
      ],
    },

  ],
];
export let rateChart = {
  color: ["#0e7fa690", "#9b916290", "#9e6c1f90", "#9a595a90"],
  bordercolor: ["#00b9f9", "#ebd086", "#eb9804", "#d7736e"],
  xAxis: ["无预警", "黄色预警", "橙色预警", "红色预警"],
  borderWidth: 2,
  legend: ["大范围径流汇流模型", "临界雨量模型", "城市雨洪径流模型"],
  data: [],
}