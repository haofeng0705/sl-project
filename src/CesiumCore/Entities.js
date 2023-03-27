import { isFunction } from "./Core";
import { DynamicWallMaterialProperty } from "./Material";
import { leftSingleClick } from "./Mouse";

/**
 * @description: 创建实体数据集
 * @param {Object} viewer对象
 * @param {String} id 数据集id
 * @return:{Object} dataSource 实体数据集对象
 * @author: msy
 */

function creatDataSource(viewer, id, show = false, flag = 0) {
  let dataSource = new Cesium.CustomDataSource(id); //创建name为id的CustomDataSource
  dataSource.show = show;
  dataSource.flag = flag
  viewer.dataSources.add(dataSource); //将该数据集加入到viewer的dataSources中
  return dataSource;
}


/**
 * @description: 添加广告牌,广告牌是一种始终面向用户的标记
 * @param {Object}viewer 地图的viewer对象
 * @param {Object}option 配置属性
 * @return:
 * @author: msy
 */

function addBillboard(viewer, options) {
  const billBoard = viewer.entities.add({
    type: options.type,
    name: options.name,
    position: Cesium.Cartesian3.fromDegrees(options.lon, options.lat, options.height),
    billboard: {
      image: options.url,
      scale: 0.8,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 88888.0),
    },
    information: options,
  });
  return billBoard;
}

function addWallEntity(viewer, options) {
  let positions = Cesium.Cartesian3.fromDegreesArray(options.polygon);
  const wallEntity = viewer.entities.add({
    name: options.id,
    wall: {
      positions: positions,
      // 设置高度
      maximumHeights: new Array(positions.length).fill(100),
      minimunHeights: new Array(positions.length).fill(0),
      // 扩散墙材质
      material: Cesium.Color.fromBytes(0, 203, 255).withAlpha(0.5),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      // heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return wallEntity;
}
/**
 * @description: 添加面实体
 * @param {Object} viewer对象
 * @param options, 要素信息
 * @author: msy
 */

function addPolygonEntity(viewer, options) {
  let positions = Cesium.Cartesian3.fromDegreesArray(options.polygon);
  const polygonEntity = viewer.entities.add({
    type: options.type,
    name: options.name,
    polygon: {
      hierarchy: {
        positions: positions,
      },
      material: Cesium.Color.fromBytes(0, 203, 255).withAlpha(0),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
  return polygonEntity;
}

/**
 * @description: 添加线实体
 * @param {Object} viewer对象
 * @param lon, 经度
 * @param lat, 纬度
 * @author: msy
 */

function addlineEntity(viewer, lon, lat) {
  let linePositions = [];
  linePositions.push(new Cesium.Cartesian3.fromDegrees(lon, lat, 5));
  linePositions.push(new Cesium.Cartesian3.fromDegrees(lon, lat, 1000));
  const lineEntity = viewer.entities.add({
    polyline: {
      positions: linePositions,
      width: 1.5,
      material: Cesium.Color.fromBytes(0, 203, 255).withAlpha(1),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return lineEntity;
}
/**
 * @description: 添加点实体
 * @param {Object} viewer对象
 * @param lon, 经度
 * @param lat, 纬度
 * @author: msy
 */
function addPointEntity(viewer, lon, lat) {
  const pointEntity = viewer.entities.add({
    // 给初始点位设置一定的离地高度，否者会被压盖
    position: Cesium.Cartesian3.fromDegrees(lon, lat, 5),
    point: {
      color: Cesium.Color.fromBytes(0, 203, 255).withAlpha(1),
      pixelSize: 15,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    },
  });
  return pointEntity;
}
/**
 * @description: 添加label标记
 * @param {Object} viewer对象
 * @param {Object} feature 要素属性
 * @author: msy
 */
function addLabel(viewer, options) {
  const labelEntity = viewer.entities.add({
    data: "label",
    name: options.id,
    position: Cesium.Cartesian3.fromDegrees(options.lon, options.lat, 100),
    label: {
      //文字标签
      text: options.name,
      font: "20px sans-serif",
      style: Cesium.LabelStyle.FILL,
      pixelOffset: new Cesium.Cartesian2(0, 0),
      showBackground: true,
      backgroundColor: new Cesium.Color.fromBytes(35, 39, 36).withAlpha(0.8),
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 30000.0),
    },
  });
  return labelEntity;
}

/**
 * @description: 获取点击的实体对象
 * @param {Object} viewer对象
 * @param {function} callback  回调函数
 * @return:
 * @author: msy
 */

function clickGetEntitties(viewer, callback) {
  leftSingleClick(viewer, function (pickdObject) {
    if (isFunction(callback)) {
      callback(pickdObject.id);
    }
  });
}

/**
 * @description: 获取所有实体
 * @param {Object} viewer viewer对象
 * @return: {Object} entities实体对象
 * @author: msy
 */
function getAllEntities(viewer) {
  let entitys = viewer.entities._entities._array;
  return entitys;
}
function getSourceAllEntities(viewer) {
  let entitys = viewer._entities._array;
  return entitys;
}
function getEntityByAttr(viewer, attr, val) {
  //精确查询
  if (!attr) throw "请设置查询时的参照属性";
  if (!val) throw "请设置查询时的参照属性值";
  return viewer.filter((item) => item[attr] == val);
}
/**
 * @description:
 * @param {type}
 * @return:
 * @author: msy
 */
function removeAllEntities(viewer) {
  viewer.entities.removeAll();
}

/**
 * @description: 获取所有自定义实体数据集
 * @param {Object} viewer viewer对象
 * @return: {Array} dataSources
 * @author: msy
 */
function getAllDataSources(viewer) {
  let dataSources = viewer._dataSourceCollection._dataSources;
  return dataSources;
}

function getDataSourcesByAttr(viewer, attr, val) {
  //精确查询
  if (!attr) throw "请设置查询时的参照属性";
  if (!val) throw "请设置查询时的参照属性值";
  let DataSources = getAllDataSources(viewer);
  return DataSources.filter((item) => item[attr] == val);
}


function getSubDataSourcesByAttr(viewer, attr, val) {
  //精确查询
  let data
  if (!attr) throw "请设置查询时的参照属性";
  if (!val) throw "请设置查询时的参照属性值";
  let DataSources = getAllDataSources(viewer);
  DataSources.forEach(item => {
    if (item.name == attr) {
      data = item.entities.values.filter(subitem => subitem.name == val)
    }
  })
  return data
  return DataSources.filter((item) => item[attr] == val);
}

function getDataSourcesByFuzzy(viewer, attr, val) {
  //模糊查询
  if (!attr) throw "请设置查询时的参照属性";
  if (!val) throw "请设置查询时的参照属性值";
  let DataSources = getAllDataSources(viewer);
  return DataSources.filter((item) => item[attr].indexOf(val) != -1);
}

function closeAllDataSources(viewer) {
  let DataSources = getAllDataSources(viewer);
  DataSources.forEach((item) => {
    item.show = false;
  });
}

function closeDataSourcesByFuzzy(viewer, attr, val) {
  let DataSources = getDataSourcesByFuzzy(viewer, attr, val);
  DataSources.forEach((item) => {
    item.show = false;
  });
}
function deleteEntity(viewer) {
  for (let i = 0; i < viewer.entities.values.length; i++) {
    viewer.entities.remove(viewer.entities.values[i]);
    i--;
  }

}
function deleteDataSource(viewer) {
  for (let i = 0; i < viewer._dataSourceCollection._dataSources.length; i++) {
    if (viewer._dataSourceCollection._dataSources[i].hasOwnProperty('flag') && viewer._dataSourceCollection._dataSources[i].flag) continue
    viewer._dataSourceCollection.remove(viewer._dataSourceCollection._dataSources[i], true)
    i--;
  }
}
export {
  creatDataSource,
  addBillboard,
  addPolygonEntity,
  addWallEntity,
  addLabel,
  clickGetEntitties,
  getAllEntities,
  getDataSourcesByAttr,
  getSubDataSourcesByAttr,
  getDataSourcesByFuzzy,
  closeAllDataSources,
  closeDataSourcesByFuzzy,
  removeAllEntities,
  getAllDataSources,
  getSourceAllEntities,
  getEntityByAttr, deleteEntity, deleteDataSource
};
