import { j as jsxRuntimeExports, N as Navbar, L as Link } from './navbar-CE9i2Bom.js';
import { r as reactExports } from './index-k9ZEjys9.js';

"use client";
function RegisterPage() {
  const [ime, setIme] = reactExports.useState("");
  const [priimek, setPriimek] = reactExports.useState("");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState("");
  const [error, setError] = reactExports.useState("");
  const [success, setSuccess] = reactExports.useState("");
  async function handleRegister() {
    setError("");
    setSuccess("");
    if (password !== confirm) {
      setError("Gesli se ne ujemata.");
      return;
    }
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ime,
        priimek,
        email,
        password
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Napaka pri registraciji.");
      return;
    }
    setSuccess("Registracija uspesna. Preusmerjam...");
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 pb-16 pt-10 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.1fr_0.9fr]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-100", children: "Ustvari racun" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold md:text-4xl", children: "Registracija" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-blue-100 md:text-lg", children: "Pridruzi se in zacni spremljati obroke ter napredek." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Ustvari nov racun" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-300", children: "Izpolni podatke in potrdi registracijo." }),
        error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-950/40 dark:text-red-200", children: error }),
        success && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-900/40 dark:bg-green-950/40 dark:text-green-200", children: success }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-6 space-y-4", onSubmit: (e) => e.preventDefault(), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "register-ime",
                className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                children: "Ime"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "register-ime",
                type: "text",
                value: ime,
                onChange: (e) => setIme(e.target.value),
                className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900",
                placeholder: "vnesi ime"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "register-priimek",
                className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                children: "Priimek"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "register-priimek",
                type: "text",
                value: priimek,
                onChange: (e) => setPriimek(e.target.value),
                className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900",
                placeholder: "vnesi priimek"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "register-email",
                className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                children: "E-posta"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "register-email",
                type: "email",
                value: email,
                onChange: (e) => setEmail(e.target.value),
                className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900",
                placeholder: "vnesi e-posto"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "register-password",
                className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                children: "Geslo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "register-password",
                type: "password",
                value: password,
                onChange: (e) => setPassword(e.target.value),
                className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900",
                placeholder: "vnesi geslo"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                htmlFor: "register-confirm",
                className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                children: "Potrdi geslo"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "register-confirm",
                type: "password",
                value: confirm,
                onChange: (e) => setConfirm(e.target.value),
                className: "mt-2 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900",
                placeholder: "ponovno vnesi geslo"
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: handleRegister,
              className: "w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700",
              children: "Registracija"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-6 text-center text-sm text-gray-500 dark:text-gray-400", children: [
          "Ze imas racun?",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              href: "/login",
              className: "font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-300 dark:hover:text-blue-200",
              children: "Prijava"
            }
          )
        ] })
      ] })
    ] }) })
  ] });
}

export { RegisterPage as default };
//# sourceMappingURL=page-DZ4RanT0.js.map
