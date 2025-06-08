import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { FetchQuestionCommentsQuestionUseCase } from './fetch-question-comments'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: FetchQuestionCommentsQuestionUseCase

describe('Fetch QuestionComments Question Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository()

    sut = new FetchQuestionCommentsQuestionUseCase(inMemoryQuestionCommentsRepository)
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
    )

    const result = await sut.execute({ questionId: 'question-1', page: 1 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({ questionId: 'question-1', page: 2 })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
