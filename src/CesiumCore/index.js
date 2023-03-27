import { cloneDeep } from "./Core";
import {
  initViewer,
  setView,
  viewerFlyTo,
  cameraFlyTo,
  flyToRecFromPoint,
  destroy,
} from "./Viewer";
import { addPrimitives, add3DTileset } from "./Primitives";
import {
  creatDataSource,
  addWallEntity,
  clickGetEntitties,
  addBillboard,
  addPolygonEntity,
  addLabel,
  getAllEntities,
  getDataSourcesByAttr,
  getSubDataSourcesByAttr,
  getDataSourcesByFuzzy,
  closeAllDataSources,
  closeDataSourcesByFuzzy,
  removeAllEntities,
  getAllDataSources,
  getSourceAllEntities, getEntityByAttr, deleteEntity, deleteDataSource
} from "./Entities";
import { induationAnalysis } from "./Analysis";
import { CircleDiffusion } from "./CircleDiffusion";
import { AirRoute } from "./AirRoute"
import { addImageryLayers } from "./ImageryLayers";
import { addModel } from "./Model";
import { PoupInfo, moveGetInfo, infoWindow, infoWindowClose } from "./Info";
import { leftSingleClick, mouseMove, removeEventHandler } from "./Mouse.js";
import { Cartesian3toDegrees, DegreetoCartesian3 } from "./Coordinate";
export default {
  cloneDeep,
  initViewer,
  setView,
  viewerFlyTo,
  cameraFlyTo,
  flyToRecFromPoint,
  destroy,
  addPrimitives,
  add3DTileset,
  creatDataSource,
  addWallEntity,
  clickGetEntitties,
  addBillboard,
  addPolygonEntity,
  addLabel,
  getAllEntities,
  getDataSourcesByAttr,
  getSubDataSourcesByAttr,
  getDataSourcesByFuzzy,
  closeAllDataSources,
  closeDataSourcesByFuzzy,
  removeAllEntities,
  getAllDataSources,
  getSourceAllEntities,
  getEntityByAttr, deleteEntity, deleteDataSource,
  induationAnalysis,
  CircleDiffusion,
  AirRoute,
  addImageryLayers,
  addModel,
  PoupInfo,
  moveGetInfo,
  infoWindow,
  infoWindowClose,
  leftSingleClick,
  mouseMove,
  removeEventHandler,
  Cartesian3toDegrees,
  DegreetoCartesian3,
};
