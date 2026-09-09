import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { HttpStatusCode, type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

import AuthService from '@/domain/auth/AuthService'
import type AuthSignupReqInterface from '@/domain/auth/types/req/AuthSignupReqInterface'
import type { AuthSignupResType } from '@/domain/auth/types/res/AuthSignupResType'
import type AuthSigninReqInterface from '@/domain/auth/types/req/AuthSigninReqInterface'
import type { AuthSigninResType } from '@/domain/auth/types/res/AuthSigninResType'
import { useUserStore } from '@/stores/user'
import has from '@/helpers/validations/validator/has'
import getPropertyValue from '@/helpers/formatters/getPropertyValue'
import type UserMeResInterface from '@/domain/user/types/res/UserMeResInterface'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: useLocalStorage<string | null>('AUTH_TOKEN', null),
  }),

  actions: {
    async actSignup(payload: AuthSignupReqInterface): Promise<AuthSignupResType> {
      const AUTH_SERVICE = new AuthService()

      try {
        const { data } = await AUTH_SERVICE.signup(payload)
        this.token = data.accessToken || null
        return data
      } catch (err) {
        throw err
      }
    },

    async actSignin(payload: AuthSigninReqInterface): Promise<AuthSigninResType> {
      const AUTH_SERVICE = new AuthService()

      try {
        const { data } = await AUTH_SERVICE.signin(payload)
        this.token = data.accessToken || null
        return data
      } catch (err) {
        throw err
      }
    },

    actVerifyAuthentication(axios: AxiosInstance) {
      axios.interceptors.response.use(
        (response) => {
          this.actVerifyAndSetUser(response)
          return response
        },
        (error: AxiosError) => {
          const { response } = error
          const { statusCode, message } = response?.data as unknown as {
            statusCode?: number
            message?: string
          }
          if (
            response?.status === HttpStatusCode.Unauthorized ||
            (statusCode &&
              message &&
              statusCode === HttpStatusCode.NotFound &&
              message === 'User not found')
          )
            this.$reset()
          return Promise.reject(error)
        },
      )
    },

    actVerifyAndSetUser({ data }: AxiosResponse): void {
      if (!has(data, 'me')) return
      const userStore = useUserStore()
      userStore.user = getPropertyValue(data, 'me', null) as UserMeResInterface['me'] | null
    },

    $reset(): void {
      this.token = null

      const userStore = useUserStore()
      userStore.$reset()

      location.reload()
    },
  },
})
