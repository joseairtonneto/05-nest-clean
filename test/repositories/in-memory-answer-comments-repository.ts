import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = []

  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

  async findManyByAnswerId(answerId: string, { page }: PaginationParams) {
    const answerComments = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)

    return answerComments
  }

  async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams) {
    const commentsWithAuthor = this.items
      .filter(item => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.inMemoryStudentsRepository.items.find(student =>
          student.id.equals(comment.authorId),
        )

        if (!author)
          throw new Error(`Author with ID "${comment.authorId.toString()} does not exists"`)

        return CommentWithAuthor.create({
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          authorId: comment.authorId,
          author: author.name,
        })
      })

    return commentsWithAuthor
  }

  async findById(id: string) {
    const answerComments = this.items.find(item => item.id.toString() === id)

    return answerComments ?? null
  }

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment)
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(item => item.id === answerComment.id)

    this.items.splice(itemIndex, 1)
  }
}
