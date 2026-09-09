export default interface ListingImageInterface {
  id: string
  listingId: string
  url: string
  position: number | null
  isCover: boolean
  createdAt: string
}
