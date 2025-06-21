import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { DomainEvents } from '@/core/events/domain-events'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
    private inMemoryAttachmentsRepository: InMemoryAttachmentsRepository,
    private inMemoryStudentsRepository: InMemoryStudentsRepository,
  ) {}

  async findManyRecent({ page }: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20)

    return questions
  }

  async findById(id: string) {
    const question = this.items.find(item => item.id.toString() === id)

    return question ?? null
  }

  async findBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)

    return question ?? null
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find(item => item.slug.value === slug)

    if (!question) return null

    const author = this.inMemoryStudentsRepository.items.find(student =>
      student.id.equals(question.authorId),
    )

    if (!author)
      throw new Error(`Author with ID "${question.authorId.toString()}" does not exists`)

    const questionAttachments = await this.questionAttachmentsRepository.findManyByQuestionId(
      question.id.toString(),
    )

    const attachments = questionAttachments.map(questionAttachment => {
      const attachment = this.inMemoryAttachmentsRepository.items.find(attachment =>
        attachment.id.equals(questionAttachment.attachmentId),
      )

      if (!attachment)
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exists.`,
        )

      return attachment
    })

    return QuestionDetails.create({
      questionId: question.id,
      authorId: question.authorId,
      bestAnswerId: question.bestAnswerId,
      author: author.name,
      title: question.title,
      content: question.content,
      slug: question.slug,
      attachments,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    })
  }

  async create(question: Question) {
    this.items.push(question)

    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex(item => item.id === question.id)

    this.items[itemIndex] = question

    await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())
    await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex(item => item.id === question.id)

    this.items.splice(itemIndex, 1)

    this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString())
  }
}
