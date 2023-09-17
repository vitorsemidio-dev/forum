import { Entity } from '@/core/entities/entity'
import { DomainEvents } from '../events/domain-events'
import { DomainEvent } from './../events/domain-event'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []

  get domainEvents() {
    return this._domainEvents
  }

  protected addDomainEvent(domainEvent: DomainEvent) {
    this._domainEvents.push(domainEvent)
    DomainEvents.markAggregateForDispatch(this)
  }

  public clearEvents() {
    this._domainEvents.splice(0, this._domainEvents.length)
  }
}
