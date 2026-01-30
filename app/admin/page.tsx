"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");

  // 1. Preveri, ali je admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
          router.push("/");
          return;
        }

        setUser(data.user);
        await loadUsers();
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  // 2. Naloži seznam uporabnikov
  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const list = await res.json();
      setUsers(list);
    } catch {
      setError("Could not load users");
    }
  }

  // 3. Brisanje uporabnika
  async function deleteUser(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  // 4. Spremeni role
  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "POST",
      body: JSON.stringify({ role: newRole }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setUsers(
        users.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } else {
      alert("Role update failed");
    }
  }

  if (loading) return <p className="p-6">Loading admin panel...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="overflow-x-auto rounded border shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3 space-x-3">
                  <button
                    onClick={() => toggleRole(u.id, u.role)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    {u.role === "admin" ? "Make User" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}

