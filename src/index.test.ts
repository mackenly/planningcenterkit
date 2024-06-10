import { expect, test } from 'vitest';
import { run } from './index';

test('run', () => {
    expect(run()).toBe('Hello World');
});