import { randomUUID } from 'node:crypto';

export class Entity<T = any> {
  private _id: string;
  protected props: T;

  get id() {
    return this._id;
  }

  protected constructor(props: T, id?: string) {
    this.props = props;
    this._id = id ?? randomUUID();
  }
}
