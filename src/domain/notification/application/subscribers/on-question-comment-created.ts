import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { QuestionCommentCreatedEvent } from '@/domain/forum/enterprise/events/question-comment-created-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'

export class OnQuestionCommentCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewQuestionCommentNotification.bind(this),
      QuestionCommentCreatedEvent.name,
    )
  }

  async sendNewQuestionCommentNotification({
    questionComment,
  }: QuestionCommentCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      questionComment.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Novo comentário em "${question.title}"`,
        content: questionComment.content,
      })
    }
  }
}
