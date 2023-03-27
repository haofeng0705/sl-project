
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
export let tableColumns = [
  { prop: "number", label: "编号", align: "left", width: 120 },
  {
    prop: "name",
    label: "名称",
    align: "left",
    // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
  },
  { prop: "grade", label: "预警级别", align: "left", },
];
export let tablePage = {
  show: true,
  pageNo: 1,
  limit: 4,
  total: 0, //总数据量
  layout: "total, prev, pager,next,jumper",
};
export let layerTools = [
  {
    id: "modelLayer",
    title: "模型",
    isSelect: false,
  },

  {
    id: "positionLayer",
    title: "定位",
    isSelect: false,
  },
];
export let gisTools = [{
  id: "Cruise3D",
  title: "三维巡航",
  isSelect: false,
}, {
  id: "induationAnalysis",
  title: "淹没分析",
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
      value: [
        {
          id: "rConfluence",
          text: "大范围径流汇流模型",
          isSelect: true,
        },
        { id: "cRain", text: "临界雨量模型", isSelect: false },
        { id: "uRainFlood", text: "城市雨洪径流模型", isSelect: false },
      ],
    },
    // {
    //   type: "radio",
    //   name: "modelLayer",
    //   title: "模型集合",
    //   value: [
    //     { id: "最大", text: "最大", isSelect: false },
    //     {
    //       id: "最小",
    //       text: "最小",
    //       isSelect: false,
    //     },
    //     { id: "集成", text: "集成", isSelect: false },
    //   ],
    // },
  ],
];
export let warnGrade = {
  color: ["#00b9f9", "#fff301", "#ffb801", "#ff6060"],
  xAxis: [],
  bordercolor: 0,
  borderWidth: "none",
  legend: ["无预警", "黄色预警", "橙色预警", "红色预警"],
  data: [[], [], [], []],
}
export let warnWaterlog = {
  color: ["#2fa5ff", "#fdbf01", "#45fbb2"],
  xAxis: ["无预警", "黄色预警", "橙色预警", "红色预警"],
  // "yAxis": [0, 100, 200, 300, 400],
  bordercolor: 0,
  borderWidth: "none",
  legend: ["大范围径流汇流模型", "临界雨量模型", "城市雨洪径流模型"],
  data: [],
}