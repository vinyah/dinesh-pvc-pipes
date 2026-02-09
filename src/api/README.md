# API layer (backend-ready)

Admin data is loaded and updated through this API layer. Right now it uses **in-memory mock data**. When you add a backend:

1. Replace the implementation inside each function in `users.js` and `roles.js` with `fetch()` calls to your API.
2. Keep the same function signatures and return shapes (e.g. `getUsers()` returns a Promise that resolves to an array of users).
3. After create/update/delete, either return the updated list from the API or call the corresponding `get*()` and return that. The admin UI already sets state from these results, so **details will update automatically** from your backend.

Example for `users.js` when using a real backend:

```js
const API_BASE = '/api'; // or your backend URL

export function getUsers() {
  return fetch(`${API_BASE}/users`).then((r) => r.json());
}

export function createUser(payload) {
  return fetch(`${API_BASE}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then((r) => r.json()).then(() => getUsers()); // return updated list
}

export function updateUser(id, payload) {
  return fetch(`${API_BASE}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).then(() => getUsers());
}

export function deleteUser(id) {
  return fetch(`${API_BASE}/users/${id}`, { method: 'DELETE' }).then(() => getUsers());
}
```

You can add more API modules (e.g. `coupons.js`, `shipments.js`) and wire other admin pages the same way: load on mount, update state from API after mutations.
