import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('DeleteAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
  })

  it('should delete a answer', async () => {
    const newAnswer1 = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-id-1'),
    )
    const newAnswer2 = makeAnswer({}, new UniqueEntityId('answer-id-2'))
    await inMemoryAnswersRepository.create(newAnswer1)
    await inMemoryAnswersRepository.create(newAnswer2)

    await sut.execute({
      answerId: 'answer-id-1',
      authorId: 'author-id-1',
    })

    expect(inMemoryAnswersRepository.items.length).toBe(1)
  })

  it('should not delete a answer from another user', async () => {
    const newAnswer1 = makeAnswer(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('answer-id-1'),
    )
    const newAnswer2 = makeAnswer({}, new UniqueEntityId('answer-id-2'))
    await inMemoryAnswersRepository.create(newAnswer1)
    await inMemoryAnswersRepository.create(newAnswer2)

    const output = sut.execute({
      answerId: 'answer-id-1',
      authorId: 'author-id-2',
    })

    await expect(output).rejects.toThrow('Not allowed.')
    expect(inMemoryAnswersRepository.items.length).toBe(2)
  })
})