export default interface HttpResPaginateInterface {
  readonly first: number
  readonly prev?: string | null
  readonly next?: string | null
  readonly last: number
  readonly pages: number
  readonly items: number
}
