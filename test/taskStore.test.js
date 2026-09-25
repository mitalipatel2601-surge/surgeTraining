'use strict';

const {
  addTask,
  completeTask,
  removeTask,
  listTasks,
  filterByTags,
  sortByPriority,
  _reset,
} = require('../src/taskStore');

beforeEach(() => {
  _reset();
});

test('addTask creates a task with defaults', () => {
  const task = addTask({ title: 'Write report' });
  expect(task.title).toBe('Write report');
  expect(task.priority).toBe('medium');
  expect(task.done).toBe(false);
  expect(task.tags).toEqual([]);
});

test('addTask rejects an invalid priority', () => {
  expect(() => addTask({ title: 'Bad', priority: 'urgent' })).toThrow();
});

test('addTask rejects an empty title', () => {
  expect(() => addTask({ title: '   ' })).toThrow();
});

test('completeTask marks a task done', () => {
  const task = addTask({ title: 'Ship feature' });
  const completed = completeTask(task.id);
  expect(completed.done).toBe(true);
});

test('removeTask deletes a task by id', () => {
  const task = addTask({ title: 'Temp task' });
  removeTask(task.id);
  expect(listTasks()).toHaveLength(0);
});

test('listTasks can exclude completed tasks', () => {
  const a = addTask({ title: 'A' });
  addTask({ title: 'B' });
  completeTask(a.id);
  expect(listTasks({ includeDone: false })).toHaveLength(1);
});

test('filterByTags returns tasks matching ALL given tags', () => {
  addTask({ title: 'A', tags: ['work', 'urgent'] });
  addTask({ title: 'B', tags: ['work'] });
  const result = filterByTags(['work', 'urgent']);
  expect(result).toHaveLength(1);
  expect(result[0].title).toBe('A');
});

test('sortByPriority orders high > medium > low, then by creation order', () => {
  const low = addTask({ title: 'Low', priority: 'low' });
  const high = addTask({ title: 'High', priority: 'high' });
  const medium = addTask({ title: 'Medium', priority: 'medium' });
  const sorted = sortByPriority(listTasks());
  expect(sorted.map((t) => t.id)).toEqual([high.id, medium.id, low.id]);
});
