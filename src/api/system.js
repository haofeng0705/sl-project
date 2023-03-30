import { get, post, put } from "./request";

const BaseUrl = "http://121.37.165.19:8083";
//const BaseUrl = "http://10.194.130.127:8083";//

const getWarningMsgList = get(`${BaseUrl}/getWarningMsgListByRecentHour`) //服务器拿不到数据

const getDictionary = get(`${BaseUrl}/dictionary/fetchDictionary`)

const getSysLogByQuery = get(`${BaseUrl}/querySysLogByQuery`)

const deleteHistoricalData = get(`${BaseUrl}/deleteHistoricalDataBatch`)

const addHistoricalData = post(`${BaseUrl}/addHistoricalData`)

const editHistoricalData = put(`${BaseUrl}/editHistoricalData`)

const getStationSlThresholdList = get(`${BaseUrl}/getStationSlThresholdList`)

const editStationSlThreshold = get(`${BaseUrl}/editStationSlThresholdByStationIdC`)

const getSmsReceiverList = get(`${BaseUrl}/getSmsReceiverList`)

const addSmsReceiver = post(`${BaseUrl}/addSmsReceiver`)

const editSmsReceiver = put(`${BaseUrl}/editSmsReceiver`)

const deleteSmsReceiverBatch = get(`${BaseUrl}/deleteSmsReceiverBatch`)

const getSmsPublishInfoList = get(`${BaseUrl}/getSmsPublishInfoList`)

export {
    getWarningMsgList, getDictionary, getSysLogByQuery, addHistoricalData, deleteHistoricalData, editHistoricalData, getStationSlThresholdList, editStationSlThreshold, getSmsReceiverList, addSmsReceiver, editSmsReceiver, deleteSmsReceiverBatch, getSmsPublishInfoList
};
