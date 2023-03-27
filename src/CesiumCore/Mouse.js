/*
 * @Description:鼠标事件
 */
import { isFunction } from "./Core.js";
/**
 * @description: 左键点击获取实体对象
 * @param {type}
 * @return:
 */
function leftSingleClick(viewer, callback) {
  // let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);  //每次都创建一个实例，可以多个共存且根据名字（变量比如：下面的handler）可以清除指定事件  方式1
  let scene = viewer.scene;
  //直接在viewer实例上添加,清除事件会污染整个viewer实例且当前实例存在其它鼠标事件会一并清除（适合一键清除地图上事件） 方式2
  viewer.screenSpaceEventHandler.setInputAction(function (click) {
    let cartesian = viewer.camera.pickEllipsoid(
      click.position,
      viewer.scene.globe.ellipsoid
    );
    if (cartesian) {
      let pickdObject = scene.pick(click.position);
      if (Cesium.defined(pickdObject)) {
        if (isFunction(callback)) {
          callback(pickdObject);
        }
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
function removeEventHandler(viewer) {
  viewer.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.MOUSE_MOVE
  );
  viewer.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
  viewer.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.RIGHT_CLICK
  );
}
function mouseMove(viewer, callback) {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  let scene = viewer.scene;
  handler.setInputAction(function (event) {
    let ellipsoid = scene.globe.ellipsoid;
    let cartesian = viewer.camera.pickEllipsoid(event.endPosition, ellipsoid);
    if (cartesian) {
      //能获取，显示坐标
      let cartographic = ellipsoid.cartesianToCartographic(cartesian);
      if (isFunction(callback)) {
        callback(cartographic);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  return handler;
}

export { leftSingleClick, mouseMove, removeEventHandler };
