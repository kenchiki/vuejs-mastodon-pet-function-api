<template>
  <div id="app">
    <div id="wrapper">
      <div id="container-row">
        <h1 id="header-logo">銀河ペット ver.1.0</h1>
        <div id="container-col">
          <header id="header">
              <nav class="header-nav">
                <ul class="header-nav__links">
                  <li v-if="!isLogin()"><router-link to="/login">ログイン</router-link></li>
                  <li v-if="isLogin()"><router-link to="/write_letter">お手紙をかく</router-link></li>
                  <li v-if="isLogin()"><router-link to="/received_letters">届いたお手紙</router-link></li>
                  <li v-if="isLogin()"><router-link to="/sent_letters">送ったお手紙</router-link></li>
                  <li><router-link to="/about">説明書</router-link></li>
                  <li v-if="isLogin()"><router-link to="/logout">ログアウト</router-link></li>
                </ul>
              </nav>
          </header>
          <div id="content">
            <div v-if="isLogin()">
              <PetComponent />
            </div>
          </div>
        </div>
        <p id="footer-status"><span v-html="message()"></span></p>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import PetComponent from '@/components/Pet.vue'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext, watch, onMounted } from '@vue/composition-api'
import Account from '@/store/Account'
import Letter from '@/store/Letter'
import Pet from '@/store/Pet'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
import { Status } from '@/interface'

export default {
  components: {
    PetComponent
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

    function pet (): Pet {
      return getModule(Pet, state.store)
    }

    function message (): string {
      return pet().message
    }

    function status (): Status {
      return pet().status
    }

    function letters (): Letter {
      return getModule(Letter, state.store)
    }

    onMounted(() => {
      account().init()
    })

    watch(status, (newVal, oldVal) => {
      if (oldVal === Status.Delivery && newVal === Status.Free) {
        letters().send()
      }
    })

    return {
      state,
      isLogin,
      message
    }
  }
}
</script>

<style lang="scss">
</style>
