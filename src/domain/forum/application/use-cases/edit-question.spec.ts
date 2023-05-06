import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('EditQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('should delete a question', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-1',
      title: 'new title updated',
      content: 'new content updated',
    })

    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title updated',
      content: 'new content updated',
    })
  })

  it('should not delete a question from another user', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    const output = sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-2',
      title: 'new title updated',
      content: 'new content updated',
    })

    await expect(output).rejects.toThrow('Not allowed.')
  })
})
