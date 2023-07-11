import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found.error'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { Notification } from '@/domain/notification/enterprise/entities/notification'

interface ReadNotificationUseCaseRequest {
  recipientId: string
  notificationId: string
}

type ReadNotificationUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    notification: Notification
  }
>

export class ReadNotificationUseCase {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationRepository.findById(
      notificationId,
    )

    if (!notification) {
      return left(new ResourceNotFoundError('Notification not found.'))
    }

    if (notification.recipientId.toString() !== recipientId) {
      return left(new NotAllowedError('Not Allowed.'))
    }

    notification.read()

    await this.notificationRepository.save(notification)

    return right({
      notification,
    })
  }
}
