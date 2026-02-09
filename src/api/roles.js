/**
 * Roles API – backend-ready layer.
 * Currently uses in-memory mock data. When you add a backend:
 * - Replace with fetch() to your API (e.g. GET /api/roles, PATCH /api/roles/:id/permissions).
 * - Return the same shapes. The admin UI will then show and update from your backend automatically.
 */

const MODULES = [
  "Dashboard", "Orders", "Products", "Inventory", "Customers", "Pricing",
  "Promotions", "Coupons", "Logistics", "Payments", "Reviews", "Settings",
];

const buildInitialRoles = () => [
  { id: 1, name: "Super Admin", users: 2, description: "Full system access with all permissions", color: "bg-[#b30000]", view: 20, viewTotal: 20, create: 20, createTotal: 20, edit: 20, editTotal: 20, delete: 20, deleteTotal: 20, permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: true, edit: true, delete: true } }), {}) },
  { id: 2, name: "Vendor", users: 15, description: "Manage own products and inventory", color: "bg-green-600", view: 3, viewTotal: 3, create: 1, createTotal: 3, edit: 2, editTotal: 3, delete: 0, deleteTotal: 3, permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: m === "Products" || m === "Inventory", edit: m === "Products" || m === "Inventory", delete: false } }), {}) },
  { id: 3, name: "Manager", users: 8, description: "Manage orders, customers and reports", color: "bg-blue-600", view: 12, viewTotal: 12, create: 6, createTotal: 12, edit: 8, editTotal: 12, delete: 2, deleteTotal: 12, permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: ["Orders", "Customers", "Coupons"].includes(m), edit: true, delete: m === "Coupons" } }), {}) },
  { id: 4, name: "Support", users: 12, description: "View and respond to orders and reviews", color: "bg-amber-500", view: 8, viewTotal: 8, create: 0, createTotal: 8, edit: 4, editTotal: 8, delete: 0, deleteTotal: 8, permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: ["Orders", "Customers", "Reviews"].includes(m), create: false, edit: ["Orders", "Reviews"].includes(m), delete: false } }), {}) },
  { id: 5, name: "Viewer", users: 5, description: "Read-only access to dashboard and reports", color: "bg-gray-500", view: 6, viewTotal: 6, create: 0, createTotal: 6, edit: 0, editTotal: 6, delete: 0, deleteTotal: 6, permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: ["Dashboard", "Orders", "Products", "Inventory", "Customers", "Logistics"].includes(m), create: false, edit: false, delete: false } }), {}) },
  { id: 6, name: "Custom Role", users: 3, description: "Custom access for Dinesh PVC Pipes operations", color: "bg-purple-600", view: 5, viewTotal: 12, create: 2, createTotal: 12, edit: 3, editTotal: 12, delete: 0, deleteTotal: 12, permissions: MODULES.reduce((acc, m, i) => ({ ...acc, [m]: { view: i < 6, create: i < 2, edit: i < 4, delete: false } }), {}) },
];

let mockRoles = buildInitialRoles();

/**
 * Fetch all roles. With backend: return fetch('/api/roles').then(r => r.json())
 */
export function getRoles() {
  return Promise.resolve(JSON.parse(JSON.stringify(mockRoles)));
}

/**
 * Update role permissions. With backend: return fetch(`/api/roles/${id}/permissions`, { method: 'PATCH', body: JSON.stringify({ permissions, counts }) })
 * then return getRoles()
 */
export function updateRolePermissions(id, permissions, counts) {
  const role = mockRoles.find((r) => r.id === id);
  if (!role) return Promise.resolve(JSON.parse(JSON.stringify(mockRoles)));
  const len = MODULES.length;
  mockRoles = mockRoles.map((r) =>
    r.id === id
      ? {
          ...r,
          permissions: JSON.parse(JSON.stringify(permissions)),
          view: counts.view,
          viewTotal: len,
          create: counts.create,
          createTotal: len,
          edit: counts.edit,
          editTotal: len,
          delete: counts.delete,
          deleteTotal: len,
        }
      : r
  );
  return Promise.resolve(JSON.parse(JSON.stringify(mockRoles)));
}
