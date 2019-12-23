<template>
  <div class="login">
    <div class="modal">
      <div class="modal__header">ログイン<router-link to="/">×</router-link></div>
      <div class="modal__in">
        <div class="form-group mt-0">
          <label for="mastodon_url" class="col-form-label">マストドンのURLを入力してログインしてね:</label>
          <input type="text" v-model="state.mastodonUrl" class="form-control" id="mastodon_url" placeholder="https://gingadon.com">
        </div>

        <div class="form-group">
          <input type="button" value="ログイン" v-on:click="login" class="form-control btn btn-danger">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'

export default {
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      mastodonUrl: process.env.VUE_APP_MASTODON_ORIGIN,
      store: context.root.$store
    })

    function account (): Account {
      return getModule(Account, state.store)
    }

    async function login () {
      await account().login(state.mastodonUrl)
    }

    // returnするのは外部から呼び出すものだけ（privateで呼び出すのは渡さなくていい）
    return {
      state,
      login
    }
  }
}
</script>

<style lang="scss">
  .login {
    padding: 30px;
  }
</style>
