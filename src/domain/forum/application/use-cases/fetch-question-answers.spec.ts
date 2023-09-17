import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { makeInMemoryAnswerRepository } from 'test/factories/make-in-memory-answer-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const inMemoryAnswersRepository = makeInMemoryAnswerRepository()
  const sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
  return { sut, inMemoryAnswersRepository }
}

describe('Fetch Question Answers', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: FetchQuestionAnswersUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    sut = dependencies.sut
  })

  it('should be able to fetch question answers', async () => {
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      }),
    )
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(3)
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: new UniqueEntityId('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answers).toHaveLength(2)
  })
})
