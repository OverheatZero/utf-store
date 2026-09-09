export default abstract class BaseModel {
  protected abstract _name: string

  get name(): string {
    return this._name
  }
}
