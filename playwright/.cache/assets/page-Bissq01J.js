import { j as jsxRuntimeExports, N as Navbar, L as Link } from './navbar-BfL3QpIj.js';
import { r as reactExports } from './index-CkMvjITA.js';

const getStore = () => {
  const store = globalThis;
  if (typeof store.__signInCalls !== "number") {
    store.__signInCalls = 0;
  }
  return store;
};
const signIn = () => {
  const store = getStore();
  store.__signInCalls = (store.__signInCalls ?? 0) + 1;
  return Promise.resolve();
};
const __getSignInCalls = () => getStore().__signInCalls ?? 0;
const __resetSignInCalls = () => {
  getStore().__signInCalls = 0;
};

"use client";
function LoginPage() {
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  async function handleLogin() {
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Nepricakovana napaka");
      return;
    }
    window.location.href = "/";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-100", children: "Dobrodosli nazaj" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold md:text-4xl", children: "Prijava" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-blue-100 md:text-lg", children: "Dostopi do svojih obrokov, statistike in ciljev v eni prijavi." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Prijavi se v racun" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-300", children: "Vnesi e-posto in geslo ter nadaljuj." }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200", children: error }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "form",
          {
            className: "mt-6 space-y-4",
            onSubmit: (e) => e.preventDefault(),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "login-email",
                    className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                    children: "E-posta"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "login-email",
                    type: "email",
                    placeholder: "vnesi e-posto",
                    value: email,
                    onChange: (e) => setEmail(e.target.value),
                    className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "login-password",
                    className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                    children: "Geslo"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "login-password",
                    type: "password",
                    placeholder: "vnesi geslo",
                    value: password,
                    onChange: (e) => setPassword(e.target.value),
                    className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  type: "button",
                  onClick: handleLogin,
                  className: "w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700",
                  children: "Prijava"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-gray-200 dark:bg-gray-800" }),
            "ali",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-px flex-1 bg-gray-200 dark:bg-gray-800" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => signIn("google", { callbackUrl: "/" }),
              className: "w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-200 dark:hover:bg-gray-900",
              children: "Prijava z Googlom"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-center text-sm text-gray-500 dark:text-gray-400", children: [
            "Nimas racuna?",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Link,
              {
                href: "/register",
                className: "font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200",
                children: "Registracija"
              }
            )
          ] })
        ] })
      ] })
    ] }) })
  ] });
}

export { LoginPage as default };
//# sourceMappingURL=page-Bissq01J.js.map
