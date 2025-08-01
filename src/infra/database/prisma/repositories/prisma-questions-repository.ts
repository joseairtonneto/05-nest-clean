import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details.mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { DomainEvents } from '@/core/events/domain-events'
import { CacheRepository } from '@/infra/cache/cache-repository'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private prisma: PrismaService,
    private cache: CacheRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async findManyRecent({ page }: PaginationParams) {
    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({ where: { slug } })

    if (!question) return null

    return PrismaQuestionMapper.toDomain(question)
  }

  async findDetailsBySlug(slug: string) {
    const cacheHit = await this.cache.get(`question:${slug}:details`)

    if (cacheHit) {
      const cachedData = JSON.parse(cacheHit)

      return PrismaQuestionDetailsMapper.toDomain(cachedData)
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: { author: true, attachments: true },
    })

    if (!question) return null

    await this.cache.set(`question:${slug}:details`, JSON.stringify(question))

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)

    return questionDetails
  }

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({ data })

    await this.questionAttachmentsRepository.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await Promise.all([
      this.prisma.question.update({ where: { id: data.id }, data }),
      this.questionAttachmentsRepository.createMany(question.attachments.getNewItems()),
      this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems()),
      this.cache.delete(`question:${data.slug}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question) {
    const { id } = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({ where: { id } })
  }
}
