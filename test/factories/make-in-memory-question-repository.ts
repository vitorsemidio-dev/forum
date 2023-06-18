import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

export function makeInMemoryQuestionRepository() {
  const questionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  return new InMemoryQuestionsRepository(questionAttachmentsRepository)
}
