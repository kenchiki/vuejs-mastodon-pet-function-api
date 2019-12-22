import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCompositionApi from '@vue/composition-api'
import { provideStore } from '@/storeProvide'

// VueCompositionApiを使う
Vue.use(VueCompositionApi)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  setup: () => {
    provideStore(store)
    return {}
  }
}).$mount('#app')
