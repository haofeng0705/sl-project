const state = {
    warnstationList: [],
    ratestationList: [],
    boundary: 0,
};
//唯一可以修改state值的方法,同步阻塞
const mutations = {
    UP_WARNSTATIONLIST(state, warnstationList) {
        state.warnstationList = warnstationList
    },
    UP_RATESTATIONLIST(state, ratestationList) {
        state.ratestationList = ratestationList
    },
    UP_BOUNDARY(state, boundary) {
        state.boundary = boundary;
    },
};
const actions = {};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
