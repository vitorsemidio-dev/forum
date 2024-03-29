import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import {
  Comment,
  CommentProps,
} from '@/domain/forum/enterprise/entities/comment'
import { QuestionCommentCreatedEvent } from '../events/question-comment-created-event'

export interface QuestionCommentProps extends CommentProps {
  questionId: UniqueEntityId
}

export class QuestionComment extends Comment<QuestionCommentProps> {
  get questionId() {
    return this.props.questionId
  }

  static create(
    props: Optional<QuestionCommentProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const questionComment = new QuestionComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    const isCreating = !id

    if (isCreating) {
      questionComment.addDomainEvent(
        new QuestionCommentCreatedEvent(questionComment),
      )
    }

    return questionComment
  }

  toJson() {
    return {
      id: this.id.toString(),
      questionId: this.questionId.toString(),
      authorId: this.authorId.toString(),
      content: this.content,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
    }
  }
}
