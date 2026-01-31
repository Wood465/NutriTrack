import { g as getDefaultExportFromCjs, r as reactExports } from './index-DGuZ2R34.js';

var jsxRuntime$2 = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	"use strict";
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var jsxRuntime$1 = jsxRuntime$2.exports;

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime$2.exports;
	hasRequiredJsxRuntime = 1;
	"use strict";
	if (true) {
	  jsxRuntime$2.exports = requireReactJsxRuntime_production();
	} else {
	  module.exports = require("./cjs/react-jsx-runtime.development.js");
	}
	return jsxRuntime$2.exports;
}

var jsxRuntimeExports = requireJsxRuntime();
const jsxRuntime = /*@__PURE__*/getDefaultExportFromCjs(jsxRuntimeExports);

function Link({ href, children, ...rest }) {
  const resolvedHref = typeof href === "string" ? href : "#";
  return /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: resolvedHref, ...rest, children });
}

const usePathname = () => "/profile";

"use client";
function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = reactExports.useState(null);
  const [open, setOpen] = reactExports.useState(false);
  const [theme, setTheme] = reactExports.useState("light");
  reactExports.useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);
  reactExports.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };
  const links = [
    { href: "/", label: "Domov" },
    { href: "/about", label: "O aplikaciji" },
    { href: "/meals", label: "Moji obroki" },
    { href: "/profile", label: "Profil" }
  ];
  return (
    // suppressHydrationWarning: ker temni nacin spreminja HTML class po mount-u,
    // lahko pride do hydration warninga (razlika med server/client renderjem).
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "sticky top-4 z-40", suppressHydrationWarning: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-6xl px-4 md:px-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-gray-200/70 bg-white/95 px-5 py-4 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight md:text-2xl", children: "NutriTrack" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 shadow-sm dark:border-gray-800 dark:text-gray-200 md:hidden",
            onClick: () => setOpen(!open),
            "aria-label": "Toggle menu",
            children: "Menu"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "hidden items-center gap-6 text-sm font-medium md:flex", children: [
          links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              href: link.href,
              className: `transition-colors hover:text-blue-600 ${pathname === link.href ? "text-blue-600" : "text-gray-700 dark:text-gray-200"}`,
              children: link.label
            }
          ) }, link.href)),
          user?.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              href: "/admin",
              className: `font-medium transition-colors hover:text-blue-600 ${pathname === "/admin" ? "text-blue-600" : "text-gray-700 dark:text-gray-200"}`,
              children: "Admin"
            }
          ) }),
          user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "ml-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-200", children: [
              "Zdravo, ",
              user.ime
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: async () => {
                  await fetch("/api/logout", { method: "POST" });
                  window.location.href = "/login";
                },
                className: "ml-2 rounded-full border border-red-200 px-3 py-1 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40",
                children: "Odjava"
              }
            ) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              href: "/login",
              className: "rounded-full border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40",
              children: "Prijava"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "ml-2 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: toggleTheme,
              className: "rounded-full border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800",
              children: theme === "light" ? "Dark mode" : "Light mode"
            }
          ) })
        ] })
      ] }),
      open && /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 border-t border-gray-200 pt-4 text-sm dark:border-gray-800 md:hidden", children: [
        links.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            href: link.href,
            onClick: () => setOpen(false),
            className: `block rounded-md px-2 py-1 transition-colors ${pathname === link.href ? "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-200" : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"}`,
            children: link.label
          }
        ) }, link.href)),
        user?.role === "admin" && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            href: "/admin",
            onClick: () => setOpen(false),
            className: "block rounded-md px-2 py-1 text-blue-700 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-950/40",
            children: "Admin"
          }
        ) }),
        user ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "text-gray-700 dark:text-gray-200", children: [
            "Zdravo, ",
            user.ime
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: async () => {
                await fetch("/api/logout", { method: "POST" });
                window.location.href = "/login";
              },
              className: "rounded-md border border-red-200 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40",
              children: "Odjava"
            }
          ) })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            href: "/login",
            className: "rounded-md border border-blue-200 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-950/40",
            children: "Prijava"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            type: "button",
            onClick: toggleTheme,
            className: "rounded-md border border-gray-200 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800",
            children: theme === "light" ? "Dark mode" : "Light mode"
          }
        ) })
      ] })
    ] }) }) })
  );
}

const navbar = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: Navbar
}, Symbol.toStringTag, { value: 'Module' }));

export { Link as L, Navbar as N, jsxRuntimeExports as j, navbar as n };
//# sourceMappingURL=navbar-BNoPslg0.js.map
