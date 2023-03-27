//Monitor
import * as turf from "@turf/turf";
let gradeToColor = {
  level1: new Cesium.Color.fromBytes(200, 200, 4),
  level2: new Cesium.Color.fromBytes(173, 173, 0),
  level3: new Cesium.Color.fromBytes(255, 168, 0),
  level4: new Cesium.Color.fromBytes(0, 0, 224),
  level5: new Cesium.Color.fromBytes(0, 0, 97),
  level6: new Cesium.Color.fromBytes(215, 0, 0),
};
function addWeatherPoint(viewer, features, url, height = 100) {
  let labelText = `${features.value}`;
  const billBoard = viewer.entities.add({
    type: features.type,
    name: features.name,
    position: Cesium.Cartesian3.fromDegrees(features.lon, features.lat, height),
    // 图标
    billboard: {
      image: url,
      scale: 0.5,
      //rotation: Cesium.Math.toRadians(90),
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },
    label: {
      //文字标签
      text: labelText,
      font: "14px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -30),
      showBackground: true,
      outlineColor: gradeToColor[features.grade],
      backgroundColor: new Cesium.Color.fromBytes(35, 39, 36).withAlpha(0.8),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },
    information: features,
  });
  return billBoard;
}

function addRedarPolygon(viewer, position, url) {
  let redar = viewer.entities.add({
    position: position,
    rectangle: {
      coordinates: position,
      material: Cesium.Color.WHITE.withAlpha(0.5),
    },
  });
  redar.rectangle.material = new Cesium.ImageMaterialProperty({
    //映射到图像
    image: url, //资源地址
    color: Cesium.Color.LIGHTCYAN.withAlpha(0.6), //背景颜色
  });
  return redar;
}

function addFollowPoint(viewer, features, url, height = 100) {
  const billBoard = viewer.entities.add({
    type: features.type ? features.type : "",
    name: features.name,
    position: Cesium.Cartesian3.fromDegrees(features.lon, features.lat, height),
    // 图标
    billboard: {
      image: url,
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },

    // label: {
    //   //文字标签
    //   text: features.name,
    //   font: "20px sans-serif",
    //   style: Cesium.LabelStyle.FILL,
    //   pixelOffset: new Cesium.Cartesian2(0, -50),
    //   showBackground: true,
    //   backgroundColor: new Cesium.Color.fromBytes(35, 39, 36).withAlpha(0.8),
    //   heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    //   horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
    //   verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    //   disableDepthTestDistance: Number.POSITIVE_INFINITY,
    //   distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    // },
    information: features,
    show: true
  });
  return billBoard;
}
function addRatePoint(viewer, features, url, height = 100) {
  const billBoard = viewer.entities.add({
    type: features.type ? features.type : "",
    name: features.name,
    position: Cesium.Cartesian3.fromDegrees(features.lon, features.lat, height),
    // 图标
    billboard: {
      image: url,
      scale: 0.5,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },

    label: {
      //文字标签
      text: features.name,
      font: "14px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -35),
      showBackground: true,
      outlineColor: Cesium.Color.fromCssColorString("#eb9804"),
      backgroundColor: new Cesium.Color.fromBytes(35, 39, 36).withAlpha(0.8),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },
    information: features,
    show: true
  });
  return billBoard;
}
function addStreetPolyline(viewer, options) {
  let positions = Cesium.Cartesian3.fromDegreesArray(options.polygon);
  const street = viewer.entities.add({
    type: options.type,
    name: options.name,
    position: Cesium.Cartesian3.fromDegrees(options.lon, options.lat, 100),
    polyline: {
      positions: positions,
      width: 2,
      material: Cesium.Color.fromCssColorString("#00fcff"),
      clampToGround: true,
    },
    label: {
      //文字标签
      text: options.name,
      font: "14px sans-serif",
      style: Cesium.LabelStyle.FILL_AND_OUTLINE,
      pixelOffset: new Cesium.Cartesian2(0, -30),
      showBackground: true,
      outlineColor: Cesium.Color.fromCssColorString("#00fcff"),
      backgroundColor: new Cesium.Color.fromBytes(35, 39, 36).withAlpha(0.8),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },
  });
  return street;
}

function addStreetPolygon(viewer, options) {
  let positions = Cesium.Cartesian3.fromDegreesArray(options.polygon);
  const street = viewer.entities.add({
    type: options.type,
    name: options.name,
    polygon: {
      hierarchy: {
        positions: positions,
      },
      material: Cesium.Color.fromCssColorString("#00fcff"),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
  return street;
}

//Warn
function addMoldelPolygon(viewer, position, url, show = false) {
  let model = viewer.entities.add({
    position: position,
    rectangle: {
      coordinates: position,
      material: Cesium.Color.WHITE.withAlpha(0.5),
    },
  });
  model.rectangle.material = new Cesium.ImageMaterialProperty({
    //映射到图像
    image: url, //资源地址
    color: Cesium.Color.LIGHTCYAN.withAlpha(0.6), //背景颜色
  });
  return model;
}

export {
  addWeatherPoint,
  addFollowPoint,
  addRedarPolygon,
  addStreetPolyline,
  addStreetPolygon,
  addMoldelPolygon, addRatePoint
};
