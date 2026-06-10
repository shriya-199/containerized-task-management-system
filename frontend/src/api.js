const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok) {
    const message = payload.errors?.join(' ') || payload.message || 'Request failed.';
    throw new Error(message);
  }

  return payload;
}

export const api = {
  getHealth: () => request('/health'),
  getTasks: () => request('/tasks'),
  createTask: (task) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(task)
    }),
  updateTask: (id, task) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task)
    }),
  toggleTask: (id) =>
    request(`/tasks/${id}/toggle`, {
      method: 'PATCH'
    }),
  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE'
    })
};
