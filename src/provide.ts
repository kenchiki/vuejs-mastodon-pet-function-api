import { inject, provide } from '@vue/composition-api'

const StoreSymbol = Symbol('provide')

export function provideStore (store: any) {
  provide(StoreSymbol, store)
}

export function useStore () {
  const store = inject(StoreSymbol)
  if (!store) {
    // throw error, no store provided
  }
  return store
}
