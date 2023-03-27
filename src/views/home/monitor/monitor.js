export let containerTab = [
  {
    id: "tenMin",
    text: "10分钟",
    isSelect: true,
  },
  {
    id: "oneHour",
    text: "1小时",
    isSelect: false,
  },
  {
    id: "threeHour",
    text: "3小时",
    isSelect: false,
  },
  {
    id: "sixHour",
    text: "6小时",
    isSelect: false,
  },
  {
    id: "twelveHour",
    text: "12小时",
    isSelect: false,
  },
  {
    id: "twentyFHour",
    text: "24小时",
    isSelect: false,
  },
];
export let chartTabList = [
  {
    id: 0,
    text: "站点面积统计",
    isSelect: false,
  },
  {
    id: 1,
    text: "站点数统计",
    isSelect: true,
  },
];
export let tableColumns = [
  { prop: "number", label: "站号", align: "left" },
  {
    prop: "name",
    label: "站名",
    align: "left",
    width: 120,
    // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
  },
  // { prop: "tenMin", label: "10Min", align: "left" },
  { prop: "oneHour", label: "1Hour", align: "left" },
  { prop: "threeHour", label: "3Hour", align: "left" },
  { prop: "sixHour", label: "6Hour", align: "left" },
  { prop: "twelveHour", label: "12Hour", align: "left" },
  { prop: "twentyFHour", label: "24Hour", align: "left" },
];
export let outTablePage = {
  pageNo: 1,
  limit: 5,
  total: 0, //总数据量
  show: true,
  // sizes: [10, 50, 100], //跳页选项
};
export let detailTableColumns = [
  { prop: "number", label: "站号", align: "center" },
  {
    prop: "name",
    label: "站名",
    align: "center",
    width: 120,
    // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
  },
  { prop: "oneHour", label: "1Hour", align: "center" },
  { prop: "threeHour", label: "3Hour", align: "center" },
  { prop: "sixHour", label: "6Hour", align: "center" },
  { prop: "twelveHour", label: "12Hour", align: "center" },
  { prop: "twentyFHour", label: "24Hour", align: "center" },
];
export let innerTablePage = {
  pageNo: 1,
  limit: 50,
  total: 50, //总数据量
  show: false,
  // sizes: [10, 50, 100], //跳页选项
};

export let layerTools = [
  {
    id: "weatherLayer",
    title: "图层信息",
    isSelect: false,
  },

  {
    id: "positionLayer",
    title: "定位",
    isSelect: false,
  },
  {
    id: "follow",
    title: "关注点",
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
export let pieDetailParam = [
  {
    name: "时间范围",
    values: [
      {
        isSelect: true,
        value: "最近3小时",
        code: "最近3小时"
      },
      {
        isSelect: false,
        value: "最近24小时",
        code: "最近24小时"
      },
      {
        isSelect: false,
        value: "自定义时间范围",
        code: "自定义时间范围"
      },
    ],
    type: "radio",
    timeRange: true,
  },
  {
    name: "降水量",
    values: [
      {
        isSelect: true,
        value: "10分钟",
        code: "10分钟"
      },
      {
        isSelect: false,
        value: "1小时",
        code: "pre1h"
      },
      {
        isSelect: false,
        value: "3小时",
        code: "pre3h"
      },
      {
        isSelect: false,
        value: "6小时",
        code: "pre6h"
      },
      {
        isSelect: false,
        value: "12小时",
        code: "pre12h"
      },
      {
        isSelect: false,
        value: "24小时",
        code: "pre24h"
      },
    ],
    type: "radio",
    confirmBtn: true,
  },
];
export let lineDetailWaterParam = [
  {
    name: "时间范围",
    values: [
      {
        isSelect: true,
        value: "最近3小时",
        code: "最近3小时"
      },
      {
        isSelect: false,
        value: "最近24小时",
        code: "最近24小时"
      },
      {
        isSelect: false,
        value: "自定义时间范围",
        code: "自定义时间范围"
      },
    ],
    type: "radio",
    timeRange: true,
  },
  {
    id: "水库水情",
    name: "降水量",
    values: [
      {
        isSelect: true,
        value: "超汛限水位",
        code: "presentStageAlertStageOver"
      },
      {
        isSelect: false,
        value: "超正常水位",
        code: "presentStageNrwtlvStageOver"
      },
      {
        isSelect: false,
        value: "水位涨幅",
        code: "presentStageIncrease"
      },
      {
        isSelect: false,
        value: "水位(M)",
        code: "presentStage"
      },
      {
        isSelect: false,
        value: "入库流量(M3/S)",
        code: "presentInqStage"
      },
      {
        isSelect: false,
        value: "入库流量涨幅(M3/S)",
        code: "presentInqStageIncrease"
      },
    ],
    type: "radio",
    confirmBtn: true,
  },
];
export let lineDetailRiverParam = [
  {
    name: "时间范围",
    values: [
      {
        isSelect: true,
        value: "最近3小时",
        code: "最近3小时"
      },
      {
        isSelect: false,
        value: "最近24小时",
        code: "最近24小时"
      },
      {
        isSelect: false,
        value: "自定义时间范围",
        code: "自定义时间范围"
      },
    ],
    type: "radio",
    timeRange: true,
  },
  {
    id: "河道水情",
    name: "降水量",
    values: [
      {
        isSelect: true,
        value: "超警戒水位",
        code: "presentAlertStageOver"
      },
      {
        isSelect: false,
        value: "超保证水位",
        code: "presentDangerStageOver"
      },
      {
        isSelect: false,
        value: "水位涨幅",
        code: "presentStageIncrease"
      },
      {
        isSelect: false,
        value: "水位(M)",
        code: "presentStage"
      },
      {
        isSelect: false,
        value: "当前流量(M3/S)",
        code: "presentFlow"
      },

    ],
    type: "radio",
    confirmBtn: true,
  },
];
export let chartDetailList = {
  type: "checkbox",
  name: "station",
  title: "站点列表",
  titleSelect: false,
  titleSlot: true,
  valueColor: true,
  value: [],
};
export let hydrologyStationsList = {
  type: "checkbox",
  name: "station",
  title: "水文站点列表",
  titleSelect: false,
  titleSlot: true,
  // valueColor: true,
  value: []
};
export let weatherLayer = [
  [
    {
      type: "radio",
      source: "weather",
      name: "rain",
      title: "降水",
      value: [
        { id: "10mRain", text: "10分钟降水量", isSelect: true },
        { id: "1HRain", text: "1小时降水量", isSelect: false },
        { id: "3HRain", text: "3小时降水量", isSelect: false },
        { id: "6HRain", text: "6小时降水量", isSelect: false },
        { id: "12HRain", text: "12小时降水量", isSelect: false },
        { id: "24HRain", text: "24小时降水量", isSelect: false },
      ],
    },
    {
      type: "radio",
      source: "weather",
      name: "temper",
      title: "温度",
      value: [
        {
          id: "2Mtemper",
          text: "2M气温",
          isSelect: false,
        },
      ],
    },
    {
      type: "radio",
      source: "weather",
      name: "wind",
      title: "风速",
      value: [
        {
          id: "2Mwind",
          text: "2M风速",
          isSelect: false,
        },
        {
          id: "10Mwind",
          text: "10M风速",
          isSelect: false,
        },
      ],
    },
  ],

  [
    {
      type: "radio",
      source: "radar",
      name: "radar",
      title: "雷达产品",
      value: [
        {
          id: "QPE",
          text: "QPE",
          isSelect: false,
        },
        {
          id: "QPF",
          text: "QPF",
          isSelect: false,
        },
      ],
    },
    // {
    //   type: "radio",
    //   name: "actuality",
    //   icon: "actuality",
    //   title: "实况融合",
    //   value: [
    //     {
    //       id: "landfushion",
    //       text: "地面降水融合",
    //       isSelect: false,
    //     },
    //     {
    //       id: "HRCLDAS",
    //       text: "HRCLDAS逐小时实时融合",
    //       isSelect: false,
    //     },
    //   ],
    // },
  ],
];
export let follow = [
  [
    {
      type: "switch",
      source: "follow",
      name: "follow",
      titleSelect: false,
      title: "关注点",
      value: [
        {
          id: "floodHazardPoints",
          text: "防汛隐患点",
          isSelect: false,
          url: require("@/assets/images/fangxun.png"),
        },
        {
          id: "riverRiskPoints",
          text: "江河提防险工险段",
          isSelect: false,
          url: require("@/assets/images/heliu.png"),
        },
        {
          id: "tunnelPoints",
          text: "下穿式立交",
          isSelect: false,
          url: require("@/assets/images/lijiao.png"),
        },
        {
          id: "reservoirPoints",
          text: "重要水库",
          isSelect: false,
          url: require("@/assets/images/shuiku.png"),
        },
      ],
    },
  ],

];

export let pointType = [
  { type: "weather-1HRain", value: "pre1h", grade: "pre1hLev" },
  { type: "weather-3HRain", value: "pre3h", grade: "pre3hLev" },
  { type: "weather-6HRain", value: "pre6h", grade: "pre6hLev" },
  { type: "weather-12HRain", value: "pre12h", grade: "pre12hLev" },
  { type: "weather-24HRain", value: "pre24h", grade: "pre24hLev" },
  { type: "weather-2Mtemper", value: "tem", grade: "temLev" },
  {
    type: "weather-10Mwind",
    value: "winSAvg10mi",
    grade: "winSAvg10miLev",
  },
  {
    type: "weather-2Mwind",
    value: "winSAvg2mi",
    grade: "winSAvg2miLev",
  },
];
