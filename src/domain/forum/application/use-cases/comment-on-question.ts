import { Either, left, right } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionsRepository } from '../repositories/questions-repository'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface CommentOnQuestionUseCaseRequest {
  questionId: string
  authorId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    questionComment: QuestionComment
  }
>

@Injectable()
export class CommentOnQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId)

    if (!question) return left(new ResourceNotFoundError())

    const questionComment = QuestionComment.create({
      questionId: new UniqueEntityID(questionId),
      authorId: new UniqueEntityID(authorId),
      content,
    })

    await this.questionCommentsRepository.create(questionComment)

    return right({ questionComment })
  }
}
