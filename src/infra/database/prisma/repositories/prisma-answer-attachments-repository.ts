import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { PrismaAnswerAttachmentMapper } from '../mappers/prisma-answer-attachment-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) return

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) return

    const attachmentIds = attachments.map(attachment => attachment.id.toString())

    await this.prisma.attachment.deleteMany({ where: { id: { in: attachmentIds } } })
  }

  async findManyByAnswerId(answerId: string) {
    const attachments = await this.prisma.attachment.findMany({ where: { answerId } })

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain)
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prisma.attachment.deleteMany({ where: { answerId } })
  }
}
