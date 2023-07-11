import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from './answer'

describe('Answer', () => {
  it('should be able to create new answer', () => {
    const answer = Answer.create({
      content: 'Answer content',
      authorId: new UniqueEntityId('author-id'),
      questionId: new UniqueEntityId('question-id'),
    })

    expect(answer).toBeTruthy()
    expect(answer.id).toBeTruthy()
    expect(answer.content).toBe('Answer content')
    expect(answer.authorId.toString()).toBe('author-id')
    expect(answer.questionId.toString()).toBe('question-id')
    expect(answer.createdAt).toEqual(expect.any(Date))
    expect(answer.updatedAt).toBeUndefined()
  })

  it('should be able to update content and auto set updatedAt', () => {
    const answer = Answer.create({
      content: 'Answer content',
      authorId: new UniqueEntityId('author-id'),
      questionId: new UniqueEntityId('question-id'),
    })

    expect(answer.updatedAt).toBeUndefined()
    answer.content = 'New content'

    expect(answer.content).toBe('New content')
    expect(answer.updatedAt).toEqual(expect.any(Date))
  })

  it('should be able register domain event', () => {
    const answer = Answer.create({
      content: 'Answer content',
      authorId: new UniqueEntityId('author-id'),
      questionId: new UniqueEntityId('question-id'),
    })

    expect(answer.domainEvents.length).toEqual(1)
  })
})
