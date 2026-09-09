import type { AxiosPromise } from 'axios'
import type HttpGetIndexResInterface from '@/domain/base/types/res/HttpGetIndexResInterface'
import type HttpGetIndexParamsInterface from '@/domain/base/types/req/methods/get/index/ParamsInterface'
import type HttpGetShowResInterface from '@/domain/base/types/res/HttpGetShowResInterface'
import type HttpPostStoreResInterface from '@/domain/base/types/res/HttpPostStoreResInterface'
import type HttpPutUpdateResInterface from '@/domain/base/types/res/HttpPutUpdateResInterface'
import type { HttpDeleteDestroyResType } from '@/domain/base/types/res/HttpDeleteDestroyResType'

export default interface BaseRepositoryInterface {
  /**
   * @template T - O tipo da resposta em `data` retornado.
   * @param {string} [options.filter] - Filtro opcional para a requisição.
   * @param {AxiosRequestConfig} [options.config] - Configuração opcional para a requisição Axios.
   * @returns {AxiosPromise<HttpGetIndexResInterface<T>>} - Uma promessa contendo a resposta da requisição.
   */
  index<T>(options: HttpGetIndexParamsInterface): AxiosPromise<HttpGetIndexResInterface<T>>

  /**
   * @template T - O tipo da resposta em `data` retornado.
   * @param {number | bigint | string} id - O ID do dado a ser buscado.
   * @returns {AxiosPromise<HttpGetShowResInterface<T>>} - Uma promessa contendo a resposta da requisição.
   */
  show<T>(id: number | bigint | string): AxiosPromise<HttpGetShowResInterface<T>>

  /**
   * @template T_D - O tipo do objeto `data` passado no parâmetro.
   * @template T_R - O tipo da resposta em `data` retornado.
   * @param {T_D} data - O objeto de dados a ser enviado.
   * @returns {AxiosPromise<HttpPostStoreResInterface<T_R>>} - Uma promessa contendo a resposta da requisição.
   */
  store<T_D = Object | File | FormData, T_R = unknown>(
    data: T_D,
  ): AxiosPromise<HttpPostStoreResInterface<T_R>>

  /**
   * @template T_D - O tipo do objeto `data` passado no parâmetro.
   * @template T_R - O tipo da resposta em `data` retornado.
   * @param {number | bigint | string} id - O ID do dado a ser atualizado.
   * @param {T_D} data - O objeto de dados para atualização.
   * @returns {AxiosPromise<HttpPutUpdateResInterface<T_R>>} - Uma promessa contendo a resposta da requisição.
   */
  update<T_D = Object | File | FormData, T_R = unknown>(
    id: number | bigint | string,
    data: T_D,
  ): AxiosPromise<HttpPutUpdateResInterface<T_R>>

  /**
   * @param {number | bigint | string} id - O ID do dado a ser removido.
   * @returns {AxiosPromise<HttpDeleteDestroyResType>} - Uma promessa contendo a resposta da requisição.
   */
  destroy(id: number | bigint | string): AxiosPromise<HttpDeleteDestroyResType>
}
