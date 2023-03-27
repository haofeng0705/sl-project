//唯一取值的方法,相当于组件中的computer
const getters = {
  activeRouter: (state) => state.app.activeRouter,
  token: (state) => state.app.token,
  weatherStatus: (state) => state.app.weatherStatus,
  weatherTem: (state) => state.app.weatherTem,
  userName: (state) => state.login.userName,
  userGrade: (state) => state.login.userGrade,
  warnstationList: (state) => state.station.warnstationList,
  ratestationList: (state) => state.station.ratestationList,
  boundary: (state) => state.station.boundary,
};
export default getters;
