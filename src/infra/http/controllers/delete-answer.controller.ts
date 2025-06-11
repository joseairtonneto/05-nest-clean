import { BadRequestException, Param, Delete, HttpCode, Controller } from '@nestjs/common'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'

@Controller('/answers/:id')
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') answerId: string) {
    const result = await this.deleteAnswer.execute({ answerId, authorId: user.sub })

    if (result.isLeft()) throw new BadRequestException()
  }
}
