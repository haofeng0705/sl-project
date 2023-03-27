import { cloneDeep } from "./Core";

function initViewer(config = {}) {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkY2Y4Y2ZhZS1lOGVkLTQ3NGMtODVjNC1kN2I2NDVhYTY0ZjUiLCJpZCI6OTIwNTksImlhdCI6MTY1MTU0MDUxMH0.AlCpUvdJhfKdPZXIklktZof1HdwY9jEv_VSwD7-OQrA";
  let option = {
    //放大镜图标，查找位置工具，查找到之后会将镜头对准找到的地址，默认使用bing地图
    geocoder: false,
    //房子图标，视角返回初始位置
    homeButton: false,
    //经纬网图标，选择视角的模式，有三种：3D，2D，哥伦布视图（2.5D)
    sceneModePicker: false,
    //地图图标，图层选择器，选择要显示的地图服务和地形服务
    baseLayerPicker: false,
    //问号图标，导航帮助按钮，显示默认的地图控制帮助
    navigationHelpButton: false,
    //动画器件，显示当前时间，允许跳转特定时间
    animation: false,
    //时间轴
    timeline: true,
    //全屏图标，全屏按钮
    fullscreenButton: false,
    //虚拟现实
    vrButton: false,
    //阴影
    shadows: false,
    //点击后显示详细信息
    infoBox: false,
    //展示数据版权属性
    CreditsDisplay: false,
    //关闭点击要素铝框
    selectionIndicator: false,
    shouldAnimate: true,
    terrainExaggeration: 3.0, //地形夸大
  };
  option = cloneDeep(option, config);
  let viewer = new Cesium.Viewer("cesiumContainer", option);
  viewer.cesiumWidget._creditContainer.style.display = "none"; //移除版权
  viewer.scene.debugShowFramesPerSecond = false; //显示帧率
  viewer.scene.backgroundColor = Cesium.Color.TRANSPARENT; //背景颜色
  viewer.scene.postProcessStages.fxaa.enabled = false; // 抗锯齿
  viewer.scene.globe.showGroundAtmosphere = true; // 水雾特效
  // viewer.scene.requestRenderMode = true; //空闲状态下停止渲染
  // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
  viewer.scene.screenSpaceCameraController.constrainedPitch =
    Cesium.Math.toRadians(-20);
  // 取消默认的双击事件
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  );
  //viewer.scene.screenSpaceCameraController.minimumZoomDistance = 2000; //相机的高度的最小值,放大时使用
  // viewer.scene.screenSpaceCameraController.maximumZoomDistance = 40489014; //相机高度的最大值,缩小操作时用
  // viewer.scene.screenSpaceCameraController._minimumZoomRate = 30000; // 设置相机缩小时的速率
  // viewer.scene.screenSpaceCameraController._maximumZoomRate = 30762720; //设置相机放大时的速率
  //viewer.terrainProvider = Cesium.createWorldTerrain(); //创建世界地形
  viewer.scene.globe.depthTestAgainstTerrain = true;
  return viewer;
}
function setView(viewer, lon = 1.814262843373463, lat = 0.5337866347339117, height = 1256.4163577177324) {
  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromRadians(
      lon,
      lat,
      height
    ),
    orientation: {
      heading: 4.222517495057806,
      pitch: -0.4523751235923701,
      roll: 6.283161034133007
    },
  });
}
//飞行到某个实体时使用viewerFlyTo   但是viewerFlyTo不能设置飞行高度  所以配合scene中screenSpaceCameraController的minimumZoomDistance属性设置相机的最小高度
function viewerFlyTo(viewer, entity) {
  viewer.flyTo(entity);
}


//飞行并设计相机位置用cameraFlyTo
117.188028;
36.678703;
function cameraFlyTo(viewer, lon = 103.93041, lat = 30.38837, height = 3000) {
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, height),
    // orientation: {
    //   heading: Cesium.Math.toRadians(1.653466),
    //   pitch: Cesium.Math.toRadians(-35),
    //   roll: 0.0,
    // },
  });
}
const flyToRecFromPoint = (viewer, lon, lat, radius = 1500) => {
  let center = Cesium.Cartesian3.fromDegrees(lon, lat, 0);
  let boundary = new Cesium.BoundingSphere(center, radius)
  viewer.camera.flyToBoundingSphere(boundary);
}

function destroy(viewer) {
  viewer.entities.removeAll();
  viewer.imageryLayers.removeAll(true);
  viewer.destroy();
}
export { initViewer, setView, viewerFlyTo, cameraFlyTo, flyToRecFromPoint, destroy };
