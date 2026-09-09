import type { AxiosPromise } from 'axios'

import UserRepository, { type FindAllResponse } from '@/domain/user/UserRepository'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

export default class UserService {
  constructor(private _repository: UserRepository = new UserRepository()) {}

  me(): AxiosPromise<UserMeResInterface> {
    return this._repository.me()
  }

  findAll(): AxiosPromise<FindAllResponse> {
    return this._repository.findAll()
  }

  delete(id: string): AxiosPromise {
    return this._repository.delete(id)
  }
}
