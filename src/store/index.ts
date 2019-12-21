import Vue from 'vue'
import Vuex from 'vuex'
import Account from './Account'
import { getModule } from 'vuex-module-decorators'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Account: Account
  }
})

// 初期化
const account = getModule(Account, store)
account.init()

export default store
