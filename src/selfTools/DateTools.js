function DateFormat(date = new Date(), type = 0, joinStr = ":") {
  let fullDate;
  let year = date.getFullYear();
  let month =
    date.getMonth() + 1 < 10
      ? "0" + (date.getMonth() + 1)
      : date.getMonth() + 1;
  let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  let hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  let noZeroHours = date.getHours();
  let minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  let seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  if (type == 0) {
    fullDate = `${year}-${month}-${day} ${hours}${joinStr}${minutes}${joinStr}${seconds}`;
  } else if (type == 1) {
    fullDate = `${year}-${month}-${day} ${hours}${joinStr}${minutes}`;
  } else if (type == 2) {
    fullDate = `${year}-${month}-${day}`;
  } else if (type == 3) {
    fullDate = `${hours}${joinStr}${minutes}${joinStr}${seconds}`;
  } else if (type == 4) {
    fullDate = `${year}${month}${day}${hours}`;
  } else if (type == 5) {
    fullDate = `${year}年${month}月${day}日${hours}时`;
  } else if (type == 6) {
    fullDate = `${noZeroHours}`;
  }
  return fullDate;
}

function string2Date(str) {
  let year = str.substring(0, 4) * 1
  let month = str.substring(4, 6) * 1 - 1
  let day = str.substring(6, 8) * 1
  let hour = str.substr(8, 10) * 1
  return new Date(year, month, day, hour)
}

function SpecifTime(number) {
  return new Date(new Date().getTime() - number * 60 * 60 * 1000);
}
function intervalDateDay(dayOne,dayTwo){
  return parseInt((dayOne-dayTwo)/(24*60*60*1000))
}
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

/* ajax轮询封装 */
// 接受一个参数 methods，表示需要轮询的请求方法，该方法会每隔 5 分钟进行一次轮询，如果轮询时间超过 5 小时则刷新页面。
function turnQuery(methods) {
  var startTime = new Date().getTime(); //现在的时间
  var interval = setInterval(() => {
    if (new Date().getTime() - startTime > 5 * 60 * 60 * 1000) {
      //现在的时间减去刷新开始的时间大于 5小时
      // clearInterval(interval); //就删除这个 setInterval 轮询
      location.reload(true); //就刷新这个页面
      return;
    }
    methods();
    console.log("轮询");
  }, 5 * 60 * 1000);
}

export { DateFormat, string2Date, SpecifTime, turnQuery, timeSort,intervalDateDay };
