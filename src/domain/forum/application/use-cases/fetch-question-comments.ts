import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionCommentsQuestionUseCaseRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsQuestionUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[]
  }
>

@Injectable()
export class FetchQuestionCommentsQuestionUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsQuestionUseCaseRequest): Promise<FetchQuestionCommentsQuestionUseCaseResponse> {
    const questionComments = await this.questionCommentsRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    )

    return right({ questionComments })
  }
}
