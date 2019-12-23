import Vue from 'vue'
import Vuex from 'vuex'
import Account from './Account'
import Letters from './Letters'
import Friends from './Friends'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Account,
    Letters,
    Friends
  }
})
