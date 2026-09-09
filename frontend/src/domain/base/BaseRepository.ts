import type { AxiosPromise } from 'axios'
import type BaseRepositoryInterface from '@/domain/base/types/BaseRepositoryInterface'
import BaseModel from '@/domain/base/BaseModel'
import BaseHttpClientService from '@/domain/base/BaseHttpClientService'
import type HttpGetIndexResInterface from '@/domain/base/types/res/HttpGetIndexResInterface'
import type HttpGetIndexParamsInterface from '@/domain/base/types/req/methods/get/index/ParamsInterface'
import type HttpGetShowResponseInterface from '@/domain/base/types/res/HttpGetShowResInterface'
import type HttpPostStoreResInterface from '@/domain/base/types/res/HttpPostStoreResInterface'
import type HttpPutUpdateResInterface from '@/domain/base/types/res/HttpPutUpdateResInterface'
import type { HttpDeleteDestroyResType } from '@/domain/base/types/res/HttpDeleteDestroyResType'

export default abstract class BaseRepository implements BaseRepositoryInterface {
  protected abstract _model: BaseModel
  protected _httpClient: BaseHttpClientService

  public constructor() {
    this._httpClient = new BaseHttpClientService()
  }

  index<T>({
    filter,
    config,
  }: HttpGetIndexParamsInterface): AxiosPromise<HttpGetIndexResInterface<T>> {
    const url = filter ? `${this._model.name}/${filter}` : `${this._model.name}`
    return this._httpClient.getBackClient().get(url, config)
  }

  show<T>(id: number | bigint | string): AxiosPromise<HttpGetShowResponseInterface<T>> {
    return this._httpClient.getBackClient().get(`/${this._model.name}/${id}`)
  }

  store<T_D = Object | FormData | File, T_R = unknown>(
    data: T_D,
  ): AxiosPromise<HttpPostStoreResInterface<T_R>> {
    if (data instanceof FormData) {
      return this._httpClient.getBackClient().post(`/${this._model.name}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Access-Control-Allow-Origin': import.meta.env.VITE_BASE_URL,
        },
        withCredentials: true,
      })
    } else {
      return this._httpClient.getBackClient().post(`/${this._model.name}`, data)
    }
  }

  update<T_D = Object | FormData | File, T_R = unknown>(
    id: number | bigint | string,
    data: T_D,
  ): AxiosPromise<HttpPutUpdateResInterface<T_R>> {
    return this._httpClient.getBackClient().put(`/${this._model.name}/${id}`, data)
  }

  destroy(id: number | bigint | string): AxiosPromise<HttpDeleteDestroyResType> {
    return this._httpClient.getBackClient().delete(`/${this._model.name}/${id}`)
  }
}
