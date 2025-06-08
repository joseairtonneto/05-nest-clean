import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({ slug: Slug.create('new-question') })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({ slug: 'new-question' })

    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        id: newQuestion.id,
        slug: newQuestion.slug,
      }),
    })
  })
})
