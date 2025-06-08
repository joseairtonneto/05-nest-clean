import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchAnswerCommentsAnswerUseCaseRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsAnswerUseCaseResponse = Either<
  null,
  {
    answerComments: AnswerComment[]
  }
>

@Injectable()
export class FetchAnswerCommentsAnswerUseCase {
  constructor(private answerCommentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsAnswerUseCaseRequest): Promise<FetchAnswerCommentsAnswerUseCaseResponse> {
    const answerComments = await this.answerCommentsRepository.findManyByAnswerId(answerId, {
      page,
    })

    return right({ answerComments })
  }
}
