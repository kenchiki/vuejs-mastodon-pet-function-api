<template>
  <div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import { getModule } from 'vuex-module-decorators'
import { reactive, SetupContext } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'

export default {
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store,
      route: context.root.$route,
      router: context.root.$router
    })

    async function redirect () {
      await account().fetchToken(state.route.query.code as string)
      await state.router.push({ name: 'home' })
    }

    function account (): Account {
      return getModule(Account, state.store)
    }

    redirect()

    return {}
  }
}
</script>
