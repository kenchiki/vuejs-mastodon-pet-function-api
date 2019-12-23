import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Account from '@/store/Account'
import { useStore } from '@/storeProvide'

@Module({ name: 'Letters', namespaced: true, stateFactory: true })
export default class Letters extends VuexModule {
  public timeline: Array<Object> | null = null

  get account (): Account {
    const store: any = useStore()
    return getModule(Account, store)
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
}
