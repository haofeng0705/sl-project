const state = {
  userName: JSON.parse(sessionStorage.getItem("userName")) || "成信大",
  userGrade: JSON.parse(sessionStorage.getItem("userGrade")) || "三级",

};

//唯一可以修改state值的方法,同步阻塞
const mutations = {
  UP_USER_NAME(state, userName) {
    state.userName = userName;
    sessionStorage.setItem("userName", JSON.stringify(state.userName));
  },
  UP_USER_GRADE(state, userGrade) {
    state.userGrade = userGrade;
    sessionStorage.setItem("userGrade", JSON.stringify(state.userGrade));
  },
};
const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
