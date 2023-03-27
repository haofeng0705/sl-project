const state = {
  activeRouter: JSON.parse(sessionStorage.getItem("activeRouter")) || 0,
  weatherStatus: JSON.parse(sessionStorage.getItem("weatherStatus")) || "晴",
  weatherTem: JSON.parse(sessionStorage.getItem("weatherTem")) || "26°",
  token: JSON.parse(sessionStorage.getItem("token")) || "",
};
//唯一可以修改state值的方法,同步阻塞
const mutations = {
  UP_ACTIVE_ROUTER(state, activeRouter) {
    state.activeRouter = activeRouter;
    sessionStorage.setItem("activeRouter", JSON.stringify(state.activeRouter));
  },

  UP_WEATHER(state, { status, tem }) {
    state.weatherStatus = status;
    state.weatherTem = tem;
    sessionStorage.setItem(
      "weatherStatus",
      JSON.stringify(state.weatherStatus)
    );
    sessionStorage.setItem("weatherTem", JSON.stringify(state.weatherTem));
  },
  UP_TOKEN(state, token) {
    state.token = token;
    sessionStorage.setItem("token", JSON.stringify(state.token));
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
