import Vue from 'vue'
import Vuex from 'vuex'
import Account from './Account'
import Letter from './Letter'
import Friend from './Friend'
import Pet from './Pet'

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
    Letter,
    Friend,
    Pet
  }
})
