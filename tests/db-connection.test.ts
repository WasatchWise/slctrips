import { test, expect } from 'vitest';

const connectionString = process.env.DATABASE_URL;

(connectionString ? test : test.skip)('DATABASE_URL is defined', () => {
  expect(connectionString).toBeTypeOf('string');
});

