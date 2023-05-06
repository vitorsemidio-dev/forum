import { test } from 'vitest';
import { AnswerQuestionUseCase } from './answer-question';

test('create an answer', async ({ expect }) => {
  const answerQuestionUseCase = new AnswerQuestionUseCase();

  const { answer } = await answerQuestionUseCase.execute({
    instructorId: 'any_instructor_id',
    questionId: 'any_question_id',
    content: 'any_content',
  });

  expect(answer).toMatchObject({
    id: expect.any(String),
    content: 'any_content',
  });
});
