import { BadRequestException, Body, Controller, Param, Post } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema)

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('answerId') answerId: string,
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
  ) {
    const userId = user.sub
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      answerId,
      content,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
