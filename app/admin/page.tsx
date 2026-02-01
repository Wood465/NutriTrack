"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * ADMIN PAGE (Admin Panel)
 *
 * Namen strani:
 * - To je skrbniška (admin) stran za upravljanje uporabnikov.
 * - Ob nalaganju strani najprej preverimo sejo (/api/session).
 *   - Ce uporabnik NI prijavljen ali NI admin -> preusmerimo na "/".
 *   - Ce JE admin -> nalozimo seznam vseh uporabnikov (/api/admin/users).
 *
 * Funkcije na strani:
 * - Prikaz tabele uporabnikov (email + role).
 * - Sprememba role (admin <-> user).
 * - Brisanje uporabnika.
 *
 * Pomembno:
 * - loading: dokler se preverja seja in nalagajo podatki.
 * - error: ce pride do napake pri fetch-u.
 */

export default function AdminPage() {
  const router = useRouter();

  // loading: dokler se preverja dostop (admin) in nalagajo uporabniki
  const [loading, setLoading] = useState(true);

  // user: trenutno prijavljen uporabnik (rabimo predvsem za preverjanje role)
  const [user, setUser] = useState<any>(null);

  // users: seznam vseh uporabnikov, ki jih admin vidi v tabeli
  const [users, setUsers] = useState<any[]>([]);

  // error: sporocilo, ce pride do napake (prikazemo ga namesto tabele)
  const [error, setError] = useState("");

  /**
   * 1) Preverjanje avtentikacije in admin pravic
   * - poklice /api/session
   * - ce ni admin: redirect na domov
   * - ce je admin: nalozi uporabnike
   */
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const res = await fetch("/api/session");
        const data = await res.json();

        // Varnost: samo admin sme videti admin panel
        if (!data.user || data.user.role !== "admin") {
          router.push("/");
          return;
        }

        setUser(data.user);

        // Ko potrdimo admin dostop, nalozimo seznam uporabnikov
        await loadUsers();
      } catch {
        setError("Failed to load data");
      } finally {
        // Ne glede na rezultat koncamo loading (da UI ne ostane "zmrznjen")
        setLoading(false);
      }
    }

    checkAuthAndLoad();
  }, [router]);

  /**
   * 2) Nalozi seznam vseh uporabnikov
   * - GET /api/admin/users
   * - rezultat shranimo v state "users" in ga prikazemo v tabeli
   */
  async function loadUsers() {
    try {
      const res = await fetch("/api/admin/users");
      const list = await res.json();
      setUsers(list);
    } catch {
      setError("Could not load users");
    }
  }

  /**
   * 3) Brisanje uporabnika
   * - POST /api/admin/users/:id
   * - ce uspe: odstranimo uporabnika iz state, da se tabela takoj posodobi (brez reload-a)
   */
  async function deleteUser(id: string) {
    const res = await fetch(`/api/admin/users/${id}`, {
      method: "POST",
    });

    if (res.ok) {
      // DRY / UX: takoj posodobimo UI tako, da odstranimo uporabnika iz seznama
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } else {
      alert("Delete failed");
    }
  }

  /**
   * 4) Menjava role (admin <-> user)
   * - POST /api/admin/users/:id/role z body { role: newRole }
   * - ce uspe: posodobimo role samo pri tem uporabniku v state "users"
   */
  async function toggleRole(id: string, currentRole: string) {
    const newRole = currentRole === "admin" ? "user" : "admin";

    const res = await fetch(`/api/admin/users/${id}/role`, {
      method: "POST",
      body: JSON.stringify({ role: newRole }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      // Posodobimo samo uporabnika s tem id-jem, ostali ostanejo enaki
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } else {
      alert("Role update failed");
    }
  }

  // UI stanja: loading / error / prikaz admin tabele
  if (loading) return <p className="p-6">Loading admin panel...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <main className="p-6">
      <h1 className="mb-6 text-3xl font-bold">Admin Panel</h1>

      {/* Tabela vseh uporabnikov */}
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

                {/* Akcije: sprememba role in brisanje */}
                <td className="space-x-3 p-3">
                  <button
                    onClick={() => toggleRole(u.id, u.role)}
                    className="rounded bg-blue-500 px-3 py-1 text-white"
                  >
                    {u.role === "admin" ? "Make User" : "Make Admin"}
                  </button>

                  <button
                    onClick={() => deleteUser(u.id)}
                    className="rounded bg-red-500 px-3 py-1 text-white"
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
