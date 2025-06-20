import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) throw new Error('Invalid attachment type.')

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(answerAttachment: AnswerAttachment): Prisma.AttachmentUpdateArgs {
    return {
      where: { id: answerAttachment.attachmentId.toString() },
      data: { answerId: answerAttachment.answerId.toString() },
    }
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map(attachment => attachment.attachmentId.toString())

    return {
      where: { id: { in: attachmentIds } },
      data: { answerId: attachments[0].answerId.toString() },
    }
  }
}
