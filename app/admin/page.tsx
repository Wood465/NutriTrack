"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/app/ui/navbar";

export default function AdminPage() {
  const router = useRouter();

  // UI stanje
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Podatki
  const [users, setUsers] = useState<any[]>([]);

  // Ko se stran odpre:
  // 1) preveri, če je uporabnik admin
  // 2) če ni admin -> preusmeri domov
  // 3) če je admin -> naloži uporabnike
  useEffect(() => {
    (async () => {
      try {
        setError("");

        const sessionRes = await fetch("/api/session");
        const session = await sessionRes.json();

        // Če ni prijavljen ali ni admin, nima dostopa do te strani
        if (!session.user || session.user.role !== "admin") {
          router.push("/");
          return;
        }

        // Naloži seznam uporabnikov
        const usersRes = await fetch("/api/admin/users");
        const list = await usersRes.json();
        setUsers(list);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  // Izbriše uporabnika in ga odstrani iz seznama (če API uspe)
  async function deleteUser(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, { method: "POST" });

    if (!res.ok) return alert("Delete failed");

    // Posodobi UI (varno: uporabi prev state)
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // Preklopi vlogo uporabnika: admin <-> user
  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) return alert("Role update failed");

    // Posodobi UI (varno: uporabi prev state)
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
    );
  }

  // Loading stanje
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

  // Error stanje
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

  // Glavni UI (CSS pusti enak)
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

                {/* Če ni uporabnikov, pokaži sporočilo */}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-6 text-slate-500">
                      Ni uporabnikov za prikaz.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
