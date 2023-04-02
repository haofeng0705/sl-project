
//tansParams 转换参数
export function tansParams(params) {
    let result = ''
    //获取对象的属性名数组
    for (const propName of Object.keys(params)) {
        const value = params[propName];
        //使用 encodeURIComponent() 方法将属性名进行 URL 编码，并加上等号，将其存储到变量 part 中。
        var part = encodeURIComponent(propName) + "=";
        //接下来判断当前属性值的类型，如果是对象，则再次使用 for...of 循环遍历对象的属性和属性值。记得排除 null
        if (value !== null && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && typeof (value[key]) !== 'undefined') {
                        let params = propName + '[' + key + ']';
                        var subPart = encodeURIComponent(params) + "=";
                        result += subPart + encodeURIComponent(value[key]) + "&";
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&";
            }
        }
    }
    return result
}
// 用于将一个对象转换成 URL 参数字符串。该函数会遍历对象的属性和属性值，将属性和属性值转换成 URL 参数格式的字符串，最终返回转换后的字符串。
/*
{
  name: 'John',
  age: 30,
  address: {
    city: 'New York',
    country: 'USA'
  }
}
*/
//"name=John&age=30&address[city]=New%20York&address[country]=USA&"
