import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'

const makeSut = () => {
  const inMemoryQuestionCommentsRepository =
    new InMemoryQuestionCommentsRepository()
  const sut = new FetchQuestionCommentsUseCase(
    inMemoryQuestionCommentsRepository,
  )
  return { sut, inMemoryQuestionCommentsRepository }
}

describe('Fetch Question Comments', () => {
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: FetchQuestionCommentsUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionCommentsRepository =
      dependencies.inMemoryQuestionCommentsRepository
    sut = dependencies.sut
  })

  it('should be able to fetch question comments', async () => {
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: new UniqueEntityId('question-1'),
      }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(3)
  })

  it('should be able to fetch paginated question comments', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: new UniqueEntityId('question-1'),
        }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.questionComments).toHaveLength(2)
  })
})
