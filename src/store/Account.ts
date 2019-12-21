import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import qs from 'qs'
import axios from 'axios'

interface ServerResponse {
  data: ServerData
}

interface ServerData {
  // 返ってくるマストドンのAPPのIDはキャメルケースではないので
  // eslint-disable-next-line camelcase
  client_id: string
  // eslint-disable-next-line camelcase
  client_secret: string
}

@Module({ name: 'Account', namespaced: true, stateFactory: true })
export default class Account extends VuexModule {
  public error: Error | null = null
  public localStorage: Storage = localStorage
  public sessionStorage: Storage = sessionStorage
  public token: string | null = null

  // client、tokenどちらを取得する際も同一のものを指定する必要あり（認証のところで無効と表示されてしまうため）
  static readonly API_SCOPE: string = 'read write';
  static readonly APP_NAME: string = '銀河ペット';

  get isLogin (): boolean {
    return this.token !== null
  }

  @Mutation
  setMastodonUrl (mastodonUrl: string) {
    this.sessionStorage.setItem('mastodon_url', mastodonUrl)
  }

  @Mutation
  setError (error: Error | null) {
    this.error = error
  }

  @Mutation
  setToken (token: string) {
    this.token = token
  }

  @Mutation
  setStreamingUrl (streamingUrl: string) {
    this.sessionStorage.setItem('streaming_url', streamingUrl)
  }

  @Mutation
  setInstanceName (instanceName: string) {
    this.sessionStorage.setItem('instance_name', instanceName)
  }

  @Mutation
  setClient (response: ServerResponse) {
    const { data } = response
    this.sessionStorage.setItem('client_id', data.client_id)
    this.sessionStorage.setItem('client_secret', data.client_secret)
  }

  @Action({})
  async login (mastodonUrl: string) {
    this.setMastodonUrl(mastodonUrl)
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

    // https://docs.joinmastodon.org/api/rest/apps/#post-api-v1-apps
    try {
      const response = await axios.post(
        `${this.sessionStorage.getItem('mastodon_url')}/api/v1/apps`,
        postParams
      )
      this.setClient(response)
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }

  // mastodonに認証してcode取得
  @Action({})
  fetchCode () {
    const getParams = {
      response_type: 'code',
      client_id: this.sessionStorage.getItem('client_id'),
      redirect_uri: Account.REDIRECT_URI(),
      scope: Account.API_SCOPE
    }

    // https://docs.joinmastodon.org/api/authentication/#get-oauth-authorize
    const authUrl = new URL(`${this.sessionStorage.getItem('mastodon_url')}/oauth/authorize`)
    authUrl.search = qs.stringify(getParams)
    document.location.href = authUrl.href
  }

  // codeからtoken取得
  @Action({})
  async fetchToken (code: string | undefined) {
    const postParams = {
      client_id: this.sessionStorage.getItem('client_id'),
      client_secret: this.sessionStorage.getItem('client_secret'),
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: Account.REDIRECT_URI()
    }

    try {
      const response = await axios.post(`${this.sessionStorage.getItem('mastodon_url')}/oauth/token`, postParams)
      const token: string = response.data.access_token
      this.sessionStorage.setItem('token', token)
      this.setToken(token)
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }

    await this.fetchInstance()
  }

  // サーバー情報取得
  @Action({})
  async fetchInstance () {
    try {
      const response = await axios.get(`${this.sessionStorage.getItem('mastodon_url')}/api/v1/instance`, {
        headers: { Authorization: `Bearer ${this.sessionStorage.getItem('token')}` }
      })
      this.setStreamingUrl(response.data.urls.streaming_api)
      this.setInstanceName(response.data.title)
      this.setError(null)
    } catch (error) {
      this.setError(error)
    }
  }

  @Action({})
  init () {
    const token: string = this.sessionStorage.getItem('token')!
    this.setToken(token)
  }

  static REDIRECT_URI (): string {
    if (process.env.NODE_ENV === 'production') return `https://${process.env.VUE_APP_DOMAIN}`
    return `http://${process.env.VUE_APP_DOMAIN}:${process.env.VUE_APP_PORT}/oauth_callback`
  }
}
