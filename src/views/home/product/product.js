export let tableColumns = [
    { prop: "id", label: "序号", align: "left", width: 60 },
    { prop: "type", label: "类型", align: "left", width: 160 },
    {
        prop: "time",
        label: "时间",
        align: "left",
        // formatter: this.formatter, //调用格式化函数  可以对数据进行二次处理
    },
    { prop: "handle", label: "操作", align: "center" },
];

export let tablePage = {
    show: true,
    pageNo: 1,
    limit: 23,
    total: 0, //总数据量
    // sizes: [10, 50, 100], //跳页选项
};

export let tableData = [
];
