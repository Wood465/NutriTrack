"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState("");

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

  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const list = await res.json();
      setUsers(list);
    } catch {
      setError("Could not load users");
    }
  }

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

  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "POST",
      body: JSON.stringify({ role: newRole }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setUsers(users.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
    } else {
      alert("Role update failed");
    }
  }

  if (loading) {
    return (
      <main className="relative min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
          <p className="text-slate-600">Loading admin panel...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
          <p className="text-red-600">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen bg-slate-50 text-slate-900">
      <div className="pointer-events-none absolute -top-32 right-0 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />

      <Navbar />

      <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-12">
        <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 px-6 py-10 text-white shadow-2xl shadow-blue-200/70 md:px-10 md:py-14">
          <div className="pointer-events-none absolute -left-16 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-blue-100">
              Admin
            </div>
            <h1 className="text-3xl font-semibold md:text-5xl">Admin Panel</h1>
            <p className="text-blue-100">
              Upravljaj uporabnike, njihove vloge in dostop do aplikacije.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">Uporabniki</h2>
            <span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              {users.length} skupaj
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-100 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Vloga</th>
                  <th className="px-4 py-3">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t border-slate-200">
                    <td className="px-4 py-3 text-slate-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          className="rounded-full border border-blue-200 px-3 py-1 text-xs font-medium text-blue-700 transition hover:bg-blue-50"
                        >
                          {u.role === "admin" ? "Make User" : "Make Admin"}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="rounded-full border border-rose-200 px-3 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
