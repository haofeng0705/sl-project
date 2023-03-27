import { get, postquery } from "./request";

//const BaseUrl = "http://121.37.165.19:8087/"//成信大
//const BaseUrl = "http://10.194.130.125:80/";//双流气象局域名
const BaseUrl = "http://192.168.198.1:8087/"  //马世岩/

const getBreakPoint = get(`${BaseUrl}?Service=flood&request=GetModelInfo`)

const modifyBreakPoint = get(`${BaseUrl}?Service=flood&request=EditeModel`)

const getPoiStation = get(`${BaseUrl}?Service=basedata&request=GetPOIPoints`)

const getCountryPoints = get(`${BaseUrl}?Service=basedata&request=getcountrypoints`)

const getAllProductFiels = get(`${BaseUrl}?Service=flood&request=getwordfiles`)

const creatProduction = postquery(`${BaseUrl}?Service=flood&request=getwordpublish`)

const modifyModel = postquery(`${BaseUrl}?Service=flood&request=UpdateImage`);

const getModelFiles = get(`${BaseUrl}?Service=flood&request=getmodelfiles`)

const getVerify = get(`${BaseUrl}?Service=flood&request=vreify`)

const getStaticRate = get(`${BaseUrl}?Service=flood&request=StaticRate`)

const getinStanceFiles = get(`${BaseUrl}?Service=flood&request=getinstancefiles`)

const getFragility = get(`${BaseUrl}?Service=flood&request=fragility`)

const grtDescribeRastertype = get(`${BaseUrl}?Service=wrs&request=DescribeRastertype&TypeName=geodem.tif&outputFormat=json`);


export {
    getBreakPoint,
    modifyBreakPoint,
    getPoiStation,
    getCountryPoints,
    getAllProductFiels,
    creatProduction,
    modifyModel,
    getModelFiles,
    getVerify,
    getStaticRate,
    getinStanceFiles,
    getFragility,
    grtDescribeRastertype
};
