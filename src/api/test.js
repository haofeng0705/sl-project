import { get } from "./request";

const testURL = "http://localhost:8080";//

const getTestPoint = get(`${testURL}/test.json`)

const getTestRainLine = get(`${testURL}/test2.json`)

const getTestSingleLine = get(`${testURL}/test3.json`)

const getTestRainLineForHour = get(`${testURL}/test4.json`)

export { getTestPoint, getTestRainLine, getTestSingleLine,getTestRainLineForHour };
