import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = []

  async createMany(attachments: QuestionAttachment[]) {
    this.items.push(...attachments)
  }

  async deleteMany(attachments: QuestionAttachment[]) {
    this.items = this.items.filter(item => {
      return !attachments.some(attachment => attachment.equals(item))
    })
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      item => item.questionId.toString() === questionId,
    )

    return questionAttachments
  }

  async deleteManyByQuestionId(questionId: string) {
    this.items = this.items.filter(item => item.questionId.toString() !== questionId)
  }
}
