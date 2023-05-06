import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('AnswerQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryAnswersRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  })

  it('create an answer', async ({ expect }) => {
    const { answer } = await sut.execute({
      instructorId: 'any_instructor_id',
      questionId: 'any_question_id',
      content: 'any_content',
    })

    expect(answer.id.toValue()).toBeTruthy()
    expect(answer.content).toBe('any_content')
    expect(inMemoryAnswersRepository.items[0].id.toValue()).toBe(
      answer.id.toValue(),
    )
  })
})
