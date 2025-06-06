import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { z } from 'zod'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

const fetchRecentQuestionsQueryParamSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
})

const queryValidationPipe = new ZodValidationPipe(fetchRecentQuestionsQueryParamSchema)

type FetchRecentQuestionsQueryParamSchema = z.infer<
  typeof fetchRecentQuestionsQueryParamSchema
>

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) query: FetchRecentQuestionsQueryParamSchema
  ) {
    const { page } = query
    const perPage = 20

    const questions = await this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
      take: page * perPage,
      skip: (page - 1) * perPage,
    })

    return { questions }
  }
}
