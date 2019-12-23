<template>
  <div class="messages">
    <div class="modal" v-if="timeline().length">
      <div class="modal__header">みんなからのお手紙<router-link to="/">×</router-link></div>
      <div class="modal__in">
        <div class="letters">
          <ul class="letters__items">
            <li v-for="message in timeline()" v-bind:key="message.id" class="letters__item">
              <div class="letters__letter">
                <p class="letters__message"><span v-html="pickMessage(message)"></span></p>
                <p class="letters__friend">{{ pickFriendName(message) }} さんより</p>
                <p class="letters__friend">{{ pickCreatedAt(message) }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Letter from '@/store/Letter'
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
      content = content.replace(/<\/p><p>/, '\n\n')
      content = content.replace(/(<br>|<br \/>)/g, '\n')
      content = content.replace(/<.+?>/g, '')
      content = content.replace(/\n/g, '<br>')

      return content
    }

    // eslint-disable-next-line camelcase
    function pickFriendName (message: { last_status: { account: object; } }): string {
      // eslint-disable-next-line camelcase
      const account: { display_name?: string; username?: string; } = message.last_status.account
      return account.display_name !== '' ? account.display_name! : account.username!
    }

    // eslint-disable-next-line camelcase
    function pickCreatedAt (message: { last_status: { created_at: string; }; }): string {
      // eslint-disable-next-line camelcase
      const lastStatus: { created_at: string; } = message.last_status
      const d = new Date(lastStatus.created_at!)
      return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes()}`
    }

    function timeline () {
      return letter().timeline
    }

    async function fetchLetters () {
      await letter().fetchLetters()
    }

    function letter (): Letter {
      return getModule(Letter, state.store)
    }

    fetchLetters()

    // returnするのは外部から呼び出すものだけ（privateで呼び出すのは渡さなくていい）
    return {
      state,
      timeline,
      pickMessage,
      pickFriendName,
      pickCreatedAt
    }
  }
}
</script>

<style lang="scss">
  .letters {
    &__items {
      font-size: 1.2rem;
    }
    &__item {
      margin-top: 20px;
      &:first-child {
        margin-top: 0;
      }
    }
    &__letter {
      border: 2px solid #FEEA61;
      background: #FEFF88;
      color: #333;
      padding: 10px;
    }
    &__friend {
      text-align: right;
    }
  }
</style>
