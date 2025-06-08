import { Question } from '@/domain/forum/enterprise/entities/question'

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
