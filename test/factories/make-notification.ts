import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Notification,
  NotificationProps,
} from '@/domain/notification/enterprise/entities/notification'
import { fakerPtBr } from 'test/utils/faker'

export function makeNotification(
  override: Partial<NotificationProps> = {},
  id?: UniqueEntityId,
): Notification {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      content: fakerPtBr.lorem.text(),
      title: fakerPtBr.lorem.sentence(),
      ...override,
    },
    id,
  )

  return notification
}
