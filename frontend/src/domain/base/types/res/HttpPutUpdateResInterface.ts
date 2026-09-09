import type BaseHttpResInterface from '@/domain/base/types/res/BaseHttpResInterface'

export default interface HttpPutUpdateResInterface<T = unknown> extends BaseHttpResInterface {
  data: T
}
