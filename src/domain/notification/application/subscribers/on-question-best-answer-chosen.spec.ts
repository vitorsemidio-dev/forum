import { OnQuestionBestAnswerChosen } from '@/domain/notification/application/subscribers/on-question-best-answer-chosen'
import {
  SendNotificationUseCase,
  SendNotificationUseCaseRequest,
  SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification'
import { waitFor } from '@/infra/utils/wait-for'
import { makeAnswer } from 'test/factories/make-answer'
import { makeInMemoryAnswerRepositoryWithDependencies } from 'test/factories/make-in-memory-answer-repository'
import { makeInMemoryNotificationRepositoryWithDependencies } from 'test/factories/make-in-memory-notification-repository'
import { makeInMemoryQuestionRepositoryWithDependencies } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
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

describe('On Question Best Answer Chosen', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let sendNotificationUseCase: SendNotificationUseCase

  beforeEach(async () => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    sendNotificationUseCase = dependencies.sendNotificationUseCase

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')

    const _onQuestionBestAnswerChosen = new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    )
  })

  it('should be able to send a notification when an answer is chosen as best', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionsRepository.create(question)
    await inMemoryAnswersRepository.create(answer)

    question.bestAnswerId = answer.id

    await inMemoryQuestionsRepository.save(question)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
      expect(sendNotificationExecuteSpy).toHaveBeenCalledTimes(1)
      expect(sendNotificationExecuteSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          recipientId: answer.authorId.toString(),
          title: expect.any(String),
          content: expect.any(String),
        }),
      )
    })
  })
})
