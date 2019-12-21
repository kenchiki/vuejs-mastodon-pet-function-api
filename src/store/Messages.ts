import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import Vue from 'vue'
import axios from 'axios'
import Account from '@/store/Account'

@Module({ name: 'Messages', namespaced: true, stateFactory: true })
export default class Messages extends VuexModule {
  public timeline: Array<Object> | null = null

  get account (): Account {
    return getModule(Account, Vue.prototype.$store)
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
