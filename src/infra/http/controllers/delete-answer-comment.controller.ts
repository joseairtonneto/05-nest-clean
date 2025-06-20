import { BadRequestException, Controller, Param, Delete, HttpCode } from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment'

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerCommentUseCase: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') answerCommentId: string) {
    const result = await this.deleteAnswerCommentUseCase.execute({
      answerCommentId,
      authorId: user.sub,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
