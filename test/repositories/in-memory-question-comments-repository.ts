import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = []

  constructor(private inMemoryStudentsRepository: InMemoryStudentsRepository) {}

  async findManyByQuestionId(questionId: string, { page }: PaginationParams) {
    const questionComments = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)

    return questionComments
  }

  async findManyByQuestionIdWithAuthor(questionId: string, { page }: PaginationParams) {
    const commentsWithAuthor = this.items
      .filter(item => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20)
      .map(comment => {
        const author = this.inMemoryStudentsRepository.items.find(student =>
          student.id.equals(comment.authorId),
        )

        if (!author)
          throw new Error(`Author with ID "${comment.authorId.toString()}" does not exists`)

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
    const questionComment = this.items.find(item => item.id.toString() === id)

    return questionComment ?? null
  }

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment)
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex(item => item.id === questionComment.id)

    this.items.splice(itemIndex, 1)
  }
}
