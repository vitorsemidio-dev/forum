import { expect, test } from 'vitest';
import { Slug } from './slug';

test('it should create a slug from a text', () => {
  const slug = Slug.createFromText('  This is a slug  ');

  expect(slug.value).toBe('this-is-a-slug');
});
