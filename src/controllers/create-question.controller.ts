import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { z } from 'zod'
import { PrismaService } from '@/prisma/prisma.service'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { CurrentUser } from '@/auth/current-user-decorator'
import { UserPayload } from '@/auth/jwt.strategy'

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema)

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>

function generateSlug(title: string) {
  return title
    .toString()                   // Ensure the input is a string
    .normalize('NFD')             // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .toLowerCase()                // Convert to lowercase
    .trim()                       // Trim leading/trailing whitespace
    .replace(/\s+/g, '-')        // Replace spaces with hyphens
    .replace(/[^\w-]+/g, '')     // Remove all non-word characters except hyphens
    .replace(/--+/g, '-');       // Replace multiple hyphens with a single hyphen
}

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema
  ) {
    const userId = user.sub
    const { title, content } = body

    await this.prisma.question.create({
      data: { authorId: userId, title, slug: generateSlug(title), content },
    })
  }
}
