import { makeNotification } from 'test/factories/make-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'

const makeSut = () => {
  const inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
  const sut = new SendNotificationUseCase(inMemoryNotificationsRepository)
  return {
    sut,
    inMemoryNotificationsRepository,
  }
}

describe('Send Notification', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sut: SendNotificationUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryNotificationsRepository =
      dependencies.inMemoryNotificationsRepository
    sut = dependencies.sut
  })

  it('send a notification', async () => {
    const input = makeNotification()
    const result = await sut.execute({
      recipientId: input.recipientId.toString(),
      content: input.content,
      title: input.title,
    })

    const notification = inMemoryNotificationsRepository.items[0]

    expect(result.isRight()).toBe(true)
    expect(notification).toBe(result.value?.notification)
  })
})
