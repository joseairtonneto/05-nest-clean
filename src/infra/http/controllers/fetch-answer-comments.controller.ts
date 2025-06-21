import { BadRequestException, Controller, Get, Param, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const fetchAnswerCommentsQueryParamSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchAnswerCommentsQueryParamSchema)

type FetchAnswerCommentsQueryParamSchema = z.infer<typeof fetchAnswerCommentsQueryParamSchema>

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query(queryValidationPipe) query: FetchAnswerCommentsQueryParamSchema,
  ) {
    const { page } = query

    const result = await this.fetchAnswerComments.execute({ answerId, page })

    if (result.isLeft()) throw new BadRequestException()

    const comments = result.value.comments

    return { comments: comments.map(CommentWithAuthorPresenter.toHTTP) }
  }
}
