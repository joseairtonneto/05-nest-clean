import { BadRequestException, Controller, Param, Delete, HttpCode } from '@nestjs/common'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'

@Controller('/questions/comments/:id')
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') questionCommentId: string) {
    const result = await this.deleteQuestionCommentUseCase.execute({
      questionCommentId,
      authorId: user.sub,
    })

    if (result.isLeft()) throw new BadRequestException()
  }
}
