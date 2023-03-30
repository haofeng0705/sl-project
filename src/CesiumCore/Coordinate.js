/**
 * @description: 经纬度转笛卡尔坐标
 * @param {Object} viewer对象
 * @return: 笛卡尔坐标
 * @author: hf
 */
function DegreetoCartesian3(lon, lat, alt) {
    var Cartesian3 = Cesium.Cartesian3.fromDegrees(lon, lat, alt);
    var x = Cartesian3.x;
    var y = Cartesian3.y;
    var z = Cartesian3.z;
    return { x: x, y: y, z: z };
}

/**
 * @description: 笛卡尔坐标系转经纬度
 * @param {Object} viewer对象
 * @param {Object} Cartesian3 笛卡尔坐标
 * @return:  经纬度坐标
 * @author: hf
 */
function Cartesian3toDegrees(Viewer, Cartesian3) {
    let cartograhphic = Viewer.scene.globe.ellipsoid.cartesianToCartographic(Cartesian3);
    let lon = Cesium.Math.toDegrees(cartograhphic.longitude);
    let lat = Cesium.Math.toDegrees(cartograhphic.latitude);
    let alt = cartograhphic.height;
    return [lon, lat];
    return { lon: lon, lat: lat, alt: alt };
}

export { Cartesian3toDegrees, DegreetoCartesian3 };
