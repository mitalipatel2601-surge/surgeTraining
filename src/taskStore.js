'use strict';

/**
 * In-memory task store for a small task management CLI/service.
 * Tasks look like:
 * {
 *   id: number,
 *   title: string,
 *   priority: 'low' | 'medium' | 'high',
 *   done: boolean,
 *   createdAt: Date,
 *   dueDate: Date | null,
 *   tags: string[]
 * }
 */

let tasks = [];
let nextId = 1;

function addTask({ title, priority = 'medium', dueDate = null, tags = [] }) {
  if (!title || typeof title !== 'string' || !title.trim()) {
    throw new Error('Task title is required');
  }
  if (!['low', 'medium', 'high'].includes(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }

  const task = {
    id: nextId++,
    title: title.trim(),
    priority,
    done: false,
    createdAt: new Date(),
    dueDate: dueDate ? new Date(dueDate) : null,
    tags: Array.isArray(tags) ? tags : [],
  };

  tasks.push(task);
  return task;
}

function completeTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error(`Task with id ${id} not found`);
  }
  task.done = true;
  return task;
}

function removeTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw new Error(`Task with id ${id} not found`);
  }
  return tasks.splice(index, 1)[0];
}

function listTasks({ includeDone = true } = {}) {
  return tasks.filter((t) => (includeDone ? true : !t.done));
}

/**
 * Filters tasks by tag. A task matches if it has ALL of the given tags.
 */
function filterByTags(tagList) {
  if (!Array.isArray(tagList) || tagList.length === 0) {
    return listTasks();
  }
  return tasks.filter((t) => tagList.every((tag) => t.tags.includes(tag)));
}

const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

/**
 * Sorts tasks by priority (high first), then by creation date (oldest first).
 * This is the existing sorting convention used across the app; new sorting
 * behavior should be consistent with it unless a feature says otherwise.
 */
function sortByPriority(taskList) {
  return [...taskList].sort((a, b) => {
    const weightDiff = PRIORITY_WEIGHT[b.priority] - PRIORITY_WEIGHT[a.priority];
    if (weightDiff !== 0) return weightDiff;
    return a.createdAt - b.createdAt;
  });
}

function _reset() {
  tasks = [];
  nextId = 1;
}

module.exports = {
  addTask,
  completeTask,
  removeTask,
  listTasks,
  filterByTags,
  sortByPriority,
  _reset,
};
