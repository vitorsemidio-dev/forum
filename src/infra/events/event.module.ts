import { OnAnswerCreated } from '@/domain/notification/application/subscribers/on-answer-created'
import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { DatabaseModule } from '@/infra/database/database.module'
import { Module } from '@nestjs/common'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnQuestionCommentCreated,
    OnQuestionBestAnswerChosen,
    OnAnswerCreated,
    SendNotificationUseCase,
  ],
})
export class EventModule {}
