import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaAnswerCommentMapper } from '../mappers/prisma-answer-comment-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const comments = await this.prisma.comment.findMany({
      where: { answerId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map(PrismaAnswerCommentMapper.toDomain)
  }

  async findById(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) return null

    return PrismaAnswerCommentMapper.toDomain(comment)
  }

  async create(answerComment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({ data })
  }

  async delete(answerComment: AnswerComment) {
    const { id } = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.delete({ where: { id } })
  }
}
