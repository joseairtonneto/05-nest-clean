import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private prisma: PrismaService,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({ where: { id } })

    if (!answer) return null

    return PrismaAnswerMapper.toDomain(answer)
  }

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.create({ data })

    await this.answerAttachmentsRepository.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await Promise.all([
      this.prisma.answer.update({ where: { id: data.id }, data }),
      this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems()),
      this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems()),
    ])

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer) {
    const { id } = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.delete({ where: { id } })
  }
}
