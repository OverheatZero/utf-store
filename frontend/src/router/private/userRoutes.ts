import type { RouteRecordRaw } from 'vue-router'
import PrivateUsers from '@/views/PrivateView/Users/index.vue'

export default [
  {
    path: 'users',
    name: 'private.users',
    component: PrivateUsers,
  },
] as Array<RouteRecordRaw>
