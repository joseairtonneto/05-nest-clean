import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'

export class InMemoryAnswerAttachmentsRepository implements AnswerAttachmentsRepository {
  public items: AnswerAttachment[] = []

  async createMany(attachments: AnswerAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    this.items = this.items.filter(item => {
      return !attachments.some(attachment => attachment.equals(item))
    })
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(item => item.answerId.toString() === answerId)

    return answerAttachments
  }

  async deleteManyByAnswerId(answerId: string) {
    this.items = this.items.filter(item => item.answerId.toString() !== answerId)
  }
}
