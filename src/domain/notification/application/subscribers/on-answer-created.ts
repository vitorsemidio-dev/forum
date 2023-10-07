import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created-event'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    )
  }

  async sendNewAnswerNotification({
    answer,
  }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(
      answer.questionId.toString(),
    )

    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title
          .substring(0, 40)
          .concat('...')}"`,
        content: answer.excerpt,
      })
    }
  }
}
