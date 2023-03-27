import { get } from "./request";

const BaseUrl = "http://121.37.165.19:8083";

// const BaseUrl = "http://10.194.130.127:8083";

const getRainStat = get(`${BaseUrl}/getrainstat`); //取降水量统计
const getDifferTypesRainDatabyType = get(
  `${BaseUrl}/getdiffertypesraindatabytype`
);
const getRegionalFocusDatabyType = get(`${BaseUrl}/getregionalfocusdatabytype`); //提取关注点
const getRealTimeData = get(`${BaseUrl}/getrealtimedata`); ///提取最新时间气象站实况数据
const getRainDistributionbyP = get(`${BaseUrl}/getraindistributionstatbyperiod`); //
const getRainStationOrderbyTag = get(`${BaseUrl}/getrainstationorderbytag`); //降水站点降序数据集提取
const getHydrologyDatabyP = get(`${BaseUrl}/gethydrologydatabyperiod`); //水文数据提取
const getStreetAndTownLoc = get(`${BaseUrl}/getstreetandtownloc`); //街道、城镇坐标数据统计
const getWep = get(`${BaseUrl}/getWep`); //站点天气现象
const getMinRainFallbyP = get(`${BaseUrl}/getrangeminutedatabystationid`); //提取多站分钟降水量数据
const getStaionInfo = get(`${BaseUrl}/getstationinfosl`); //提取站点信息
const getHourRainFallbyP = get(`${BaseUrl}/getrangehoursdatabystationid`);
const getSysDataClassify = get(`${BaseUrl}/getsysdataclassify`); //不同类型等级阈值获取  图例
const getWatercourseKey = get(`${BaseUrl}/getWatercourseKeyStaioRecentnData`)
const getHydrologyStations = get(`${BaseUrl}/getHydrologyStationsByType`)//通过类型获取水文水情站点
const getWatercourseRecentData = get(`${BaseUrl}/getWatercourseRecentData`)//获取河道水情最近n小时数据
const getWatercourseData = get(`${BaseUrl}/getWatercourseData`)//获取河道水情指定时间段数据
const getReservoirWaterRecentData = get(`${BaseUrl}/getReservoirWaterRecentData`)//获取水库水情最近n小时数据
const getReservoirWaterData = get(`${BaseUrl}/getReservoirWaterData`)//获取水库水情指定时间段数据
const getRadarQpeQpfByHours = get(`${BaseUrl}/getRadarQpeQpfByHours`)//获取最近n小时的QPE和QPF图像信息
const getRadarQpeQpfLatest = get(`${BaseUrl}/getRadarQpeQpfLatest`)//获取最新（最后一次）的QPE和QPF图像信息

export {
  getRainStat,
  getDifferTypesRainDatabyType,
  getRegionalFocusDatabyType,
  getRealTimeData,
  getRainDistributionbyP,
  getRainStationOrderbyTag,
  getHydrologyDatabyP,
  getStreetAndTownLoc,
  getWep,
  getMinRainFallbyP,
  getStaionInfo,
  getHourRainFallbyP,
  getSysDataClassify,
  getWatercourseKey,
  getHydrologyStations,
  getWatercourseRecentData,
  getReservoirWaterRecentData,
  getWatercourseData,
  getReservoirWaterData,
  getRadarQpeQpfByHours,
  getRadarQpeQpfLatest
};
