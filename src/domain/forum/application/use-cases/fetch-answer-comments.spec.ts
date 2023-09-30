import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-student.repository'

const makeSut = () => {
  const inMemoryStudentsRepository = new InMemoryStudentsRepository()
  const inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
    inMemoryStudentsRepository,
  )
  const sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
  return { sut, inMemoryAnswerCommentsRepository, inMemoryStudentsRepository }
}

describe('Fetch Answer Comments', () => {
  let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
  let inMemoryStudentsRepository: InMemoryStudentsRepository
  let sut: FetchAnswerCommentsUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswerCommentsRepository =
      dependencies.inMemoryAnswerCommentsRepository
    inMemoryStudentsRepository = dependencies.inMemoryStudentsRepository
    sut = dependencies.sut
  })

  it('should be able to fetch answer comments', async () => {
    const author = makeStudent()
    await inMemoryStudentsRepository.create(author)

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: author.id,
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: author.id,
      }),
    )

    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: new UniqueEntityId('answer-1'),
        authorId: author.id,
      }),
    )

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 1,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(3)
  })

  it('should be able to fetch paginated answer comments', async () => {
    const author = makeStudent()
    await inMemoryStudentsRepository.create(author)

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityId('answer-1'),
          authorId: author.id,
        }),
      )
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      page: 2,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.comments).toHaveLength(2)
  })
})
