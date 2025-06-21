import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { PrismaQuestionCommentMapper } from '../mappers/prisma-question-comment-mapper'
import { PrismaCommentWithAuthorMapper } from '../mappers/prisma-comment-with-author-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
  constructor(private prisma: PrismaService) {}

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map(PrismaQuestionCommentMapper.toDomain)
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const comments = await this.prisma.comment.findMany({
      where: { questionId },
      include: { author: true },
      orderBy: { createdAt: 'desc' },
      take: 20,
      skip: (page - 1) * 20,
    })

    return comments.map(PrismaCommentWithAuthorMapper.toDomain)
  }

  async findById(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } })

    if (!comment) return null

    return PrismaQuestionCommentMapper.toDomain(comment)
  }

  async create(questionComment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.create({ data })
  }

  async delete(questionComment: QuestionComment) {
    const { id } = PrismaQuestionCommentMapper.toPrisma(questionComment)

    await this.prisma.comment.delete({ where: { id } })
  }
}
