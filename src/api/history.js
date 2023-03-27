import { get } from "./request";

const BaseUrl = "http://121.37.165.19:8083";
//const BaseUrl = "http://10.194.130.127:8083";
const getHistorical = get(`${BaseUrl}/gethistoricalstationbyperiod`); //历史内涝数据获取（时间段）
const getWaterlogStationbyId = get(`${BaseUrl}/gethistoricalareabyid`); //根据历史数据id获取对应易涝点
const getStationbyWaterlog = get(`${BaseUrl}/gethistoricalneareststationbyarea`); //根据易涝点获取站点并排序

export { getHistorical, getWaterlogStationbyId, getStationbyWaterlog };
