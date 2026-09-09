import has from '@/helpers/validations/validator/has'
/**
 * @param obj - Valor
 * @param key - Nome da propriedade que deseja capturar o valor dentro de `obj`
 * @param default_value - Valor padrão de retorno caso não encontre o valor dentro de `obj[key]`
 * @returns `obj[key]`
 * @example
 * const result = getPropertyValue({ name: 'John', age: 23 }, 'name', null)
 * => 'John'
 *
 * @example
 * const result = getPropertyValue({}, 'name', null)
 * => null
 */
export default function <T = unknown>(obj: T, key: string, default_value: unknown) {
  return has(obj, key) ? obj[key] : default_value
}
