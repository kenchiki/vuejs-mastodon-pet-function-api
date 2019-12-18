<template>
  <div>
  </div>
</template>

<script lang="ts">
import Account from '@/store/Account'
import { getModule } from 'vuex-module-decorators'
import { onActivated, onMounted, reactive, ref, computed, SetupContext } from '@vue/composition-api'
import router from '@/router'
import { useStore } from '@/provide'

export default {
  setup (props: {}, context: SetupContext) {
    redirect()

    async function redirect (): Promise<any> {
      const store = useStore()
      alert('aa')
      alert(store)
      // await account().fetchToken(router.query.code as string)
      // await router.push({ name: 'home' })

      // await account().fetchToken(context.root.$test.query.code as string)
      // await this.$router.push({ name: 'home' })
    }

    function account (): Account {
      return getModule(Account, context.root.$store)
    }
  }
}
</script>
