import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('CreateQuestionUseCase', () => {
  beforeEach(() => {
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  })

  it('create a question', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      content: 'any_content',
      title: 'any_title',
      attachmentIds: ['any_attachment_id'],
    })

    const question = inMemoryQuestionsRepository.items[0]
    const questionAttachments = question.attachments.getItems()

    expect(result.isRight()).toBe(true)
    expect(question).toBe(result.value?.question)
    expect(questionAttachments.length).toBe(1)
    expect(questionAttachments[0].attachmentId.toString()).toBe(
      'any_attachment_id',
    )
  })
})
