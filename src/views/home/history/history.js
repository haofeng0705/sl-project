export let firstColumns = [
    { prop: "id", label: "序号", align: "center", width: 50 },
    { prop: "startTime", label: "起始时间", align: "center" },
    {
        prop: "endTime",
        label: "终止时间",
        align: "left",
        // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
    },
    { prop: "name", label: "乡镇/街道", align: "center" },
    { prop: "exStaCount", label: "超站数", align: "center", width: 80 },
]
export let secondColumns = [
    { prop: "id", label: "序号", align: "center", width: 50, },
    { prop: "areastation", label: "地点", align: "center" },
    {
        prop: "areainfluence",
        label: "内涝情况",
        align: "center",
    },
    { prop: "modelResult", label: "模型验证结果", align: "center" },

]
export let firstPage = {
    pageNo: 1,
    limit: 0,
    total: 0, //总数据量
}
export let secondPage = { pageNo: 1, limit: 18, total: 0 }
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
    ],
];
