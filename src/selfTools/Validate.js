// Object.keys(this.form).some((key) => {
//   //判断信息是否完整
//   if (this.form[key] == "") {
//     this.$message({
//       type: "error",
//       message: "请填写完整信息!",
//     });
//     success = false;
//     return true;
//   }
// });
// 手机号验证
function isValue(value, callback) {
  if (!value) {
    callback({ type: 'error', message: '请完善信息' });
  } else { return true }
  return false
}

function isStationValue(value, callback, index) {
  console.log(value);
  if (!value) {
    callback({ type: 'error', message: `请完善地点${index}的信息` });
  } else { return true }
  return false
}


function isPhone(value, callback) {
  const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
  if (!value) {
    callback({ type: 'error', message: '请输入手机号码' });
  } else if (!reg.test(value)) {
    callback({ type: 'error', message: '请输入正确的11位手机号码' });
  } else {
    return true
    callback();
  }
  return false
}
// 密码验证
function isPassword(value, callback) {
  let regex = /^(?!\D+$)(?![^a-zA-Z]+$)\S{6,20}$/; //6-20位字母数字集合
  if (!value) {
    callback({ type: 'error', message: '请输入密码' });
  } else if (!regex.test(value)) {
    callback({ type: 'error', message: '密码必须是6-20位字母数字集合' });
  } else {
    return true
    callback();
  }
  return false
}
// 验证用户名
function isName(value, callback) {
  let reg1 = /^[\u4E00-\u9FA5]+$/;
  let reg2 = /^[\u4E00-\u9FA5]{2,18}$/;
  if (!value) {
    callback({ type: 'error', message: '请输入用户名' });
  } else if (!reg1.test(value)) {
    callback({ type: 'error', message: '用户名必须为汉字' });
  } else if (!reg2.test(value)) {
    callback({ type: 'error', message: '最少2个字符,最多18个字符' });
  } else {
    return true
    callback();
  }
  return false
}
// 验证用户名是否合法，必须是以字母开头，只能包含字母数字下划线和减号，4到16位
function isAccount(value, callback) {
  let reg = /^[a-zA-Z]\w{2,15}$/;
  if (!value) {
    callback({ type: 'error', message: '请输入账户' });
  } else if (!reg.test(value)) {
    callback({ type: 'error', message: '以字母开头，只能包含字母数字下划线和减号，3到14位' });
  } else {
    return true
    callback();
  }
  return false
}

/* 判断是否为数字,包括浮点数 */
function isNumber(rule, value, callback) {
  let reg = /^(-?\d+)(\.\d+)?$/;
  if (!value) {
    callback(new Error("请输入内容"));
  } else if (!reg.test(value)) {
    callback(new Error("内容必须是数字"));
  } else {
    callback();
  }
}

function isLng(value, callback, index) {
  //验证经度
  let reg =
    /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,10})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,10}|180)$/;
  if (!value) {
    callback({ type: 'error', message: `请输入地点${index}的经度` });
  } else if (!reg.test(value)) {
    callback({ type: 'error', message: `地点${index}的经度整数部分应为0-180,小数部分应为0到10位!` });
  } else {
    return true
    callback();
  }
  return false
}
// //校验纬度是否符合规范
// //纬度
function isLat(value, callback, index) {
  let reg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,10}|90\.0{0,10}|[0-8]?\d{1}|90)$/;

  if (!value) {
    callback({ type: 'error', message: `请输入地点${index}的纬度` });
  } else if (!reg.test(value)) {
    callback({ type: 'error', message: `地点${index}的纬度整数部分应为0-90,小数部分应为0到10位!` });
  } else {
    return true
    callback();
  }
  return false
}


/**
 * @Description:   价格验证，正则（小数点前8位，小数点后5位）
 */
function isPrice(rule, value, callback) {
  let reg = /^(?:0\.\d{0,1}[1-9]|(?!0)\d{1,8}(?:\.\d{0,4}[1-9])?)$/;
  if (!value) {
    return callback(new Error("请输入价格"));
  } else if (!reg.test(value)) {
    callback(new Error("整数部分最大8位，小数部分最多保留5位"));
  } else {
    callback();
  }
}
// 验证是否整数
function isInteger(rule, value, callback) {
  if (!value) {
    return callback(new Error("输入不可以为空"));
  }
  if (!Number(value)) {
    callback(new Error("请输入正整数"));
  } else {
    const re = /^[0-9]*[1-9][0-9]*$/;
    const rsCheck = re.test(value);
    if (!rsCheck) {
      callback(new Error("请输入正整数"));
    } else {
      callback();
    }
  }
}
export {
  isValue,
  isStationValue,
  isName,
  isPhone,
  isPassword,
  isAccount,
  isNumber,
  isLng,
  isLat,
  isPrice,
  isInteger,
};
