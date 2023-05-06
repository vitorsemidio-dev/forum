import { test } from 'vitest';
import { Answer } from '../entities/answer';
import { AnswersRepository } from '../repositories/answers-repository';
import { AnswerQuestionUseCase } from './answer-question';

const fakeAnswersRepository: AnswersRepository = {
  create: async (answer: Answer) => {
    return;
  },
};

test('create an answer', async ({ expect }) => {
  const answerQuestionUseCase = new AnswerQuestionUseCase(
    fakeAnswersRepository,
  );

  const { answer } = await answerQuestionUseCase.execute({
    instructorId: 'any_instructor_id',
    questionId: 'any_question_id',
    content: 'any_content',
  });

  expect(answer.id.toValue()).toBeTruthy();
  expect(answer.content).toBe('any_content');
});
