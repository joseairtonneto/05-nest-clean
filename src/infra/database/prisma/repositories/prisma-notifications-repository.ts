import { Notification } from '@/domain/notification/enterprise/entities/notification'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async findMany({ page }: PaginationParams) {
    const notifications = await this.prisma.notification.findMany({
      take: 20,
      skip: (page - 1) * 20,
    })

    return notifications.map(PrismaNotificationMapper.toDomain)
  }

  async findById(id: string) {
    const notification = await this.prisma.notification.findUnique({ where: { id } })

    if (!notification) return null

    return PrismaNotificationMapper.toDomain(notification)
  }

  async create(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.create({ data })
  }

  async save(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification)

    await this.prisma.notification.update({ where: { id: data.id }, data })
  }
}
