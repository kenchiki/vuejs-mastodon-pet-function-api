<template>
  <div class="home">
    <ul class="timeline__list" v-if="timeline().length">
      <li v-for="message in timeline()" v-bind:key="message.id" class="timeline__status">
        <p>{{ pickVisitorName(message) }}:{{ pickMessage(message) }}</p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Messages from '@/store/Messages'
import { getModule } from 'vuex-module-decorators'
import { reactive, ref, computed, SetupContext, onMounted } from '@vue/composition-api'
import { UnwrapRef } from '@vue/composition-api/dist/reactivity'

export default {
  setup (props: {}, context: SetupContext) {
    const state: UnwrapRef<any> = reactive({
      store: context.root.$store
    })

    // eslint-disable-next-line camelcase
    function pickMessage (message: { last_status: { content: string; } }): string {
      let content: string = message.last_status.content
      content = content.replace(/<span class="h-card">.+<\/span>/, '')
      content = content.replace(/<.+?>/g, '')
      return content
    }

    // eslint-disable-next-line camelcase
    function pickVisitorName (message: { last_status: { account: object; } }): string {
      // eslint-disable-next-line camelcase
      const account: { display_name?: string; username?: string; } = message.last_status.account
      return account.display_name !== '' ? account.display_name! : account.username!
    }

    function timeline () {
      return messages().timeline || []
    }

    async function fetchTimeline () {
      await messages().fetchTimeline()
    }

    function messages (): Messages {
      return getModule(Messages, state.store)
    }

    fetchTimeline()

    // returnするのは外部から呼び出すものだけ（privateで呼び出すのは渡さなくていい）
    return {
      state,
      timeline,
      pickMessage,
      pickVisitorName
    }
  }
}
</script>
