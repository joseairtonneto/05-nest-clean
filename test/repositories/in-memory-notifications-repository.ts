import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = []

  async findMany({ page }: PaginationParams) {
    const notifications = this.items.slice((page - 1) * 20, page * 20)

    return notifications
  }

  async findById(id: string) {
    const notification = this.items.find((item) => item.id.toString() === id)

    return notification ?? null
  }

  async create(notification: Notification) {
    this.items.push(notification)
  }

  async save(notification: Notification) {
    const itemIndex = this.items.findIndex((item) => item.id === notification.id)

    this.items[itemIndex] = notification
  }
}
