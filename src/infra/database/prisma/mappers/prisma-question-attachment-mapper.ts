import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Prisma, Attachment as PrismaAttachment } from '@prisma/client'

export class PrismaQuestionAttachmentMapper {
  static toDomain(raw: PrismaAttachment): QuestionAttachment {
    if (!raw.questionId) throw new Error('Invalid attachment type.')

    return QuestionAttachment.create(
      {
        questionId: new UniqueEntityID(raw.questionId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(questionAttachment: QuestionAttachment): Prisma.AttachmentUpdateArgs {
    return {
      where: { id: questionAttachment.attachmentId.toString() },
      data: { questionId: questionAttachment.questionId.toString() },
    }
  }

  static toPrismaUpdateMany(
    attachments: QuestionAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentIds = attachments.map(attachment => attachment.attachmentId.toString())

    return {
      where: { id: { in: attachmentIds } },
      data: { questionId: attachments[0].questionId.toString() },
    }
  }
}
