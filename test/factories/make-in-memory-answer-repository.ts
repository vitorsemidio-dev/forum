import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

export function makeInMemoryAnswerRepository() {
  const answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
  return new InMemoryAnswersRepository(answerAttachmentsRepository)
}
