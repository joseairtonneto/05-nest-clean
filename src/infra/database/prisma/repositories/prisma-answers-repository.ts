import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(private prisma: PrismaService) {}

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
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.update({ where: { id: data.id }, data })
  }

  async delete(answer: Answer) {
    const { id } = PrismaAnswerMapper.toPrisma(answer)

    await this.prisma.answer.delete({ where: { id } })
  }
}
