import { OnQuestionCommentCreated } from '@/domain/notification/application/subscribers/on-question-comment-created'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification'
import { waitFor } from '@/infra/utils/wait-for'
import { makeInMemoryAnswerRepositoryWithDependencies } from 'test/factories/make-in-memory-answer-repository'
import { makeInMemoryNotificationRepositoryWithDependencies } from 'test/factories/make-in-memory-notification-repository'
import { makeInMemoryQuestionRepositoryWithDependencies } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { SpyInstance } from 'vitest'

const makeSut = () => {
  const { inMemoryAnswerAttachmentsRepository, inMemoryAnswersRepository } =
    makeInMemoryAnswerRepositoryWithDependencies()
  const {
    inMemoryQuestionsRepository,
    inMemoryAttachmentsRepository,
    inMemoryQuestionAttachmentsRepository,
    inMemoryStudentsRepository,
  } = makeInMemoryQuestionRepositoryWithDependencies()
  const { inMemoryNotificationsRepository } =
    makeInMemoryNotificationRepositoryWithDependencies()
  const sendNotificationUseCase = new SendNotificationUseCase(
    inMemoryNotificationsRepository,
  )

  return {
    sendNotificationUseCase: sendNotificationUseCase,
    inMemoryAnswerAttachmentsRepository,
    inMemoryAnswersRepository,
    inMemoryQuestionsRepository,
    inMemoryAttachmentsRepository,
    inMemoryQuestionAttachmentsRepository,
    inMemoryStudentsRepository,
  }
}

let sendNotificationExecuteSpy: SpyInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>

describe('On Question Comment Created', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sendNotificationUseCase: SendNotificationUseCase
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository

  beforeEach(async () => {
    const dependencies = makeSut()
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    sendNotificationUseCase = dependencies.sendNotificationUseCase

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    const _onQuestionCommentCreated = new OnQuestionCommentCreated(
      inMemoryQuestionsRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when a question comment is created', async () => {
    const question = makeQuestion()
    const questionComment = makeQuestionComment({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryQuestionCommentsRepository.create(questionComment)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
      expect(sendNotificationExecuteSpy).toHaveBeenCalledTimes(1)
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: question.authorId.toString(),
          title: expect.any(String),
          content: expect.any(String),
        }),
      )
    })
  })
})
