import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { makeTask, productivityScore, starterTasks } from '../utils/tasks.js';

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage('taskflow-tasks', starterTasks);

  function addTask(input) {
    const task = makeTask(input);
    setTasks((current) => [task, ...current]);
    return task;
  }

  function updateTask(id, input) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, ...input } : task)));
  }

  function deleteTask(id) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  function deleteCompleted() {
    setTasks((current) => current.filter((task) => task.status !== 'completed'));
  }

  function deleteAll() {
    setTasks([]);
  }

  function toggleComplete(id) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id
          ? { ...task, status: task.status === 'completed' ? 'pending' : 'completed' }
          : task
      )
    );
  }

  function toggleImportant(id) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, important: !task.important } : task))
    );
  }

  function reorderTasks(sourceId, targetId) {
    if (sourceId === targetId) return;
    setTasks((current) => {
      const copy = [...current];
      const sourceIndex = copy.findIndex((task) => task.id === sourceId);
      const targetIndex = copy.findIndex((task) => task.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const [moved] = copy.splice(sourceIndex, 1);
      copy.splice(targetIndex, 0, moved);
      return copy;
    });
  }

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.length - completed;
    const important = tasks.filter((task) => task.important).length;
    return {
      total: tasks.length,
      completed,
      pending,
      important,
      productivity: productivityScore(tasks)
    };
  }, [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        addTask,
        updateTask,
        deleteTask,
        deleteCompleted,
        deleteAll,
        toggleComplete,
        toggleImportant,
        reorderTasks
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}
