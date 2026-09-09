import type ListingSellerInterface from '@/domain/listing/types/ListingSellerInterface'
import type ListingCategoryInterface from '@/domain/listing/types/ListingCategoryInterface'
import type ListingImageInterface from '@/domain/listing/types/ListingImageInterface'

export default interface ListingInterface {
  id: string
  sellerId: string
  categoryId: string
  title: string
  description: string | null
  price: string
  condition: string
  type: string
  status: string
  location: string | null
  viewsCount: number
  createdAt: string
  updatedAt: string
  seller: ListingSellerInterface
  category: ListingCategoryInterface
  images: ListingImageInterface[]
}
