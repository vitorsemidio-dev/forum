import { Notification } from '@/domain/notification/enterprise/entities/notification'

export interface NotificationsRepository {
  create(notification: Notification): Promise<void>
}
