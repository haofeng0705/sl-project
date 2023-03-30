import * as echarts from 'echarts';
// import {splitText} from "@/selfTools/FormatData.js";
const lineIcon = require('@/assets/svg/lineIcon.svg');
const barIcon = require('@/assets/svg/barIcon.svg');
const downloadIcon = require('@/assets/svg/downloadIcon.svg');
const enlargIcon = require('@/assets/svg/enlargIcon.svg');
const shrinkIcon = require('@/assets/svg/shrinkIcon.svg');

let myPieBox, myLineBox, myPointBox, stationChart, detailChart, circleChart, scatterChart; //需要动态改变图表数据内容的要在最外层定义全局变量 然后需要在每次进入图表的时候调用销毁函数
//但是这个 图表就不能在同一个页面进行复用了，会导致每次只显示一个图表
/**
 * @description: 销毁chart对象
 * @param {Object} chart对象
 * @return:
 * @author: hf
 */

function destoryChart(chartBox) {
    if (chartBox != null && chartBox != '' && chartBox != undefined) {
        chartBox.dispose();
        //同步测试
    }
}
const install = function (Vue) {
    Object.defineProperties(Vue.prototype, {
        $charts: {
            get() {
                return {
                    pie: function (id, pieData) {
                        destoryChart(myPieBox);
                        myPieBox = echarts.init(document.getElementById(id));
                        let color = ['#04c66b', '#189a01', '#01cbfc', '#ffff00', '#ffa400', '#ff0000', '#fab1a0'];
                        let formatData = function () {
                            //格式化饼图的数据  根据饼图的数据进行相应的格式化
                            let dataCount = pieData.data.length;

                            pieData.data.forEach((item, index) => {
                                item.label = {};
                                item.name = item.typename; //pie的series里面有name字段   没有typename字段  所以进行一个键名转换
                                delete item.typename;
                                if (item.id <= dataCount / 2) {
                                    item.label.formatter = ' {c_style|■} {a_style|{b}}  {b_style|{d}% } \n\n';
                                    item.label.rich = {
                                        c_style: {
                                            color: color[index],
                                        },
                                    };
                                } else {
                                    item.label.formatter = ' {b_style|{d}% }  {a_style|{b}} {c_style|■}\n\n';
                                    item.label.rich = {
                                        c_style: {
                                            color: color[index],
                                        },
                                    };
                                }
                            });
                            return pieData.data;
                        };

                        let option = {
                            title: {
                                text: pieData.title,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 14,
                                    fontWeight: 700,
                                },
                            },
                            tooltip: {
                                //hover提示框
                                trigger: 'item',
                                // formatter: "{b}: {c} ({d}%)",
                            },
                            series: [
                                {
                                    type: 'pie',
                                    radius: ['50%', '70%'], //第一项是内半径,第二项是外半径,内半径为0就是真的饼,不是环形
                                    center: ['50%', '50%'], //控制饼图的上下左右padding
                                    avoidLabelOverlap: false,
                                    label: {
                                        show: true,
                                        position: 'outer',
                                        // formatter:
                                        //   " {b_style|{d}% }  {a_style|{b}} {c_style|■}\n\n",  如果所有数据都一样的话可以对整体数据进行格式化  相当于全局格式化属性
                                        rich: {
                                            a_style: {
                                                color: '#fff',
                                                fontSize: 12,
                                            },
                                            b_style: {
                                                color: '#fff',
                                                fontSize: 18,
                                                fontWeight: 700,
                                            },
                                            c_style: {
                                                fontSize: 18,
                                            },
                                        },
                                        padding: [0, -120],
                                    },
                                    labelLine: {
                                        show: true,
                                        length: 0, //弯折线段的长度
                                        length2: 150, //直线段的长度
                                        lineStyle: {
                                            color: '#215160',
                                        },
                                    },
                                    itemStyle: {
                                        color: function (params) {
                                            return color[params.dataIndex];
                                        },
                                    },
                                    // emphasis: {
                                    //   //文本hover弹起的效果
                                    //   focus: "series",
                                    //   blurScope: "coordinateSystem",
                                    // },
                                    data: formatData(), //调用饼图格式化函数
                                },
                            ],
                        };
                        myPieBox.setOption(option);
                    },
                    point: function (id, pointData) {
                        destoryChart(myPointBox);
                        myPointBox = echarts.init(document.getElementById(id));
                        let colorList = ['#04bdfe90', '#0B5BDE90', '#FADC1190', '#DE850490', '#FF420A90', '#F5011290'];
                        let borderColorList = ['#01dfff', '#0099ff', '#ffff00', '#ffa400', '#FF420A', '#ff0000'];
                        let setSeries = function () {
                            let series = [];
                            pointData.value.forEach((item, index) => {
                                let seriesItem = {};
                                var i = 0;
                                (seriesItem.name = pointData.yAxis[index]), (seriesItem.data = pointData.value[index]), (seriesItem.type = 'scatter');
                                seriesItem.symbolSize = function (data) {
                                    return Math.sqrt(data) * 1.8;
                                };
                                if (i <= pointData.yAxis[index].length) {
                                    seriesItem.itemStyle = {
                                        color: colorList[index],
                                        shadowColor: colorList[index],
                                        borderColor: borderColorList[index],
                                        shadowBlur: 10,
                                        shadowOffsetY: 3,
                                        shadowOffsetX: 3,
                                    };
                                    i++;
                                }
                                series.push(seriesItem);
                            });

                            return series;
                        };
                        let option = {
                            title: {
                                text: '降水站点分布统计' + '\n' + '单位:个',
                                top: 0,
                                textStyle: {
                                    color: '#fff',
                                    fontSize: 12,
                                    fontWeight: 700,
                                },
                            },
                            tooltip: {
                                trigger: 'item',
                            },
                            legend: {
                                show: true,
                                data: pointData.yAxis,
                                itemGap: 2,
                                itemWidth: 8,
                                top: 10,
                                right: 0,
                                textStyle: {
                                    color: '#fff', //这里用参数代替了
                                },
                            },
                            xAxis: {
                                splitLine: {
                                    lineStyle: {
                                        type: 'dashed',
                                    },
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#205768',
                                    },
                                },
                                axisLabel: {
                                    show: true,
                                    color: '#fff', //这里用参数代替了
                                },
                                axisTick: {
                                    show: false,
                                },
                                type: 'category',
                                boundaryGap: false,
                                data: pointData.xAxis,
                            },
                            yAxis: {
                                type: 'value',
                                splitNumber: 4,

                                splitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#205768',
                                    },
                                },
                                axisLabel: {
                                    show: true,
                                    color: '#fff', //这里用参数代替了
                                },
                                axisTick: {
                                    show: false,
                                },
                                data: pointData.yAxis,
                                scale: true,
                            },
                            grid: {
                                top: '20%',
                                left: 0,
                                bottom: '10%',
                                height: '80%',
                                width: '96%',
                                containLabel: true,
                            },

                            series: setSeries(),
                        };
                        myPointBox.setOption(option);
                    },
                    line: function (id, lineData) {
                        destoryChart(myLineBox);
                        myLineBox = echarts.init(document.getElementById(id));
                        let option = {
                            title: [
                                {
                                    text: '单位:m',
                                    left: 0,
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        lineHeight: 16,
                                    },
                                },
                            ],
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b} : {c}',
                            },
                            legend: {
                                // data: lineData.legend,
                                data: [
                                    { name: lineData.name[0], itemStyle: { opacity: 0 } },
                                    { name: lineData.name[1], itemStyle: { opacity: 0 } },
                                    // { name: lineData.name[2], itemStyle: { opacity: 0 } },
                                ],
                                left: 80,
                                width: 300,
                                textStyle: {
                                    color: '#fff',
                                },
                                lineStyle: {
                                    color: '#fff',
                                },
                            },
                            grid: {
                                top: '24%',
                                left: '2%',
                                right: '2%',
                                bottom: 0,
                                containLabel: true,
                            },
                            xAxis: {
                                type: 'time',
                                axisLine: {
                                    onZero: true,
                                    lineStyle: {
                                        color: '#31bccb',
                                    },
                                },
                                splitLine: { show: false },
                                // data: lineData.xAxis,
                                axisLabel: {
                                    fontSize: 10,
                                    // interval: 10,
                                    show: true,
                                    color: '#fff', //这里用参数代替了
                                },
                                axisTick: {
                                    show: false,
                                },
                            },

                            yAxis: {
                                show: true,
                                type: 'value',
                                // data: lineData.ydata,
                                axisLabel: {
                                    fontSize: 6,
                                    show: true,
                                    color: '#fff', //这里用参数代替了
                                    interval: 0,
                                },
                                splitLine: {
                                    lineStyle: {
                                        // 使用深浅的间隔色
                                        color: '#205768',
                                    },
                                },
                            },
                            visualMap: {
                                show: false,
                                // pieces: [
                                //   {
                                //     gte: Number(lineData.pieces[0][0]),
                                //     lt: Number(lineData.pieces[0][1]),
                                //     color: "#00bdff",
                                //   },
                                //   {
                                //     gte: Number(lineData.pieces[1][0]),
                                //     lt: Number(lineData.pieces[1][1]),
                                //     color: "#fff800",
                                //   },
                                //   {
                                //     gte: Number(lineData.pieces[2][0]),
                                //     lt: Number(lineData.pieces[2][1]),
                                //     color: "#ffa400",
                                //   },
                                //   {
                                //     gte: Number(lineData.pieces[3][0]),
                                //     lte: Number(lineData.pieces[3][1]),
                                //     color: "#ff0000",
                                //   },
                                // ],
                            },
                            series: [
                                {
                                    name: lineData.name[0],
                                    type: 'line',
                                    data: lineData.value[0],
                                    symbol: 'emptyCircle',
                                    symbolSize: 2,
                                    lineStyle: {
                                        type: 'solid',
                                        width: 1,
                                    },
                                },
                                {
                                    name: lineData.name[1],
                                    type: 'line',
                                    data: lineData.value[1],
                                    symbol: 'emptyCircle',
                                    symbolSize: 2,
                                    lineStyle: {
                                        type: 'dashed',
                                        width: 1,
                                    },
                                },
                                // {
                                //   name: lineData.name[2],
                                //   type: "line",
                                //   data: lineData.value[2],
                                //   symbol: "emptyCircle",
                                //   symbolSize: 2,
                                //   lineStyle: {
                                //     type: "dotted",
                                //     width: 1,
                                //   },
                                // },
                            ],
                        };
                        myLineBox.setOption(option);
                    },
                    bar: function (id, barData) {
                        let myBarBox;
                        myBarBox = echarts.init(document.getElementById(id));
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                            },
                            legend: {
                                type: 'plain',
                                show: 'true',
                                itemGap: 30,
                                itemWidth: 14,
                                itemHeight: 14,
                                top: -5,
                                left: 0,
                                icon: 'rect',
                                data: [
                                    { name: barData.legend[0] },
                                    { name: barData.legend[1] },
                                    { name: barData.legend[2] },
                                    { name: barData.legend[3] },
                                ],
                                width: 'auto',
                                textStyle: {
                                    color: '#fff',
                                },
                            },
                            grid: {
                                top: 55,
                                right: 100,
                                bottom: 30,
                                left: 40,
                                width: '90%',
                            },
                            xAxis: {
                                show: true,
                                type: 'category',
                                boundaryGap: true,
                                deduplication: null,
                                axisLine: {
                                    show: true,
                                    onZero: true,
                                    lineStyle: {
                                        color: '#1d5c6a',
                                    },
                                },
                                axisLabel: {
                                    margin: 12,
                                    color: '#bbd8e5',
                                },
                                axisTick: {
                                    show: false,
                                },
                                data: barData.xAxis,
                            },
                            yAxis: {
                                name: barData.xAxis[0] == '无预警' ? '单位：个' : '单位：平方公里',
                                nameLocation: 'end',
                                nameTextStyle: {
                                    fontSize: 9,
                                    nameGap: 10,
                                },
                                show: true,
                                type: 'value',
                                deduplication: null,
                                // max: 400,
                                // min: 0,
                                splitNumber: 4,
                                splitLine: {
                                    lineStyle: {
                                        color: '#1d5c6a',
                                    },
                                },
                                axisLine: {
                                    show: false,
                                    onZero: true,
                                    lineStyle: {
                                        color: '#bbd8e5',
                                    },
                                },
                                axisLabel: {
                                    show: true,
                                    color: '#bbd8e5',
                                },
                                // data:column_data.yAxis,
                            },
                            series: [
                                {
                                    barWidth: 10,
                                    name: barData.legend[0],
                                    type: 'bar',
                                    barGap: '70%',
                                    data: barData.data[0],
                                    color: barData.color[0],
                                    itemStyle: {
                                        borderColor: barData.bordercolor[0],
                                        borderWidth: barData.borderWidth,
                                    },
                                },
                                {
                                    barWidth: 10,
                                    name: barData.legend[1],
                                    type: 'bar',
                                    data: barData.data[1],
                                    color: barData.color[1],
                                    itemStyle: {
                                        borderColor: barData.bordercolor[1],
                                        borderWidth: barData.borderWidth,
                                    },
                                },
                                {
                                    barWidth: 10,
                                    name: barData.legend[2],
                                    type: 'bar',
                                    data: barData.data[2],
                                    color: barData.color[2],
                                    itemStyle: {
                                        borderColor: barData.bordercolor[2],
                                        borderWidth: barData.borderWidth,
                                    },
                                },
                                {
                                    barWidth: 10,
                                    name: barData.legend[3],
                                    type: 'bar',
                                    data: barData.data[3],
                                    color: barData.color[3],
                                    itemStyle: {
                                        borderColor: barData.bordercolor[3],
                                        borderWidth: barData.borderWidth,
                                    },
                                },
                            ],
                        };
                        myBarBox.setOption(option);
                    },
                    circle: function (id, circleData) {
                        destoryChart(circleChart);
                        circleChart = echarts.init(document.getElementById(id));
                        let backYellow = `${require('../assets/images/backYellow.png')}`;
                        let backBlue = `${require('../assets/images/backBlue.png')}`;
                        let setColor = function (data) {
                            for (const item of data) {
                                item.label = {};
                                if (item.name.substr(0, 2) == '受灾') {
                                    item.label.formatter = '{a_style|{b}} \n {b_style|{c}km²} \n {c_style|{d}%} \n';
                                    item.label.rich = {
                                        a_style: {
                                            padding: [20, 20, 10, 10],
                                        },
                                        b_style: {
                                            padding: [20, 20, 10, 10],
                                        },
                                        c_style: {
                                            color: '#f0e16b',
                                            padding: [20, 20, 10, 10],
                                        },
                                    };

                                    item.itemStyle = {
                                        borderColor: '#f0e16b',
                                        borderWidth: 2,
                                    };
                                    item.label.backgroundColor = {
                                        image: backYellow,
                                    };
                                } else {
                                    item.label.formatter = '{a_style|{b}} \n {b_style|{c}km²} \n {c_style|{d}%} \n';
                                    item.label.rich = {
                                        a_style: {
                                            padding: [20, 20, 10, 10],
                                        },
                                        b_style: {
                                            padding: [20, 20, 10, 10],
                                        },
                                        c_style: {
                                            color: '#58c3f9',
                                            padding: [20, 20, 10, 10],
                                        },
                                    };
                                    item.label.backgroundColor = {
                                        image: backBlue,
                                    };
                                    item.itemStyle = {
                                        borderColor: '#58c3f9',
                                        borderWidth: 2,
                                    };
                                }
                            }
                            return data;
                        };
                        let option = {
                            tooltip: {
                                trigger: 'item',
                            },
                            title: [
                                {
                                    text: '灾损面积统计',
                                    top: '0%',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 13,
                                    },
                                },
                                {
                                    text: '影响人口统计',
                                    top: '33%',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 13,
                                    },
                                },
                                {
                                    text: '灾损GDP统计',
                                    top: '65%',
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 13,
                                    },
                                },
                            ],

                            series: [
                                {
                                    type: 'pie',
                                    selectedMode: 'single',
                                    radius: [0, '27%'],
                                    top: '6%',
                                    center: ['50%', '10%'],
                                    color: circleData.color,

                                    avoidLabelOverlap: false,
                                    startAngle: 205,
                                    label: {
                                        show: true,
                                        position: 'outside',
                                        color: '#fff',
                                        fontWeight: 'italic',
                                        rich: {
                                            a_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            b_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            c_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                        },
                                    },

                                    labelLine: {
                                        show: true,
                                        length: 0,
                                        length2: 0,
                                    },
                                    data: setColor(circleData.data[0]),
                                },
                                {
                                    type: 'pie',
                                    selectedMode: 'single',
                                    radius: [0, '27%'],
                                    top: '6%',
                                    center: ['50%', '47%'],
                                    color: circleData.color,

                                    avoidLabelOverlap: false,
                                    startAngle: 205,
                                    label: {
                                        show: true,
                                        position: 'outside',
                                        color: '#fff',
                                        fontWeight: 'italic',

                                        rich: {
                                            a_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            b_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            c_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                        },
                                    },

                                    labelLine: {
                                        show: false,
                                    },
                                    data: setColor(circleData.data[1]),
                                },
                                {
                                    type: 'pie',
                                    selectedMode: 'single',
                                    radius: [0, '27%'],
                                    top: '6%',
                                    center: ['50%', '80%'],
                                    color: circleData.color,

                                    avoidLabelOverlap: false,
                                    startAngle: 205,
                                    label: {
                                        show: true,
                                        position: 'outside',
                                        color: '#fff',
                                        fontWeight: 'italic',

                                        rich: {
                                            a_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            b_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                            c_style: {
                                                fontSize: 15,
                                                lineHeight: 20,
                                                padding: 16,
                                                align: 'center',
                                            },
                                        },
                                    },

                                    labelLine: {
                                        show: false,
                                    },
                                    data: setColor(circleData.data[2]),
                                },
                            ],
                        };

                        circleChart.setOption(option);
                    },
                    station: function (id, data) {
                        destoryChart(stationChart);
                        // console.log(data);
                        stationChart = echarts.init(document.getElementById(id));
                        let option = {
                            title: [
                                {
                                    text: '单位:m',
                                    left: 0,
                                    textStyle: {
                                        color: '#fff',
                                        fontSize: 12,
                                        fontWeight: 700,
                                        lineHeight: 16,
                                    },
                                },
                            ],
                            // title:{
                            //   text:data.name + data.id,
                            //   top:0,
                            //   textStyle: {
                            //     fontSize: 15,
                            //     color: "#fff"
                            //   },
                            // },
                            grid: {
                                top: '10%',
                                left: 0,
                                right: '2%',
                                bottom: '2%',
                                containLabel: true,
                            },
                            xAxis: {
                                type: 'category',
                                data: data.xzhou,
                                boundaryGap: false,
                                axisTick: {
                                    show: false, //不显示坐标轴刻度线
                                },
                                axisLabel: {
                                    show: true,

                                    color: '#ffffff',
                                },
                            },
                            yAxis: {
                                type: 'value',
                                axisLabel: {
                                    color: '#ffffff',
                                },
                            },
                            series: [
                                {
                                    data: data.shuju[0],
                                    type: 'line',
                                    smooth: true,
                                    areaStyle: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                            {
                                                offset: 0,
                                                color: '#03b0eb',
                                            },
                                            {
                                                offset: 1,
                                                color: '#0d5571',
                                            },
                                        ]),
                                    },
                                    itemStyle: {
                                        color: '#00b9f9', //改变折线点的颜色
                                    },
                                },
                            ],
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    lineStyle: {
                                        color: '#33ECFF', //显示竖线颜色
                                    },
                                },
                            },
                        };
                        stationChart.setOption(option);
                    },
                    scatter: function (id, scatter_data) {
                        destoryChart(scatterChart);
                        scatterChart = echarts.init(document.getElementById(id));
                        let option = {
                            tooltip: {
                                trigger: 'axis',
                                axisPointer: {
                                    show: true,
                                    type: 'cross',
                                    lineStyle: {
                                        type: 'dashed',
                                        width: 1,
                                    },
                                },
                            },

                            grid: {
                                width: 400,
                                height: 230,
                                bottom: 40,
                            },
                            xAxis: {
                                type: 'value',
                                data: scatter_data.xAxis,
                                axisTick: {
                                    show: false, //不显示坐标轴刻度线
                                },
                                axisLine: {
                                    show: false, //不显示坐标轴线
                                },

                                splitLine: {
                                    show: true,
                                    interval: 'auto',
                                    lineStyle: {
                                        color: '#215661',
                                    },
                                },
                                axisLabel: {
                                    show: true,
                                    formatter: '{value}',

                                    textStyle: {
                                        color: '#ffffff',
                                    },
                                },

                                minorSplitLine: {
                                    show: true,
                                    lineStyle: {
                                        color: '#215661',
                                    },
                                },
                            },
                            yAxis: {
                                type: 'category',
                                data: scatter_data.yAxis,
                                axisTick: {
                                    show: false, //不显示坐标轴刻度线
                                },
                                axisLine: {
                                    show: false, //不显示坐标轴线
                                },
                                axisLabel: {
                                    show: true,
                                    formatter: '{value}',

                                    textStyle: {
                                        color: '#ffffff',
                                    },
                                },
                                minorSplitLine: {
                                    show: true,
                                },
                            },

                            animation: false,

                            series: [
                                {
                                    data: scatter_data.data,
                                    type: 'scatter',
                                    color: new echarts.graphic.RadialGradient(0.6, 0.6, 0.6, [
                                        {
                                            offset: 0,
                                            color: '#ffffff',
                                        },
                                        {
                                            offset: 1,
                                            color: '#FF0101',
                                        },
                                    ]),

                                    itemStyle: {
                                        normal: {
                                            shadowColor: '#FF0101', //  阴影颜色
                                            borderColor: '#FF0101', // 边框颜色
                                            shadowBlur: 10, // 阴影的模糊大小
                                            shadowOffsetX: 0, //阴影水平方向上的偏移距离
                                            shadowOffsetY: 0, // 阴影垂直方向上的偏移距离
                                            opacity: 0.8,
                                        },
                                    },
                                    symbolSize: 16,
                                },
                            ],
                        };
                        scatterChart.setOption(option);
                    },
                    detail: function (id, detailData) {
                        destoryChart(detailChart);
                        detailChart = echarts.init(document.getElementById(id));
                        let setSeries = function () {
                            let series = [];
                            detailData.value.forEach((item, index) => {
                                let seriesItem = {};
                                seriesItem.name = detailData.name[index];
                                if (seriesItem.color) seriesItem.color = detailData.color[index];
                                seriesItem.data = detailData.value[index];
                                seriesItem.type = 'line';
                                seriesItem.lineStyle = {
                                    type: index % 2 == 0 ? 'solid' : 'dashed',
                                    width: 1,
                                };
                                series.push(seriesItem);
                            });
                            return series;
                        };
                        let option = {
                            tooltip: {
                                trigger: 'item',
                                formatter: '{a} <br/>{b} : {c}',
                            },
                            // legend: {
                            //   data: detailData.name,
                            //   show: true,
                            //   right: 0,
                            //   itemWidth: 80,
                            //   width: 500,
                            //   height: 500,
                            //   textStyle: {
                            //     color: "#fff",
                            //   },
                            // },
                            toolbox: {
                                show: true,
                                itemSize: 20,
                                right: '5%',
                                feature: {
                                    dataZoom: {
                                        icon: {
                                            zoom: `image://${enlargIcon}`,
                                            back: `image://${shrinkIcon}`,
                                        },
                                    },
                                    magicType: {
                                        type: ['line', 'bar'],
                                        icon: {
                                            line: `image://${lineIcon}`,
                                            bar: `image://${barIcon}`,
                                        },
                                    },
                                    saveAsImage: {
                                        icon: `image://${downloadIcon}`,
                                        backgroundColor: '#224350',
                                    },
                                },
                            },
                            grid: {
                                top: '12%',
                                left: '5%',
                                right: '5%',
                                bottom: '3%',
                                containLabel: true,
                            },
                            yAxis: {
                                show: true,
                                type: 'value',
                                name: '降水量(单位:毫米)',
                                nameTextStyle: {
                                    color: '#cbe8f6',
                                    fontSize: 16,
                                    lineHeight: 16,
                                    // padding: [10, 10, 10, 10],
                                },
                                axisLabel: {
                                    fontSize: 14,
                                    show: true,
                                    color: '#cbe8f6',
                                    interval: 0,
                                },
                                splitLine: {
                                    lineStyle: {
                                        color: '#04646e',
                                    },
                                },
                            },
                            xAxis: {
                                type: 'time',
                                axisLine: {
                                    onZero: true,
                                    lineStyle: {
                                        color: '#04646e',
                                    },
                                },
                                splitLine: { show: false },
                                boundaryGap: false,
                                axisLabel: {
                                    fontSize: 12,
                                    show: true,
                                    color: '#cbe8f6', //这里用参数代替了
                                    margin: 20,
                                    rotate: 30,
                                    // interval:0
                                    // formatter: (value) => {
                                    //   return splitText(detailData.xAxis)
                                    // }
                                },
                            },
                            dataZoom: {
                                start: 0,
                                type: 'inside',
                            },
                            series: setSeries(),
                        };
                        detailChart.setOption(option);
                    },
                };
            },
        },
    });
};

export default install;
