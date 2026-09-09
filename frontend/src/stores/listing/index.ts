import { defineStore } from 'pinia'

import ListingService from '@/domain/listing/ListingService'

export const useListingStore = defineStore('listing', {
  actions: {
    async actFindAllListings() {
      const LISTING_SERVICE = new ListingService()

      try {
        const { data } = await LISTING_SERVICE.findAll()
        return data
      } catch (err) {
        throw err
      }
    },

    async actFindOneListing(id: string) {
      const LISTING_SERVICE = new ListingService()

      try {
        const { data } = await LISTING_SERVICE.findOne(id)
        return data
      } catch (err) {
        throw err
      }
    },

    async actDeleteListing(id: string) {
      const LISTING_SERVICE = new ListingService()

      try {
        const { data } = await LISTING_SERVICE.delete(id)
        return data
      } catch (err) {
        throw err
      }
    },
  },
})
