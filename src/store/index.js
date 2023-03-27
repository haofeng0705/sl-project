import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import app from "./modules/app";
import login from "./modules/login";
import station from "./modules/station";

import getters from "./getters.js";
export default new Vuex.Store({
  modules: {
    app,
    login,
    station
  },
  getters,
});
