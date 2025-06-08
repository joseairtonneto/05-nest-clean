import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prisma: PrismaService) {}

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

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.create({ data })
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.update({ where: { id: data.id }, data })
  }

  async delete(question: Question) {
    const { id } = PrismaQuestionMapper.toPrisma(question)

    await this.prisma.question.delete({ where: { id } })
  }
}
