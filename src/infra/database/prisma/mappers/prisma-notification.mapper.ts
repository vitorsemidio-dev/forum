import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { Prisma, Notification as PrismaNotification } from '@prisma/client'

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        content: raw.content,
        recipientId: new UniqueEntityId(raw.recipientId),
        title: raw.title,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      content: notification.content,
      recipientId: notification.recipientId.toString(),
      title: notification.title,
      id: notification.id.toString(),
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    }
  }
}
