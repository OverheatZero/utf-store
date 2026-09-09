import type { AxiosPromise } from 'axios'
import BaseRepository from '@/domain/base/BaseRepository'
import AuthModel from '@/domain/auth/AuthModel'
import type AuthSigninReqInterface from '@/domain/auth/types/req/AuthSigninReqInterface'
import type { AuthSigninResType } from '@/domain/auth/types/res/AuthSigninResType'
import type AuthSignupReqInterface from '@/domain/auth/types/req/AuthSignupReqInterface'
import type { AuthSignupResType } from '@/domain/auth/types/res/AuthSignupResType'

export default class AuthRepository extends BaseRepository {
  protected _model = new AuthModel()

  signin(data: AuthSigninReqInterface): AxiosPromise<AuthSigninResType> {
    return this._httpClient.getBackClient().post(`/${this._model.name}/signin`, data)
  }

  signup(data: AuthSignupReqInterface): AxiosPromise<AuthSignupResType> {
    return this._httpClient.getBackClient().post(`/${this._model.name}/signup`, data)
  }
}
