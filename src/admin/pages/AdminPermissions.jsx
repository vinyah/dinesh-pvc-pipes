import React, { useState, useMemo, useEffect } from "react";
import { Shield, Users, UserPlus, Check, X, Pencil, Search, Mail, Phone, Calendar, Trash2, Eye, EyeOff } from "lucide-react";
import * as usersApi from "../../api/users";
import * as rolesApi from "../../api/roles";

const MODULES = [
  "Dashboard",
  "Orders",
  "Products",
  "Inventory",
  "Customers",
  "Pricing",
  "Promotions",
  "Coupons",
  "Logistics",
  "Payments",
  "Reviews",
  "Settings",
];

const initialRoles = [
  {
    id: 1,
    name: "Super Admin",
    users: 2,
    description: "Full system access with all permissions",
    color: "bg-[#b30000]",
    view: 20,
    viewTotal: 20,
    create: 20,
    createTotal: 20,
    edit: 20,
    editTotal: 20,
    delete: 20,
    deleteTotal: 20,
    permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: true, edit: true, delete: true } }), {}),
  },
  {
    id: 2,
    name: "Vendor",
    users: 15,
    description: "Manage own products and inventory",
    color: "bg-green-600",
    view: 3,
    viewTotal: 3,
    create: 1,
    createTotal: 3,
    edit: 2,
    editTotal: 3,
    delete: 0,
    deleteTotal: 3,
    permissions: MODULES.reduce((acc, m, i) => {
      const isProd = m === "Products" || m === "Inventory";
      return { ...acc, [m]: { view: true, create: isProd, edit: isProd, delete: false } };
    }, {}),
  },
  {
    id: 3,
    name: "Manager",
    users: 8,
    description: "Manage orders, customers and reports",
    color: "bg-blue-600",
    view: 12,
    viewTotal: 12,
    create: 6,
    createTotal: 12,
    edit: 8,
    editTotal: 12,
    delete: 2,
    deleteTotal: 12,
    permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: true, create: ["Orders", "Customers", "Coupons"].includes(m), edit: true, delete: m === "Coupons" } }), {}),
  },
  {
    id: 4,
    name: "Support",
    users: 12,
    description: "View and respond to orders and reviews",
    color: "bg-amber-500",
    view: 8,
    viewTotal: 8,
    create: 0,
    createTotal: 8,
    edit: 4,
    editTotal: 8,
    delete: 0,
    deleteTotal: 8,
    permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: ["Orders", "Customers", "Reviews"].includes(m), create: false, edit: ["Orders", "Reviews"].includes(m), delete: false } }), {}),
  },
  {
    id: 5,
    name: "Viewer",
    users: 5,
    description: "Read-only access to dashboard and reports",
    color: "bg-gray-500",
    view: 6,
    viewTotal: 6,
    create: 0,
    createTotal: 6,
    edit: 0,
    editTotal: 6,
    delete: 0,
    deleteTotal: 6,
    permissions: MODULES.reduce((acc, m) => ({ ...acc, [m]: { view: ["Dashboard", "Orders", "Products", "Inventory", "Customers", "Logistics"].includes(m), create: false, edit: false, delete: false } }), {}),
  },
  {
    id: 6,
    name: "Custom Role",
    users: 3,
    description: "Custom access for Dinesh PVC Pipes operations",
    color: "bg-purple-600",
    view: 5,
    viewTotal: 12,
    create: 2,
    createTotal: 12,
    edit: 3,
    editTotal: 12,
    delete: 0,
    deleteTotal: 12,
    permissions: MODULES.reduce((acc, m, i) => ({ ...acc, [m]: { view: i < 6, create: i < 2, edit: i < 4, delete: false } }), {}),
  },
];

function countPerms(permissions) {
  let view = 0, create = 0, edit = 0, del = 0;
  MODULES.forEach((m) => {
    const p = permissions[m] || {};
    if (p.view) view++;
    if (p.create) create++;
    if (p.edit) edit++;
    if (p.delete) del++;
  });
  return { view, create, edit, delete: del };
}

export default function AdminPermissions() {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("permissions");
  const [viewingRoleId, setViewingRoleId] = useState(null);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editPermissions, setEditPermissions] = useState(null);

  useEffect(() => {
    Promise.all([rolesApi.getRoles(), usersApi.getUsers()])
      .then(([rolesData, usersData]) => {
        setRoles(rolesData);
        setUsers(usersData);
      })
      .finally(() => setDataLoading(false));
  }, []);
  const [userSearch, setUserSearch] = useState("");
  const [addUserOpen, setAddUserOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", phone: "", role: "Vendor", status: "Active" });

  const filteredUsers = useMemo(() => {
    const q = userSearch.toLowerCase().trim();
    return q
      ? users.filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            (u.phone || "").includes(q)
        )
      : users;
  }, [users, userSearch]);

  const openAddUser = () => {
    setEditingUserId(null);
    setUserForm({ name: "", email: "", password: "", phone: "", role: "Vendor", status: "Active" });
    setAddUserOpen(true);
  };

  const openEditUser = (u) => {
    setEditingUserId(u.id);
    setUserForm({ name: u.name, email: u.email, password: "", phone: u.phone || "", role: u.role, status: u.status });
    setAddUserOpen(true);
  };

  const closeUserModal = () => {
    setAddUserOpen(false);
    setEditingUserId(null);
    setUserForm({ name: "", email: "", password: "", phone: "", role: "Vendor", status: "Active" });
  };

  const saveUser = () => {
    const name = userForm.name.trim();
    const email = userForm.email.trim();
    const phone = userForm.phone.trim();
    const role = userForm.role;
    const status = userForm.status;
    if (!name || !email) return;
    if (!editingUserId && !userForm.password.trim()) return;

    const payload = { name, email, phone, role, status };
    if (editingUserId) {
      usersApi.updateUser(editingUserId, payload).then(setUsers).then(closeUserModal);
    } else {
      usersApi.createUser(payload).then(setUsers).then(closeUserModal);
    }
  };

  const deleteUser = (id) => {
    if (!window.confirm("Delete this user?")) return;
    usersApi.deleteUser(id).then(setUsers);
  };

  const totalRoles = roles.length;
  const totalUsers = roles.reduce((s, r) => s + r.users, 0);
  const customRoles = roles.filter((r) => r.name.includes("Custom") || !["Super Admin", "Vendor", "Manager", "Support", "Viewer"].includes(r.name)).length;

  const viewingRole = roles.find((r) => r.id === viewingRoleId);
  const editingRole = roles.find((r) => r.id === editingRoleId);

  const openEditRole = (role) => {
    setEditingRoleId(role.id);
    setViewingRoleId(null);
    setEditPermissions(JSON.parse(JSON.stringify(role.permissions)));
  };

  const closeEditRole = () => {
    setEditingRoleId(null);
    setEditPermissions(null);
  };

  const setEditPerm = (module, key, value) => {
    setEditPermissions((prev) => ({
      ...prev,
      [module]: { ...(prev[module] || {}), [key]: value },
    }));
  };

  const saveEditRole = () => {
    if (!editingRole || !editPermissions) return;
    const counts = countPerms(editPermissions);
    rolesApi
      .updateRolePermissions(editingRoleId, editPermissions, counts)
      .then(setRoles)
      .then(closeEditRole);
  };

  if (dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500">Loading roles and users…</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Roles & Permissions</h1>
        <p className="text-gray-500 text-sm mt-1">Manage user roles and access control.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-[#b30000]" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Roles</p>
            <p className="text-xl font-bold text-gray-800">{totalRoles}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Users</p>
            <p className="text-xl font-bold text-gray-800">{totalUsers}</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Custom Roles</p>
            <p className="text-xl font-bold text-gray-800">{customRoles}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-xl p-1 flex gap-1 w-fit">
        <button
          type="button"
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "permissions" ? "bg-white text-[#b30000] shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
        >
          <Shield className="w-4 h-4" /> Permissions
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${activeTab === "users" ? "bg-white text-[#b30000] shadow-sm" : "text-gray-600 hover:bg-gray-200"}`}
        >
          <Users className="w-4 h-4" /> User Management
        </button>
      </div>

      {activeTab === "permissions" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm flex flex-col">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${role.color} shrink-0`} />
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-800">{role.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                    <Users className="w-3.5 h-3.5" /> {role.users} users
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3">{role.description}</p>
              <div className="mt-4 space-y-1 text-sm text-gray-700">
                <p>View: {role.view}/{role.viewTotal}</p>
                <p>Create: {role.create}/{role.createTotal}</p>
                <p>Edit: {role.edit}/{role.editTotal}</p>
                <p>Delete: {role.delete}/{role.deleteTotal}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setViewingRoleId(role.id)}
                  className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-[#b30000] text-white text-sm font-medium hover:bg-[#8c0000]"
                >
                  View Permissions
                </button>
                <button
                  type="button"
                  onClick={() => openEditRole(role)}
                  className="inline-flex items-center justify-center p-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  aria-label="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
              />
            </div>
            <button
              type="button"
              onClick={openAddUser}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#b30000] text-white rounded-lg hover:bg-[#8c0000] transition-colors shrink-0"
            >
              <UserPlus className="w-5 h-5" />
              Add User
            </button>
          </div>
          <p className="text-sm text-gray-500">Showing {filteredUsers.length} of {users.length} users</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((u) => (
              <div key={u.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{u.name}</h3>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${u.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {u.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  {u.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>{u.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-gray-400 shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs font-medium">{u.role}</span>
                  </div>
                  {u.joinDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
                      <span>Joined {u.joinDate}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 flex gap-2">
                  <button type="button" onClick={() => openEditUser(u)} className="flex items-center gap-1.5 px-3 py-2 border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 text-sm">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button type="button" onClick={() => deleteUser(u.id)} className="flex items-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewingRole && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={() => setViewingRoleId(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${viewingRole.color} shrink-0`} />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">{viewingRole.name} Permissions</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{viewingRole.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-800">MODULE</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">VIEW</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">CREATE</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">EDIT</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((mod) => {
                    const p = viewingRole.permissions[mod] || { view: false, create: false, edit: false, delete: false };
                    return (
                      <tr key={mod} className="border-b border-gray-100">
                        <td className="py-2.5 px-3 font-medium text-gray-800">{mod}</td>
                        <td className="py-2.5 px-3 text-center">{p.view ? <Check className="w-5 h-5 text-green-600 inline" /> : <span className="text-gray-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center">{p.create ? <Check className="w-5 h-5 text-green-600 inline" /> : <span className="text-gray-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center">{p.edit ? <Check className="w-5 h-5 text-green-600 inline" /> : <span className="text-gray-300">—</span>}</td>
                        <td className="py-2.5 px-3 text-center">{p.delete ? <Check className="w-5 h-5 text-green-600 inline" /> : <span className="text-gray-300">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={() => setViewingRoleId(null)} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50">
                Close
              </button>
              <button type="button" onClick={() => openEditRole(viewingRole)} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">
                Edit Permissions
              </button>
            </div>
          </div>
        </>
      )}

      {editingRole && editPermissions && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeEditRole} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className={`w-8 h-8 rounded-lg ${editingRole.color} shrink-0`} />
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit {editingRole.name} Permissions</h2>
                  <p className="text-sm text-gray-500 mt-0.5">{editingRole.description}</p>
                </div>
              </div>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-3 font-semibold text-gray-800">MODULE</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">VIEW</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">CREATE</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">EDIT</th>
                    <th className="text-center py-3 px-3 font-semibold text-gray-800">DELETE</th>
                  </tr>
                </thead>
                <tbody>
                  {MODULES.map((mod) => {
                    const p = editPermissions[mod] || { view: false, create: false, edit: false, delete: false };
                    return (
                      <tr key={mod} className="border-b border-gray-100">
                        <td className="py-2.5 px-3 font-medium text-gray-800">{mod}</td>
                        <td className="py-2.5 px-3 text-center">
                          <input type="checkbox" checked={!!p.view} onChange={(e) => setEditPerm(mod, "view", e.target.checked)} className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input type="checkbox" checked={!!p.create} onChange={(e) => setEditPerm(mod, "create", e.target.checked)} className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input type="checkbox" checked={!!p.edit} onChange={(e) => setEditPerm(mod, "edit", e.target.checked)} className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <input type="checkbox" checked={!!p.delete} onChange={(e) => setEditPerm(mod, "delete", e.target.checked)} className="rounded border-gray-300 text-[#b30000] focus:ring-[#b30000]" />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={closeEditRole} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={saveEditRole} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {addUserOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" aria-hidden onClick={closeUserModal} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{editingUserId ? "Edit User" : "Add New User"}</h2>
              <button type="button" onClick={closeUserModal} className="p-1 rounded hover:bg-gray-100 text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  value={userForm.name}
                  onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={userForm.email}
                  onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editingUserId ? "(leave blank to keep)" : "*"}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={editingUserId ? "••••••••" : "Enter password"}
                    value={userForm.password}
                    onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
                  />
                  <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={userForm.phone}
                  onChange={(e) => setUserForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b30000] focus:border-[#b30000]"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.name}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUserForm((f) => ({ ...f, status: "Active" }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${userForm.status === "Active" ? "bg-[#b30000] text-white border-[#b30000]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                  >
                    <Check className="w-4 h-4" /> Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserForm((f) => ({ ...f, status: "Inactive" }))}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${userForm.status === "Inactive" ? "bg-[#b30000] text-white border-[#b30000]" : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
                  >
                    <X className="w-4 h-4" /> Inactive
                  </button>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
              <button type="button" onClick={closeUserModal} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button type="button" onClick={saveUser} className="px-4 py-2 rounded-lg bg-[#b30000] text-white font-medium hover:bg-[#8c0000]">
                Save
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
