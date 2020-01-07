<template>
  <div class="login">
    <div class="modal">
      <div class="modal__header">お手紙をかく<router-link to="/">×</router-link></div>
      <div class="modal__in">
        <div class="form-group mt-0">
          <label for="to" class="col-form-label">宛先:</label>
          <input type="text" v-model="state.to" class="form-control" id="to" autocomplete="on" list="friends">
          <datalist id="friends">
            <option v-for="friend in follows()" v-bind:key="friend.id">{{ pickToLabel(friend) }}</option>
          </datalist>
        </div>

        <div class="form-group mt-0">
          <label for="body" class="col-form-label">お手紙の内容:</label>
          <textarea v-model="state.body" class="form-control" id="body" rows="5"></textarea>
        </div>

        <div class="form-group">
          <input type="button" value="送る" v-on:click="write" class="form-control btn btn-danger">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import Friend from '@/store/Friend'
import Letter from '@/store/Letter'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext, watch, onMounted } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'
import { AccountInfo } from '@/interface'
import Pet from '@/store/Pet'

export default {
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      to: '',
      body: '',
      store: context.root.$store,
      router: context.root.$router
    })

    function pickToLabel (friend: AccountInfo): string {
      const name = Account.pickName(friend)
      const url = new URL(friend.url)
      return `${name}<@${friend.username}@${url.host}>`
    }

    function account (): Account {
      return getModule(Account, state.store)
    }

    function friend (): Friend {
      return getModule(Friend, state.store)
    }

    function pet (): Pet {
      return getModule(Pet, state.store)
    }

    function letters (): Letter {
      return getModule(Letter, state.store)
    }

    function write () {
      letters().setLetter({ to: pickTo(state.to), body: state.body })
      pet().delivery()
      state.router.push({ name: 'home' })
    }

    function pickTo (toLabel: string): string {
      const to: Array<string> | null = toLabel.match(/<@([^@]+)@([^@]+)>/)
      if (to === null) return ''

      const accountHost = new URL(account().url).host
      return accountHost === to[2] ? `@${to[1]}` : `@${to[1]}@${to[2]}`
    }

    function follows () {
      return friend().follows
    }

    async function fetchFriendList () {
      await friend().fetchFollows()
    }

    onMounted(() => {
      fetchFriendList()
    })

    // returnするのは外部から呼び出すものだけ（privateで呼び出すのは渡さなくていい）
    return {
      state,
      write,
      follows,
      pickToLabel
    }
  }
}
</script>

<style lang="scss">
  .login {
    padding: 30px;
  }
</style>
