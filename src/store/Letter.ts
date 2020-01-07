import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Account from '@/store/Account'
import Pet from '@/store/Pet'
import Vue from 'vue'
import { AccountInfo, TootInfo } from '@/interface'

@Module({ name: 'Letter', namespaced: true, stateFactory: true })
export default class Letter extends VuexModule {
  public list: Array<TootInfo> = []
  public error: Error | null = null
  private to: string | null = null
  private body: string | null = null

  get account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  get pet (): Pet {
    return getModule(Pet, Vue.prototype.$store)
  }

  get receivedLetters (): Array<TootInfo> {
    return this.list.filter((letter: TootInfo) => {
      return letter.last_status.account.id !== this.myAccountId
    })
  }

  get sentLetters (): Array<Object> {
    return this.list.filter((letter: TootInfo) => {
      return letter.last_status.account.id === this.myAccountId
    })
  }

  get myAccountId (): string {
    return (this.account.account as AccountInfo).id
  }

  @Mutation
  setLetter ({ to, body }: {to: string, body: string}) {
    this.to = to
    this.body = body
  }

  @Mutation
  setError (error: Error | null) {
    this.error = error
  }

  @Mutation
  setTimeline (list: Array<TootInfo>) {
    this.list = list
  }

  @Action({})
  async fetchLetters () {
    const response = await axios.get(`${this.account.mastodonUrl}/api/v1/conversations`, {
      params: { limit: 10 },
      headers: { 'Authorization': `Bearer ${this.account.token}` }
    })
    this.setTimeline(response.data)
  }

  @Action({})
  async send () {
    const postParams = {
      visibility: 'direct',
      status: `${this.to} ${this.body}`
    }

    try {
      const response = await axios.post(
        `${this.account.mastodonUrl}/api/v1/statuses`,
        postParams,
        {
          headers: { 'Authorization': `Bearer ${this.account.token}` }
        }
      )
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }
}
