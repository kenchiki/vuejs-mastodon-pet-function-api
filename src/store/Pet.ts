import { Module, VuexModule, Mutation, Action, getModule } from 'vuex-module-decorators'
import _Pet from '@/Pet'
import { Status } from '@/interface'

@Module({ name: 'Pet', namespaced: true, stateFactory: true })
export default class Pet extends VuexModule {
  private pet: _Pet = new _Pet();

  get message (): string {
    return this.pet.message()
  }

  get status (): Status {
    return this.pet.status
  }

  @Action({})
  init () {
    this.pet.init()
  }

  @Action({})
  delivery () {
    this.pet.setDelivery()
  }
}
