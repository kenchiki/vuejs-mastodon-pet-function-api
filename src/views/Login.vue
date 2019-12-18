<template>
  <div class="home">
    <div class="form-group mt-5">
      <label for="mastodon_url" class="col-form-label">Mastodon URL:</label>
      <input type="text" v-model="state.mastodonUrl" class="form-control" id="mastodon_url" placeholder="https://gingadon.com">
    </div>

    <div class="form-group">
      <input type="button" value="ログイン" v-on:click="login" class="form-control btn btn-danger">
    </div>

    <div>
      <p>{{ state.count }}</p>
      <p><input type="button" value="ふやす" v-on:click="increment" class="form-control btn btn-danger"></p>
    </div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
import { useStore } from '@/provide'

export default {
  setup (props: {}, context: SetupContext) {
    // account (): Account {
    //   return getModule(Account, this.$store)
    // }

    const state: UnwrapRef<any> = reactive({
      mastodonUrl: process.env.VUE_APP_MASTODON_ORIGIN,
      count: 1,
      store: useStore(),
      double: computed(() => state.count * 2)
    })

    function account (): Account {
      return getModule(Account, state.store)
    }

    function increment () {
      state.count++
    }

    async function login () {
      await account().login(state.mastodonUrl)
    }

    return {
      state,
      increment,
      login
    }
  }
}
</script>
