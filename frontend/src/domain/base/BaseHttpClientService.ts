import axios, { type AxiosInstance, type CreateAxiosDefaults } from 'axios'
import { useAuthStore } from '@/stores/auth'

export default class BaseHttpClientService {
  protected _store

  constructor() {
    this._store = useAuthStore()
  }

  public getHttpClient(config: CreateAxiosDefaults = {}): AxiosInstance {
    return axios.create(config)
  }

  public getBackClient(): AxiosInstance {
    return this.getClient(import.meta.env.VITE_API_URL, this._store.token || '')
  }

  private getClient(baseURL: string, token: string): AxiosInstance {
    const config: CreateAxiosDefaults = {
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ambient: 'client',
      },
    }

    const httpClient = this.getHttpClient(config)
    this._store.actVerifyAuthentication(httpClient)
    return httpClient
  }
}
