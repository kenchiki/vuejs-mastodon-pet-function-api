import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import qs from 'qs'
import axios from 'axios'

interface AccountInfo {
  id: string;
  url: string;
}

@Module({ name: 'Account', namespaced: true, stateFactory: true })
export default class Account extends VuexModule {
  public error: Error | null = null
  private localStorage: Storage = localStorage
  private sessionStorage: Storage = sessionStorage
  private clientId: string | null = null
  private clientSecret: string | null = null
  public token: string | null = null
  public mastodonUrl: string | null = null
  // title, urls.streaming_api
  public instance: object | null = null
  // display_name, id
  public account: object | null = null

  // client、tokenどちらを取得する際も同一のものを指定する必要あり（認証のところで無効と表示されてしまうため）
  static readonly API_SCOPE: string = 'read write';
  static readonly APP_NAME: string = '銀河ペット';

  get isLogin (): boolean {
    return this.token !== null
  }

  get accountInfo (): AccountInfo {
    return this.account as AccountInfo
  }

  @Mutation
  setError (error: Error | null) {
    this.error = error
  }

  @Mutation
  restoreFromStorage () {
    this.token = this.localStorage.getItem('token')!
    this.mastodonUrl = this.localStorage.getItem('mastodon_url')!
    this.clientId = this.localStorage.getItem('client_id')!
    this.clientSecret = this.localStorage.getItem('client_secret')!
    this.instance = JSON.parse(this.localStorage.getItem('instance')!)
    this.account = JSON.parse(this.localStorage.getItem('account')!)
  }

  @Action({})
  async login (mastodonUrl: string) {
    this.setStorage({ key: 'mastodon_url', value: mastodonUrl })
    await this.fetchClient()
    this.fetchCode()
  }

  // mastodonからclient_idとclient_secret取得
  @Action({})
  async fetchClient () {
    const postParams = {
      client_name: Account.APP_NAME,
      redirect_uris: Account.REDIRECT_URI(),
      scopes: Account.API_SCOPE
    }

    try {
      const response = await axios.post(
        `${this.mastodonUrl}/api/v1/apps`,
        postParams
      )
      this.setStorage({ key: 'client_id', value: response.data.client_id })
      this.setStorage({ key: 'client_secret', value: response.data.client_secret })
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }

  @Action({})
  setStorage ({ key, value }: { key: string, value: string }) {
    this.localStorage.setItem(key, value)
    this.restoreFromStorage()
  }

  // mastodonに認証してcode取得
  @Action({})
  fetchCode () {
    const getParams = {
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: Account.REDIRECT_URI(),
      scope: Account.API_SCOPE
    }

    // https://docs.joinmastodon.org/api/authentication/#get-oauth-authorize
    const authUrl = new URL(`${this.mastodonUrl}/oauth/authorize`)
    authUrl.search = qs.stringify(getParams)
    document.location.href = authUrl.href
  }

  // codeからtoken取得
  @Action({})
  async fetchToken (code: string | undefined) {
    const postParams = {
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: Account.REDIRECT_URI()
    }

    try {
      const response = await axios.post(`${this.mastodonUrl}/oauth/token`, postParams)
      this.setStorage({ key: 'token', value: response.data.access_token })
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }

    await this.fetchInstance()
    await this.fetchAccount()
  }

  // サーバー情報取得
  @Action({})
  async fetchInstance () {
    try {
      const response = await axios.get(`${this.mastodonUrl}/api/v1/instance`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      this.setStorage({ key: 'instance', value: JSON.stringify(response.data) })
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }

  // アカウント情報取得
  @Action({})
  async fetchAccount () {
    try {
      const response = await axios.get(`${this.mastodonUrl}/api/v1/accounts/verify_credentials`, {
        headers: { Authorization: `Bearer ${this.token}` }
      })
      this.setStorage({ key: 'account', value: JSON.stringify(response.data) })
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }

  @Action({})
  clearStorage () {
    this.localStorage.clear()
    this.restoreFromStorage()
  }

  @Action({})
  init () {
    this.restoreFromStorage()
  }

  static REDIRECT_URI (): string {
    if (process.env.NODE_ENV === 'production') return `https://${process.env.VUE_APP_DOMAIN}`
    return `http://${process.env.VUE_APP_DOMAIN}:${process.env.VUE_APP_PORT}/oauth_callback`
  }
}
