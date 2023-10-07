import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

export function makeInMemoryNotificationRepository() {
  const { inMemoryNotificationsRepository } =
    makeInMemoryNotificationRepositoryWithDependencies()
  return inMemoryNotificationsRepository
}

export function makeInMemoryNotificationRepositoryWithDependencies() {
  const inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
  return {
    inMemoryNotificationsRepository,
  }
}
