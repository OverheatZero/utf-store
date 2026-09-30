import type { RouteRecordRaw } from 'vue-router'
import PrivateAds from '@/views/PrivateView/Ads/index.vue'

export default [
  {
    path: 'ads',
    name: 'admin.ads',
    component: PrivateAds,
  },
] as Array<RouteRecordRaw>
