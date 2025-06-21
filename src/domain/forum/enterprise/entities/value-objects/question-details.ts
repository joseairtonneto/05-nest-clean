import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

export interface QuestionDetailsProps {
  questionId: UniqueEntityID
	authorId: UniqueEntityID
	bestAnswerId?: UniqueEntityID | null
	author: string
	title: string
	content: string
	slug: Slug
	attachments: Attachment[]
	createdAt: Date
	updatedAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get questionId() {
    return this.props.questionId
  }

	get authorId() {
    return this.props.authorId
  }

	get bestAnswerId() {
    return this.props.bestAnswerId
  }

	get author() {
    return this.props.author
  }

	get title() {
    return this.props.title
  }

	get content() {
    return this.props.content
  }

	get slug() {
    return this.props.slug
  }

	get attachments() {
    return this.props.attachments
  }

	get createdAt() {
    return this.props.createdAt
  }

	get updatedAt() {
    return this.props.updatedAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
