import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private AnswersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.AnswersRepository.findById(answerId)

    if (!answer) return left(new ResourceNotFoundError())

    if (authorId !== answer.authorId.toString()) return left(new NotAllowedError())

    await this.AnswersRepository.delete(answer)

    return right(null)
  }
}
