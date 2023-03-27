

function radioSelect(items, item) {
  items.forEach((item) => {
    item.isSelect = false;
  });
  item.isSelect = true;
}


function exErrorValue(value) {
  return value > 9999 ? -0.1 : value;
}

//数组去重
function unique(arr) {
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    for (var j = 0; j < res.length; j++) {
      if (arr[i] === res[j]) {
        break;
      }
    }
    // 如果数据第一次出现，那么执行完上面for语句后，j的值应该等于res的长度才对
    if (j === res.length) {
      res.push(arr[i]);
    }
  }
  return res;
}
function cloneDeep(obj) {
  var _obj = JSON.stringify(obj),
    objClone = JSON.parse(_obj);
  return objClone;
}

//数组扁平化  多维数组变一维
// function flatten(ary) {
//   return ary.reduce((pre, cur) => {
//     return pre.concat(Array.isArray(cur) ? flatten(cur) : cur);
//   });
// }

function flatten(arr) { return [].concat(...arr.map(x => Array.isArray(x) ? flatten(x) : x)) }


//一维数组变成二维
function oneDToTwoD(arr, num) {
  let newArr = []
  const total = Math.ceil(arr.length / num)
  for (let i = 0; i < total; i++) {
    let a = arr.slice(i * num, (i + 1) * num)
    newArr.push(a)
  }
  return newArr
}


function formatStreetData(data) {
  let polygon = data.reduce((res, item) => {
    //数据经纬度分割
    let street = {};
    street.type = `street-${item.name}`;
    street.name = item.name;
    street.lon = item.centerLon;
    street.lat = item.centerLat;
    street.polygon = [
      ...item.boxNorthwest.split(","), //利用扩展运算符进行数组扁平化
      ...item.boxNortheast.split(","),
      ...item.boxSoutheast.split(","),
      ...item.boxSouthwest.split(","),
      ...item.boxNorthwest.split(","),
    ].map(Number); //利用map函数将字符数组转变成数字数组
    res.push(street);
    return res;
  }, []);
  return polygon;
}


function formatStreetPolyline(data) {
  let polygon = data.reduce((res, item) => {
    let itemPolygon = flatten(item.points);
    //数据经纬度分割
    let street = {};
    street.type = `street-${item.name}`;
    street.name = item.name;
    street.lon = item.centerX;
    street.lat = item.centerY;
    street.polygon = itemPolygon; //利用map函数将字符数组转变成数字数组
    res.push(street);
    return res;
  }, []);
  return polygon;
}


function formatDetailLine(data, totalStation, selectedStation) {
  let detailLine = {
    name: [],
    value: [],
    xzhou: [],
    shuju: [],
    color:[],
  };
  if(totalStation){
    totalStation.forEach((item) => {
      if (selectedStation.indexOf(item.id) != -1) {
        detailLine.color.push(item.color);
      }
    });
  }
  
  let keyObj = {
    key: [],
    value: []
  };
  const map = new Map();
  data.forEach(item => (map.get(item.stationName) ? map.get(item.stationName).push(item) : map.set(item.stationName, [item])))
  data.forEach((item) => { 
    detailLine.name.push(`${item.stationName}(${item.stationIdC})`);
  });
  data.sort((timeSort('datadate', 'positive')))
  data.forEach((item) =>  {
    let newMonth = item.mon < 10 ? "0"+ item.mon : item.mon;
    let newDay = item.day < 10 ? "0"+item.day : item.day;
    let newHour =item.hour < 10 ? "0"+item.hour : item.hour;
    let newMin="";
    if(item.min == undefined){
      newMin = "00";     
    }else{
      newMin = item.min < 10 ? "0"+item.min : item.min;
    }
    let tm = item.year + "-" + newMonth + "-" + newDay + " " + newHour + ":" + newMin + ":00"
    detailLine.xzhou.push(tm.slice(11,16));
    item.tm = tm;
  })
  detailLine.xzhou = unique(detailLine.xzhou)
  detailLine.xzhou.forEach(item => {
    keyObj.key = item
    keyObj.value.push("null")
  })
  for (let i = 0; i < Array.from(map).length; i++) {
    let copyObj = JSON.parse(JSON.stringify(keyObj))
    for (let j = 0; j < Array.from(map)[i][1].length; j++) {
      let flag = detailLine.xzhou.indexOf(Array.from(map)[i][1][j].tm.slice(11,16))
      if (flag > -1) {
        if(Array.from(map)[i][1][j].pre != undefined){
          if(Array.from(map)[i][1][j].pre== null ||Array.from(map)[i][1][j].pre>90000){
            copyObj.value[flag] = "null"
          }else{
            copyObj.value[flag] = Array.from(map)[i][1][j].pre
          }
        }else{
          if(Array.from(map)[i][1][j].pre1h== null ||Array.from(map)[i][1][j].pre1h>90000){
            copyObj.value[flag] = "null"
          }else{
            copyObj.value[flag] = Array.from(map)[i][1][j].pre1h
          }
        }
        
      }
    }
    detailLine.shuju.push(copyObj.value);
  }
  let mergeList = arrayGroupBy(data, 'stationIdC')
  for (let i = 0; i < mergeList.length; i++) {
    detailLine.value.push([])
    for (let j = 0; j < mergeList[i].length; j++) {
      if(mergeList[i][j].pre != undefined){
        if(mergeList[i][j].pre > 90000){
          detailLine.value[i].push([`${mergeList[i][j].tm}`, "null"])
        }else{
          detailLine.value[i].push([`${mergeList[i][j].tm}`, mergeList[i][j].pre])
        }
      }else{
        if(mergeList[i][j].pre1h > 90000){
          detailLine.value[i].push([`${mergeList[i][j].tm}`, "null"])
        }else{
          detailLine.value[i].push([`${mergeList[i][j].tm}`, mergeList[i][j].pre1h])
        }
      }
      
      
    }
  }
  console.log(detailLine);
  detailLine.name = unique(detailLine.name);
  return detailLine;
}
function formatDifferentTime(data, hydrologyType, type = 0) {
  let detailLine = {
    name: [],
    value: [],
    xzhou: [],
    shuju: [],
  };
  let keyObj = {
    key: [],
    value: []
  };
  const map = new Map();
  data.forEach(item => (map.get(item.stationName) ? map.get(item.stationName).push(item) : map.set(item.stationName, [item])))
  if (type == 0) {
    data.forEach((item) => { 
      detailLine.name.push(`${item.stationName}(${item.stationCode})`);
    });
  } else {
    data.forEach((item) => {
      detailLine.name.push(`${item.stationName}`);
    });
  }
  data.sort((timeSort('tm', 'positive')))
  data.forEach((item) =>  {
    detailLine.xzhou.push(item.tm.slice(11, 16));
  })
  detailLine.xzhou = unique(detailLine.xzhou)
  detailLine.xzhou.forEach(item => {
    keyObj.key = item
    keyObj.value.push("null")
  })
  for (let i = 0; i < Array.from(map).length; i++) {
    let copyObj = JSON.parse(JSON.stringify(keyObj))
    for (let j = 0; j < Array.from(map)[i][1].length; j++) {
      let flag = detailLine.xzhou.indexOf(Array.from(map)[i][1][j].tm.slice(11, 16))
      if (flag > -1) {
        if(Array.from(map)[i][1][j][hydrologyType] == null){
          copyObj.value[flag] = "null"
        }else{
          copyObj.value[flag] = Array.from(map)[i][1][j][hydrologyType]
        }
      }
    }
    detailLine.shuju.push(copyObj.value);
  }
  let mergeList = arrayGroupBy(data, 'stationCode')
  for (let i = 0; i < mergeList.length; i++) {
    detailLine.value.push([])
    for (let j = 0; j < mergeList[i].length; j++) {
      detailLine.value[i].push([mergeList[i][j].tm, mergeList[i][j][hydrologyType]])
    }
  }
  console.log(detailLine);
  detailLine.name = unique(detailLine.name);
  return detailLine;
}
function formatDetailLineforHour(
  data,
  totalStation,
  selectedStation,
  interval
) {
  // let detailLine = {
  //   name: [],
  //   color: [],
  //   xAxis: [],
  //   value: [],
  // };
  // totalStation.forEach((item) => {
  //   if (selectedStation.indexOf(item.id) != -1) {
  //     detailLine.color.push(item.color);
  //     detailLine.name.push(`${item.text}(${item.id})`);
  //   }
  // });
  // data.forEach((item) => {
  //   detailLine.xAxis.unshift(item.hour);
  // });
  // let arrValue = Object.values(
  //   data.reduce((res, item) => {
  //     if (interval == "1小时") {
  //       res[item.stationIdC]
  //         ? res[item.stationIdC].unshift(exErrorValue(item.pre1h))
  //         : (res[item.stationIdC] = [exErrorValue(item.pre1h)]);
  //     } else if (interval == "3小时") {
  //       res[item.stationIdC]
  //         ? res[item.stationIdC].unshift(exErrorValue(item.pre3h))
  //         : (res[item.stationIdC] = [exErrorValue(item.pre3h)]);
  //     } else if (interval == "6小时") {
  //       res[item.stationIdC]
  //         ? res[item.stationIdC].unshift(exErrorValue(item.pre6h))
  //         : (res[item.stationIdC] = [exErrorValue(item.pre6h)]);
  //     } else if (interval == "12小时") {
  //       res[item.stationIdC]
  //         ? res[item.stationIdC].unshift(exErrorValue(item.pre12h))
  //         : (res[item.stationIdC] = [exErrorValue(item.pre12h)]);
  //     } else {
  //       res[item.stationIdC]
  //         ? res[item.stationIdC].unshift(exErrorValue(item.pre24h))
  //         : (res[item.stationIdC] = [exErrorValue(item.pre24h)]);
  //     }
  //     return res;
  //   }, [])
  // );

  // detailLine.xAxis = unique(detailLine.xAxis);
  // detailLine.value = arrValue;
  // console.log(detailLine);
  // return detailLine;
  let detailLine = {
    name: [],
    value: [],
    xzhou: [],
    shuju: [],
    color:[],
  };
  totalStation.forEach((item) => {
    if (selectedStation.indexOf(item.id) != -1) {
      detailLine.color.push(item.color);
    }
  });
  let keyObj = {
    key: [],
    value: []
  };
  const map = new Map();
  data.forEach(item => (map.get(item.stationName) ? map.get(item.stationName).push(item) : map.set(item.stationName, [item])))
  data.forEach((item) => { 
    detailLine.name.push(`${item.stationName}(${item.stationIdC})`);
  });
  data.sort((timeSort('datadate', 'positive')))
  data.forEach((item) =>  {
    let newMonth = item.mon < 10 ? "0"+ item.mon : item.mon;
    let newDay = item.day < 10 ? "0"+item.day : item.day;
    let newHour =item.hour < 10 ? "0"+item.hour : item.hour;
    // console.log(item.year);  
    let tm = item.year + "-" + newMonth + "-" + newDay + " " + newHour + ":"  + "00:00"
    detailLine.xzhou.push(tm.slice(11,16));
    item.tm = tm;
  })
  detailLine.xzhou = unique(detailLine.xzhou)
  detailLine.xzhou.forEach(item => {
    keyObj.key = item
    keyObj.value.push("null")
  })
  for (let i = 0; i < Array.from(map).length; i++) {
    let copyObj = JSON.parse(JSON.stringify(keyObj))
    for (let j = 0; j < Array.from(map)[i][1].length; j++) {
      let flag = detailLine.xzhou.indexOf(Array.from(map)[i][1][j].tm.slice(11,16))
      if (flag > -1) {
        if(Array.from(map)[i][1][j][interval]== null ||Array.from(map)[i][1][j][interval]>90000){
          copyObj.value[flag] = "null"
        }else{
          copyObj.value[flag] = Array.from(map)[i][1][j][interval]
        }
      }
    }
    detailLine.shuju.push(copyObj.value);
  }
  let mergeList = arrayGroupBy(data, 'stationIdC')
  for (let i = 0; i < mergeList.length; i++) {
    detailLine.value.push([])
    for (let j = 0; j < mergeList[i].length; j++) {
      if(mergeList[i][j][interval] > 90000){
        detailLine.value[i].push([mergeList[i][j].tm, "null"])
      }else{
        detailLine.value[i].push([mergeList[i][j].tm, mergeList[i][j][interval]])
      }
      
    }
  }
  console.log(detailLine);
  detailLine.name = unique(detailLine.name);
  return detailLine;
}

function singleLineforMin(data) {
  let singleData = {
    name: [],
    id: [],
    xAxis: [],
    value: [],
  };
  data.forEach((item) => {
    singleData.id.push(item.stationIdC);
    singleData.name.push(item.stationName);
    singleData.xAxis.unshift(item.hour + ":" + item.min);
    singleData.value.unshift(exErrorValue(item.pre));
  });
  singleData.id = unique(singleData.id);
  singleData.name = unique(singleData.name);
  return singleData;
}

function singleLineforHour(data, interval) {
  let singleData = {
    name: [],
    id: [],
    xAxis: [],
    value: [],
  };
  data.forEach((item) => {
    singleData.id.push(item.stationIdC);
    singleData.name.push(item.stationName);
    singleData.xAxis.unshift(item.hour);
    singleData.value.unshift(exErrorValue(item[interval]));
  });
  singleData.id = unique(singleData.id);
  singleData.name = unique(singleData.name);
  return singleData;
}

function sliceMinData(obj) {
  let newObj = JSON.parse(JSON.stringify(obj))
  newObj.min = newObj.min.slice(-4);
  for (let i = 0; i < newObj.value.length; i++) {
    newObj.value[i] = newObj.value[i].slice(-4);
  }
  return newObj;
}

const groupBy = (array, f) => {
  const groups = {}
  array.forEach(function (o) {
    const group = JSON.stringify(f(o))
    groups[group] = groups[group] || []
    groups[group].push(o)
  })
  return Object.keys(groups).map(function (group) {
    return groups[group]
  })
}

const arrayGroupBy = (list, groupId) => {
  const sorted = groupBy(list, function (item) {
    return [item[groupId]]
  })
  return sorted
};
//c：对象数组排序的键，
//d：排序方式，"positive"正序，"inverted"倒序。
function timeSort(c, d) {
  return function (a, b) {
    var value1 = a[c];
    var value2 = b[c];
    if (d == "positive") {//正序
      return new Date(value1) - new Date(value2);
    }
    else if (d == "inverted") {//倒序
      return new Date(value2) - new Date(value1);
    }
  }
}
//字符串换行
// function splitText(value){
//   {  
//     var ret = "";//拼接加\n返回的类目项  
//     var maxLength = 9;//每项显示文字个数  
//     var valLength = value.length;//X轴类目项的文字个数  
//     var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
//     if (rowN > 1)//如果类目项的文字大于5,  
//     {  
//         for (var i = 0; i < rowN; i++) {  
//             var temp = "";//每次截取的字符串  
//             var start = i * maxLength;//开始截取的位置  
//             var end = start + maxLength;//结束截取的位置  
//        //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
//             temp = (value).toString().substring(start, end) + "\n";  
//             ret += temp; //凭借最终的字符串  
//         }  
//         return ret;  
//     }  
//     else {  
//                return value;  
//     }  
// }
// }
export {
  radioSelect,
  unique,
  flatten,
  oneDToTwoD,
  cloneDeep,
  formatStreetData,
  formatStreetPolyline,
  formatDetailLine,
  formatDetailLineforHour,
  singleLineforMin,
  singleLineforHour,
  sliceMinData,
  formatDifferentTime,
  timeSort
  // splitText,
};
