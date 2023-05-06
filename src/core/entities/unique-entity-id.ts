import { randomUUID } from 'crypto';

export class UniqueEntityId {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  toString() {
    return this._value;
  }

  toValue() {
    return this._value;
  }
}
