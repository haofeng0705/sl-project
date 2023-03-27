import { get, postquery } from "./request";

const BaseUrl = "http://121.37.165.19:8083";
//const BaseUrl = "http://10.194.130.127:8083";

const getAllUser = get(`${BaseUrl}/querySysUserMapByParam`); //获取所有用户
const deleteUser = get(`${BaseUrl}/deleteuser`); //删除用户
const getToken = get(`${BaseUrl}/getToken`); //获取token
const lockUser = get(`${BaseUrl}/lock`); //锁定用户
const loginUser = get(`${BaseUrl}/login`); //水文数据提取
const unLock = get(`${BaseUrl}/unlock`); //新增用户
const addUser = postquery(`${BaseUrl}/adduser`); //新增用户
const updateUser = postquery(`${BaseUrl}/updateUser`);

export {
  getAllUser,
  deleteUser,
  getToken,
  lockUser,
  loginUser,
  unLock,
  addUser,
  updateUser,
};
