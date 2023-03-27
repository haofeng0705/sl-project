/**
 * @description: 淹没分析
 * @param {Object} viewer对象
 * @param {Object} targertWaterHeight目标高度
 * @param {value} positions 面实体经纬度
 * @param {Array} waterHeight 当前高度
 * @author: msy
 */
//水面淹没// positions: Cesium.Cartesian3.fromDegreesArray([
//   19.0, 47.0, 19.0, 48.0, 20.0, 48.0, 20.0, 47.0, 19.0, 47.0,
// ]),
//Cesium.Cartesian3.fromDegreesArrayHeights(adapCoordi) 带有高度的数组坐标
function induationAnalysis(viewer, positions, currentWaterHeight, targertWaterHeight, analysisTime, waterAlpha) {
  let rate = (targertWaterHeight - currentWaterHeight) / (analysisTime * 50);
  let isConstant = false;
  let induationEntity = viewer.entities.add({
    id: 'induationAnalysis',
    polygon: {
      hierarchy: new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArray(positions)
      ),
      perPositionHeight: true,
      // 使用回调函数Callback，直接设置extrudedHeight会导致闪烁
      extrudedHeight: new Cesium.CallbackProperty(function () {
        currentWaterHeight += rate;
        if (currentWaterHeight >= targertWaterHeight) {
          currentWaterHeight = targertWaterHeight;
          return currentWaterHeight;
        }
        return currentWaterHeight;
      }, isConstant),
      material: new Cesium.Color.fromBytes(19, 53, 59).withAlpha(waterAlpha),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
  return induationEntity;
}

export { induationAnalysis };
