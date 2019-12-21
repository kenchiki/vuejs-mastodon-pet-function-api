<template>
  <div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import { getModule } from 'vuex-module-decorators'
import { reactive, SetupContext, onMounted } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'

export default {
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store,
      route: context.root.$route,
      router: context.root.$router
    })

    function account (): Account {
      return getModule(Account, state.store)
    }

    onMounted(() => {
      account().clearStorage()
      state.router.push({ name: 'home' })
    })

    return {}
  }
}
</script>
