import { j as jsxRuntimeExports, N as Navbar, L as Link } from './navbar-CrM7jzyw.js';
import { r as reactExports } from './index-CyJl5tEP.js';

"use client";
function ProfilePage() {
  const [avatarKey, setAvatarKey] = reactExports.useState(0);
  const [avatarSrc, setAvatarSrc] = reactExports.useState(`/api/profile/avatar/view?key=0`);
  const defaultAvatarSrc = "/avatar-default.svg";
  const [user, setUser] = reactExports.useState(null);
  const [averageCalories, setAverageCalories] = reactExports.useState(null);
  const [loggedDays, setLoggedDays] = reactExports.useState(null);
  reactExports.useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);
  reactExports.useEffect(() => {
    if (!user) return;
    async function loadStats() {
      const res = await fetch(`/api/meals?user_id=${user.id}`, {
        cache: "no-store"
      });
      const meals = await res.json();
      if (meals.length === 0) {
        setAverageCalories(0);
        setLoggedDays(0);
        return;
      }
      const totalCalories = meals.reduce(
        (sum, meal) => sum + parseFloat(meal.kalorije || 0),
        0
      );
      const uniqueDays = new Set(
        meals.map((m) => new Date(m.cas).toISOString().slice(0, 10))
      );
      setLoggedDays(uniqueDays.size);
      setAverageCalories(Math.round(totalCalories / uniqueDays.size));
    }
    loadStats();
  }, [user]);
  reactExports.useEffect(() => {
    setAvatarSrc(`/api/profile/avatar/view?key=${avatarKey}`);
  }, [avatarKey]);
  async function uploadAvatar(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/profile/avatar", {
      method: "POST",
      body: formData
    });
    if (res.ok) {
      setAvatarKey(Date.now());
    } else {
      alert("Upload ni uspel");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-100", children: "Profil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold md:text-4xl", children: "Tvoj racun" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-blue-100 md:text-lg", children: "Uredi podatke in spremljaj povprecje vnosa." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.2fr_0.8fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Osebni podatki" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-2 text-sm text-gray-700 dark:text-gray-300", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Ime:" }),
              " ",
              user?.ime ?? "--"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "Priimek:" }),
              " ",
              user?.priimek ?? "--"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-gray-900 dark:text-gray-100", children: "E-posta:" }),
              " ",
              user?.email ?? "--"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: avatarSrc,
                alt: "Profilna slika",
                className: "h-20 w-20 rounded-full border border-gray-200 object-cover dark:border-gray-800",
                onError: () => {
                  if (avatarSrc !== defaultAvatarSrc) {
                    setAvatarSrc(defaultAvatarSrc);
                  }
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "cursor-pointer rounded-full border border-blue-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700 transition hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40", children: [
              "Spremeni sliko",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  type: "file",
                  name: "avatar",
                  accept: "image/*",
                  className: "hidden",
                  onChange: uploadAvatar
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                href: "/profile/change-password",
                className: "rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-700 transition hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800",
                children: "Spremeni geslo"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Statistika" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400", children: "Povprecen dnevni vnos" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100", children: averageCalories !== null ? `${averageCalories} kcal` : "Nalaganje..." })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gray-200/70 bg-white/95 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/80", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400", children: "Zabelezeni dnevi" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100", children: loggedDays !== null ? loggedDays : "Nalaganje..." })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] });
}

export { ProfilePage as default };
//# sourceMappingURL=page-DYjXTQhw.js.map
