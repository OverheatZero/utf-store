import type { AxiosPromise } from 'axios'
import BaseRepository from '@/domain/base/BaseRepository'
import ListingModel from '@/domain/listing/ListingModel'
import type ListingFindAllResInterface from '@/domain/listing/types/res/ListingFindAllResInterface'
import type ListingFindOneResInterface from '@/domain/listing/types/res/ListingFindOneResInterface'

export default class ListingRepository extends BaseRepository {
  protected _model = new ListingModel()

  findAll(): AxiosPromise<ListingFindAllResInterface> {
    return this._httpClient.getBackClient().get(`/${this._model.name}/admin`)
  }

  findOne(id: string): AxiosPromise<ListingFindOneResInterface> {
    return this._httpClient.getBackClient().get(`/${this._model.name}/${id}`)
  }

  delete(id: string): AxiosPromise {
    return this._httpClient.getBackClient().delete(`/${this._model.name}/${id}`)
  }
}
