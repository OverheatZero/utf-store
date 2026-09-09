import isObject from '@/helpers/validations/validator/isObject'

type ObjectWithKey<T, K extends string> = T & { [key in K]: unknown }
export default function <T extends object, K extends string>(
  object: unknown,
  key: string,
): object is ObjectWithKey<T, K> {
  return isObject(object) && object?.hasOwnProperty(key)
}
