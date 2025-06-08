import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { QuestionPresenter } from '../presenters/question-presenter'

const fetchRecentQuestionsQueryParamSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchRecentQuestionsQueryParamSchema)

type FetchRecentQuestionsQueryParamSchema = z.infer<
  typeof fetchRecentQuestionsQueryParamSchema
>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchRecentQuestionsQueryParamSchema) {
    const { page } = query

    const result = await this.fetchRecentQuestions.execute({ page })

    if (result.isLeft()) throw new BadRequestException()

    const questions = result.value.questions

    return { questions: questions.map(QuestionPresenter.toHTTP) }
  }
}
