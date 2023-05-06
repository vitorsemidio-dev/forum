import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('ChooseQuestionBestAnswer', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryQuestionsRepository,
      inMemoryAnswersRepository,
    )
  })

  it('should choose the best answer from question', async () => {
    const newQuestion = makeQuestion({})
    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await inMemoryQuestionsRepository.create(newQuestion)
    await inMemoryAnswersRepository.create(newAnswer)

    await sut.execute({
      authorId: newQuestion.authorId.toValue(),
      answerId: newAnswer.id.toValue(),
    })

    expect(inMemoryQuestionsRepository.items[0].bestAnswerId?.toValue()).toBe(
      newAnswer.id.toValue(),
    )
  })

  it('should not choose the best answer from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-id-1'),
    })
    const newAnswer = makeAnswer({ questionId: newQuestion.id })
    await inMemoryQuestionsRepository.create(newQuestion)
    await inMemoryAnswersRepository.create(newAnswer)

    const output = sut.execute({
      authorId: 'author-id-2',
      answerId: newAnswer.id.toValue(),
    })

    await expect(output).rejects.toThrow('Not allowed.')
  })
})
