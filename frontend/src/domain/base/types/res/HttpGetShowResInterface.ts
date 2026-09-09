import type BaseHttpResInterface from '@/domain/base/types/res/BaseHttpResInterface'

export default interface HttpGetShowResponseInterface<T = unknown> extends BaseHttpResInterface {
  data: T
}
