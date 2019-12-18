// 下記のエラーが発生した
// Argument of type 'VueProxy<{ msg: StringConstructor; }, void>' is not assignable to parameter of type 'FunctionalComponentOptions<Record<string, any>, PropsDefinition<Record<string, any>>>'.

// shallowMountはComponentOptionsを引数として必要とするが、createComponentはVueProxyを返すのでcomposition-apiに切り替えるとテストが失敗する
// 下のURLでは力技で回避しているみたいだが、composition-apiはバージョンアップしていくので待つしかなさそう
// https://github.com/vuejs/composition-api/issues/63

import { shallowMount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders props.msg when passed', () => {
    const msg = 'new message'
    const wrapper = shallowMount(HelloWorld as any, {
      propsData: { msg }
    })
    expect(wrapper.text()).toMatch(msg)
  })
})
