import type BaseHttpResInterface from '@/domain/base/types/res/BaseHttpResInterface'

export default interface HttpPostStoreResInterface<T = unknown> extends BaseHttpResInterface {
  data: T
}
