export default interface ListingCategoryInterface {
  id: string
  name: string
  slug: string
  iconUrl: string | null
  description: string | null
  parentId: string | null
  createdAt: string
}
