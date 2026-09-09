import type { RouteRecordRaw } from 'vue-router'

const PublicAuthView = () => import('@/views/PublicView/Auth/index.vue')

export default [
  {
    path: 'auth',
    name: 'public.auth',
    component: PublicAuthView,
    children: [
      {
        path: 'signin',
        name: 'public.auth.signin',
        component: () => import('@/views/PublicView/Auth/Signin/index.vue'),
      },

      /**
       * NOTE: Tirando rota de cadastro, pois não é necessário para o MVP na WEB.
       * Caso seja necessário, descomentar o trecho abaixo e adicionar o botão "Cadastrar" na tela de login.
       */
      // {
      //   path: 'signup',
      //   name: 'public.auth.signup',
      //   component: () => import('@/views/PublicView/Auth/Signup/index.vue'),
      // },
    ],
  },
] as Array<RouteRecordRaw>
