import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export abstract class Entity<T = any> {
  private _id: UniqueEntityId
  protected props: T

  get id() {
    return this._id
  }

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props
    this._id = id ?? new UniqueEntityId()
  }
}
