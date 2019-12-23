import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import axios from 'axios'
import Account from '@/store/Account'
import Vue from 'vue'

@Module({ name: 'Friends', namespaced: true, stateFactory: true })
export default class Friends extends VuexModule {
  public friends: Array<Object> = []

  get account (): Account {
    return getModule(Account, Vue.prototype.$store)
  }

  @Mutation
  setFriends (friends: Array<Object>) {
    this.friends = friends
  }

  @Action({})
  async fetchFriends () {
    const response = await axios.get(`${this.account.mastodonUrl}/api/v1/accounts/${this.account.accountInfo.id}/followers`, {
      params: { limit: 200 },
      headers: { 'Authorization': `Bearer ${this.account.token}` }
    })
    this.setFriends(response.data)
  }
}
