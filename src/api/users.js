/**
 * Users API – backend-ready layer.
 * Currently uses in-memory mock data. When you add a backend:
 * - Replace each function body with fetch() to your API (e.g. GET/POST /api/users).
 * - Return the same shapes (array of users from list endpoints, updated list after create/update/delete).
 * - The admin UI will then show and update from your backend automatically.
 */

const initialUsers = [
  { id: 1, name: "Ramesh Kumar", email: "ramesh.kumar@gmail.com", phone: "+91 98765 43210", role: "Super Admin", status: "Active", joinDate: "2024-01-15" },
  { id: 2, name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 98765 43211", role: "Vendor", status: "Active", joinDate: "2024-02-20" },
  { id: 3, name: "Vikram Singh", email: "vikram.singh@gmail.com", phone: "+91 98765 43212", role: "Vendor", status: "Inactive", joinDate: "2024-03-10" },
];

let mockUsers = [...initialUsers];

/**
 * Fetch all users. With backend: return fetch('/api/users').then(r => r.json())
 */
export function getUsers() {
  return Promise.resolve([...mockUsers]);
}

/**
 * Create a user. With backend: return fetch('/api/users', { method: 'POST', body: JSON.stringify(payload) })
 * then refetch: return createUser(...).then(() => getUsers())
 */
export function createUser(payload) {
  const id = Math.max(0, ...mockUsers.map((u) => u.id)) + 1;
  const joinDate = (payload.joinDate || new Date().toISOString().slice(0, 10));
  const user = { id, ...payload, joinDate };
  mockUsers = [...mockUsers, user];
  return Promise.resolve([...mockUsers]);
}

/**
 * Update a user. With backend: return fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
 * then return getUsers()
 */
export function updateUser(id, payload) {
  mockUsers = mockUsers.map((u) => (u.id === id ? { ...u, ...payload } : u));
  return Promise.resolve([...mockUsers]);
}

/**
 * Delete a user. With backend: return fetch(`/api/users/${id}`, { method: 'DELETE' })
 * then return getUsers()
 */
export function deleteUser(id) {
  mockUsers = mockUsers.filter((u) => u.id !== id);
  return Promise.resolve([...mockUsers]);
}
