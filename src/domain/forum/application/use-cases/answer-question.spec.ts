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
    const result = await sut.execute({
      attachmentIds: [],
      instructorId: 'any_instructor_id',
      questionId: 'any_question_id',
      content: 'any_content',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.id.toValue()).toBeTruthy()
    expect(result.value?.answer.content).toBe('any_content')
    expect(inMemoryAnswersRepository.items[0].id.toValue()).toBe(
      result.value?.answer.id.toValue(),
    )
  })
})
