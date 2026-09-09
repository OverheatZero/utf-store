export default interface ListingSellerInterface {
  id: string
  name: string
  email: string
  course: string
  campus: string
  avatarUrl: string | null
  bio: string
  isVerified: boolean
  createdAt: string
  updatedAt: string
}
