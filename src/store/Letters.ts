import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Account from '@/store/Account'
import Vue from 'vue'

@Module({ name: 'Letters', namespaced: true, stateFactory: true })
export default class Letters extends VuexModule {
  public timeline: Array<Object> = []
  public error: Error | null = null

  get account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  @Mutation
  setError (error: Error | null) {
    this.error = error
  }

  @Mutation
  setTimeline (timeline: Array<Object>) {
    this.timeline = timeline
  }

  @Action({})
  async fetchTimeline () {
    const response = await axios.get(`${this.account.mastodonUrl}/api/v1/conversations`, {
      params: { limit: 10 },
      headers: { 'Authorization': `Bearer ${this.account.token}` }
    })
    this.setTimeline(response.data)
  }

  @Action({})
  async create ({ to, body }: {to: string, body: string}) {
    const postParams = {
      visibility: 'direct',
      status: `${to} ${body}`
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
