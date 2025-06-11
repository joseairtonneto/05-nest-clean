import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { PrismaQuestionAttachmentMapper } from '../mappers/prisma-question-attachment-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string) {
    const attachments = await this.prisma.attachment.findMany({ where: { questionId } })

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain)
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({ where: { questionId } })
  }
}
