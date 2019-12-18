import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import VueCompositionApi from '@vue/composition-api'
import { provideStore, useStore } from '@/provide'

// VueCompositionApiを使う
Vue.use(VueCompositionApi)

// VueCompositionApiではthis.$storeを取れないのでグローバル設定
Vue.prototype.$store = store
Vue.prototype.$test = router

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
