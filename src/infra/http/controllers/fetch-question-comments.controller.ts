import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentPresenter } from '../presenters/comment-presenter'

const fetchQuestionCommentsQueryParamSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchQuestionCommentsQueryParamSchema)

type FetchQuestionCommentsQueryParamSchema = z.infer<
  typeof fetchQuestionCommentsQueryParamSchema
>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private fetchQuestionComments: FetchQuestionCommentsUseCase) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(queryValidationPipe) query: FetchQuestionCommentsQueryParamSchema,
  ) {
    const { page } = query

    const result = await this.fetchQuestionComments.execute({ questionId, page })

    if (result.isLeft()) throw new BadRequestException()

    const comments = result.value.questionComments

    return { comments: comments.map(CommentPresenter.toHTTP) }
  }
}
