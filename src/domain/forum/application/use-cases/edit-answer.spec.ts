import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('EditAnswerUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryAnswersRepository)
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
      content: 'new content updated',
    })

    expect(inMemoryAnswersRepository.items[0]).toMatchObject({
      content: 'new content updated',
    })
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
      content: 'new content updated',
    })

    await expect(output).rejects.toThrow('Not allowed.')
  })
})
