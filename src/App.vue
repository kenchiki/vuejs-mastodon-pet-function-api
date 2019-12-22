<template>
  <div id="app">
    <div id="wrapper">
      <div id="header">
        <div id="header-in">
          <h1 id="headerLogo">銀河ペット</h1>
          <nav id="header-nav">
            <ul class="header-nav__links">
              <li><router-link to="/" data-toggle="tooltip" title="tooltip test">ホーム</router-link></li>
              <li><router-link to="/about">このアプリについて</router-link></li>
              <li v-if="!isLogin()"><router-link to="/login">ログイン</router-link></li>
              <li v-if="isLogin()"><router-link to="/messages">お手紙</router-link></li>
              <li v-if="isLogin()"><router-link to="/logout">ログアウト</router-link></li>
            </ul>
          </nav>
        </div>
      </div>
      <div id="container">
        <div v-if="isLogin()">
          <Chara />
        </div>
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Chara from '@/components/Chara.vue'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext, onMounted } from '@vue/composition-api'
import Account from '@/store/Account'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
import $ from 'jquery'

export default {
  components: {
    Chara
  },
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      mastodonUrl: process.env.VUE_APP_MASTODON_ORIGIN,
      store: context.root.$store
    })

    function isLogin (): boolean {
      return account().isLogin
    }

    function account (): Account {
      return getModule(Account, state.store)
    }

    account().init()

    onMounted(() => {
      $('[data-toggle="tooltip"]').tooltip()
    })

    return {
      isLogin
    }
  }
}
</script>

<style lang="scss">
</style>
