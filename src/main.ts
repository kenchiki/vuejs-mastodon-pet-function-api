import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCompositionApi from '@vue/composition-api'

// VueCompositionApiを使う
Vue.use(VueCompositionApi)

// vuexが他のvuexを参照するため
Vue.prototype.$store = store

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
