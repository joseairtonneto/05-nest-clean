import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const attachment = await this.prisma.attachment.findUnique({ where: { id } })

    if (!attachment) return null

    return PrismaAttachmentMapper.toDomain(attachment)
  }

  async create(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.create({ data })
  }

  async save(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.update({ where: { id: data.id }, data })
  }

  async delete(attachment: Attachment) {
    const { id } = PrismaAttachmentMapper.toPrisma(attachment)

    await this.prisma.attachment.delete({ where: { id } })
  }
}
