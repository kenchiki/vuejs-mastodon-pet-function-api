<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>|
      <router-link to="/login">Login</router-link> |
      <router-link to="/messages">Messages</router-link>
    </div>
    <div v-if="isLogin()">
      <Chara />
    </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import Chara from '@/components/Chara.vue'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext } from '@vue/composition-api'
import Account from '@/store/Account'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'

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

    return {
      isLogin
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
