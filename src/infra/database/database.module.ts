import { Module } from '@nestjs/common'

import { CacheModule } from '../cache/cache.module'

import { PrismaService } from '../database/prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'

@Module({
  imports: [CacheModule],
  providers: [
    PrismaService,
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: QuestionCommentsRepository, useClass: PrismaQuestionCommentsRepository },
    { provide: QuestionAttachmentsRepository, useClass: PrismaQuestionAttachmentsRepository },
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: AnswerCommentsRepository, useClass: PrismaAnswerCommentsRepository },
    { provide: AnswerAttachmentsRepository, useClass: PrismaAnswerAttachmentsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
    { provide: AttachmentsRepository, useClass: PrismaAttachmentsRepository },
    { provide: NotificationsRepository, useClass: PrismaNotificationsRepository },
  ],
  exports: [
    PrismaService,
    QuestionsRepository,
    QuestionCommentsRepository,
    QuestionAttachmentsRepository,
    AnswersRepository,
    AnswerCommentsRepository,
    AnswerAttachmentsRepository,
    StudentsRepository,
    AttachmentsRepository,
    NotificationsRepository,
  ],
})
export class DatabaseModule {}
