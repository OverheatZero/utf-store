import type { UserRoleType } from '@/domain/user/types/UserRoleType'

export default interface UserFindAllResInterface {
  id: string
  name: string
  email: string
  role: UserRoleType
  course: string
  campus: string
  avatarUrl: string
  bio: string
  defaultUserPrompt: string
  createdAt: string
  isVerified: boolean
}
