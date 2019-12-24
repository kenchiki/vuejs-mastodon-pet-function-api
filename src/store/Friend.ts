import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Account from '@/store/Account'
import Vue from 'vue'
import { AccountInfo } from '@/interface'

@Module({ name: 'Friend', namespaced: true, stateFactory: true })
export default class Friend extends VuexModule {
  public follows: Array<Object> = []

  get account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  @Mutation
  setFriends (follows: Array<Object>) {
    this.follows = follows
  }

  @Action({})
  async fetchFollows () {
    const response = await axios.get(`${this.account.mastodonUrl}/api/v1/accounts/${(this.account.account as AccountInfo).id}/followers`, {
      params: { limit: 200 },
      headers: { 'Authorization': `Bearer ${this.account.token}` }
    })
    this.setFriends(response.data)
  }
}
