import type { AxiosPromise } from 'axios'

import ListingRepository from '@/domain/listing/ListingRepository'
import type ListingFindAllResInterface from '@/domain/listing/types/res/ListingFindAllResInterface'
import type ListingFindOneResInterface from '@/domain/listing/types/res/ListingFindOneResInterface'

export default class ListingService {
  constructor(private _repository: ListingRepository = new ListingRepository()) {}

  findAll(): AxiosPromise<ListingFindAllResInterface> {
    return this._repository.findAll()
  }

  findOne(id: string): AxiosPromise<ListingFindOneResInterface> {
    return this._repository.findOne(id)
  }

  delete(id: string): AxiosPromise {
    return this._repository.delete(id)
  }
}
