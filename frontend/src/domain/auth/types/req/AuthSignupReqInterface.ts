export default interface AuthSignupReqInterface {
  name: string
  email: string
  password: string
  course: string
  campus: string
  avatarUrl: string
  bio: string
  isVerified?: boolean
}
