export default function (value: unknown): value is object {
  return typeof value === 'object'
}
