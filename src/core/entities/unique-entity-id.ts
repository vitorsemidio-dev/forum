import { randomUUID } from 'node:crypto'

export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  toString() {
    return this._value
  }

  toValue() {
    return this._value
  }

  equals(id: UniqueEntityId): boolean {
    if (id == null || id == undefined) {
      return false
    }

    if (this === id) {
      return true
    }

    return this._value === id._value
  }
}
