import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'

const makeSut = () => {
  const inMemoryAnswerCommentsRepository =
    new InMemoryAnswerCommentsRepository()
  const sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  return { sut, inMemoryAnswerCommentsRepository }
}

describe('Fetch Answer Comments', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswerCommentsRepository =
      dependencies.inMemoryAnswerCommentsRepository
    sut = dependencies.sut
  })

  it('should be able to fetch answer comments', async () => {
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answerComments).toHaveLength(2)
  })
})
