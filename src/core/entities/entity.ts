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

  equals(object?: Entity<T>): boolean {
    if (object == null || object == undefined) {
      return false
    }

    if (this === object) {
      return true
    }

    if (!Entity.isEntity(object)) {
      return false
    }

    return this.id.toString() === object.id.toString()
  }

  static isEntity(object: any) {
    return object instanceof Entity
  }

  abstract toJson(): any
}
