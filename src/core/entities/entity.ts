import { UniqueEntityId } from './unique-entity-id';

export class Entity<T = any> {
  private _id: UniqueEntityId;
  protected props: T;

  get id() {
    return this._id;
  }

  protected constructor(props: T, id?: string) {
    this.props = props;
    this._id = new UniqueEntityId(id);
  }
}
