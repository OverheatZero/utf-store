import type { RouteRecordRaw } from 'vue-router'

export default [
  {
    path: 'listings',
    name: 'client.listings',
    component: () => import('@/views/PrivateView/Listings/listingView.vue'),
  },
] as Array<RouteRecordRaw>
