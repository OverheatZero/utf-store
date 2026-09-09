export default interface UserMeResInterface {
  me: {
    id: string
    name: string
    email: string
    course: string
    campus: string
    avatarUrl: string
    bio: string
    isVerified: boolean
  }
}
