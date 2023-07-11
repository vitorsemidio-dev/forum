import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'
import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'

const makeSut = () => {
  const inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
  const sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
  return {
    sut,
    inMemoryNotificationsRepository,
  }
}

describe('Read Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: ReadNotificationUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryNotificationsRepository =
      dependencies.inMemoryNotificationsRepository
    sut = dependencies.sut
  })

  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      notification: {
        readAt: expect.any(Date),
      },
    })
    expect(inMemoryNotificationsRepository.items[0]).toMatchObject({
      readAt: expect.any(Date),
    })
  })

  it('should not be able to read a notification that does not exist', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-id-1'),
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: 'not-found-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityId('recipient-id-1'),
    })
    await inMemoryNotificationsRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'recipient-id-2',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
