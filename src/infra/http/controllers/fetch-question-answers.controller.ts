import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { AnswerPresenter } from '../presenters/answer-presenter'

const fetchQuestionAnswersQueryParamSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchQuestionAnswersQueryParamSchema)

type FetchQuestionAnswersQueryParamSchema = z.infer<
  typeof fetchQuestionAnswersQueryParamSchema
>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(queryValidationPipe) query: FetchQuestionAnswersQueryParamSchema,
  ) {
    const { page } = query

    const result = await this.fetchQuestionAnswers.execute({ questionId, page })

    if (result.isLeft()) throw new BadRequestException()

    const answers = result.value.answers

    return { answers: answers.map(AnswerPresenter.toHTTP) }
  }
}
