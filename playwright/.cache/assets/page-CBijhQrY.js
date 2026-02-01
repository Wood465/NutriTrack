import { j as jsxRuntimeExports, N as Navbar } from './navbar-BfL3QpIj.js';
import { r as reactExports } from './index-CkMvjITA.js';

"use client";
function MealsPage() {
  const [meals, setMeals] = reactExports.useState([]);
  const [name, setName] = reactExports.useState("");
  const [calories, setCalories] = reactExports.useState("0");
  const [note, setNote] = reactExports.useState("");
  const [protein, setProtein] = reactExports.useState("0");
  const [carbs, setCarbs] = reactExports.useState("0");
  const [fat, setFat] = reactExports.useState("0");
  const [user, setUser] = reactExports.useState(null);
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editName, setEditName] = reactExports.useState("");
  const [editCalories, setEditCalories] = reactExports.useState("0");
  const [editProtein, setEditProtein] = reactExports.useState("0");
  const [editCarbs, setEditCarbs] = reactExports.useState("0");
  const [editFat, setEditFat] = reactExports.useState("0");
  reactExports.useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/session", { cache: "no-cache" });
      const data = await res.json();
      setUser(data.user);
    }
    loadUser();
  }, []);
  reactExports.useEffect(() => {
    if (!user) return;
    async function loadMeals() {
      const res = await fetch(`/api/meals?user_id=${user.id}`);
      const data = await res.json();
      setMeals(data);
    }
    loadMeals();
  }, [user]);
  const handleDeleteMeal = async (id) => {
    const ok = confirm("Res zelis izbrisati ta obrok?");
    if (!ok) return;
    const res = await fetch(`/api/meals/${id}`, {
      method: "DELETE"
    });
    if (!res.ok) {
      alert("Brisanje ni uspelo");
      return;
    }
    setMeals((prev) => prev.filter((m) => m.id !== id));
  };
  const handleStartEdit = (meal) => {
    setEditingId(meal.id);
    setEditName(meal.naziv ?? "");
    setEditCalories(String(meal.kalorije ?? 0));
    setEditProtein(String(meal.beljakovine ?? 0));
    setEditCarbs(String(meal.ogljikovi_hidrati ?? 0));
    setEditFat(String(meal.mascobe ?? 0));
  };
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditCalories("0");
    setEditProtein("0");
    setEditCarbs("0");
    setEditFat("0");
  };
  const handleSaveEdit = async (id) => {
    if (!user?.id) {
      alert("Uporabnik ni prijavljen ali seja ni nalozena.");
      return;
    }
    if (!editName.trim() || !editCalories.trim()) return;
    const parsedCalories = Number(editCalories);
    const parsedProtein = Number(editProtein);
    const parsedCarbs = Number(editCarbs);
    const parsedFat = Number(editFat);
    if (!Number.isFinite(parsedCalories) || !Number.isFinite(parsedProtein) || !Number.isFinite(parsedCarbs) || !Number.isFinite(parsedFat) || parsedCalories < 0 || parsedProtein < 0 || parsedCarbs < 0 || parsedFat < 0) {
      alert("Vrednosti ne smejo biti negativne.");
      return;
    }
    const res = await fetch(`/api/meals/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        naziv: editName,
        kalorije: parsedCalories || 0,
        beljakovine: parsedProtein || 0,
        ogljikovi_hidrati: parsedCarbs || 0,
        mascobe: parsedFat || 0
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const fields = Array.isArray(err?.fields) && err.fields.length > 0 ? ` (${err.fields.join(", ")})` : "";
      alert(`${err?.error || "Urejanje ni uspelo"}${fields}`);
      return;
    }
    const updated = await res.json();
    setMeals(
      (prev) => prev.map((m) => m.id === updated.id ? updated : m)
    );
    handleCancelEdit();
  };
  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      alert("Uporabnik ni prijavljen ali seja ni nalozena.");
      return;
    }
    if (!name.trim() || !calories.trim()) return;
    const parsedCalories = Number(calories);
    const parsedProtein = Number(protein);
    const parsedCarbs = Number(carbs);
    const parsedFat = Number(fat);
    if (!Number.isFinite(parsedCalories) || !Number.isFinite(parsedProtein) || !Number.isFinite(parsedCarbs) || !Number.isFinite(parsedFat) || parsedCalories < 0 || parsedProtein < 0 || parsedCarbs < 0 || parsedFat < 0) {
      alert("Vrednosti ne smejo biti negativne.");
      return;
    }
    const newMeal = {
      user_id: user.id,
      naziv: name,
      kalorije: parsedCalories || 0,
      beljakovine: parsedProtein || 0,
      ogljikovi_hidrati: parsedCarbs || 0,
      mascobe: parsedFat || 0,
      note
    };
    const res = await fetch("/api/meals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeal)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const fields = Array.isArray(err?.fields) && err.fields.length > 0 ? ` (${err.fields.join(", ")})` : "";
      alert(`${err?.error || "Dodajanje ni uspelo"}${fields}`);
      return;
    }
    const saved = await res.json();
    if (!saved || saved.id == null) {
      alert("Obrok ni bil shranjen pravilno (manjka id).");
      return;
    }
    setMeals((prev) => [saved, ...prev]);
    setName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
    setNote("");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Navbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl space-y-10 px-4 pb-16 pt-10 md:px-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "rounded-3xl border border-blue-200/50 bg-gradient-to-br from-blue-600 via-blue-500 to-sky-500 p-8 text-white shadow-lg md:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold uppercase tracking-wide text-blue-100", children: "Moji obroki" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-semibold md:text-4xl", children: "Dodaj obrok in spremljaj vnos" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base text-blue-100 md:text-lg", children: "Hitro zabelezi kalorije in makro hranila ter imej vse na enem mestu." })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "grid gap-6 lg:grid-cols-[1.1fr_1.4fr]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Dodaj nov obrok" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-gray-600 dark:text-gray-300", children: "Vnesi ime, kalorije in dodatne podatke." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleAddMeal, className: "mt-6 space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "name",
                  className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                  children: "Ime obroka"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "name",
                  type: "text",
                  placeholder: "npr. Zajtrk",
                  value: name,
                  onChange: (e) => setName(e.target.value),
                  className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "calories",
                  className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                  children: "Kalorije"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "calories",
                  type: "number",
                  min: 0,
                  placeholder: "npr. 350",
                  value: calories,
                  onChange: (e) => setCalories(e.target.value),
                  className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "protein",
                    className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                    children: "Beljakovine (g)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "protein",
                    type: "number",
                    min: 0,
                    value: protein,
                    onChange: (e) => setProtein(e.target.value),
                    className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "carbs",
                    className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                    children: "Ogljikovi hidrati (g)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "carbs",
                    type: "number",
                    min: 0,
                    value: carbs,
                    onChange: (e) => setCarbs(e.target.value),
                    className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "label",
                  {
                    htmlFor: "fat",
                    className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                    children: "Mascobe (g)"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    id: "fat",
                    type: "number",
                    min: 0,
                    value: fat,
                    onChange: (e) => setFat(e.target.value),
                    className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "label",
                {
                  htmlFor: "note",
                  className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                  children: "Opis (neobvezno)"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "textarea",
                {
                  id: "note",
                  placeholder: "kratek opis obroka",
                  value: note,
                  onChange: (e) => setNote(e.target.value),
                  className: "mt-2 block min-h-[110px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                disabled: !user?.id,
                className: "w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700",
                children: "Dodaj obrok"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-gray-200/70 bg-white/95 p-6 shadow-sm backdrop-blur dark:border-gray-800/70 dark:bg-gray-900/80 md:p-8", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-gray-900 dark:text-gray-100", children: "Dodani obroki" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-950/40 dark:text-blue-200", children: [
              meals.length,
              " skupaj"
            ] })
          ] }),
          meals.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400", children: "Se ni dodanih obrokov. Dodaj prvega in zacni spremljati vnos." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 space-y-4", children: meals.map((meal, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "li",
            {
              className: "rounded-2xl border border-gray-200/70 bg-white/90 p-4 shadow-sm dark:border-gray-800/70 dark:bg-gray-900/60",
              children: editingId === meal.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: `edit-name-${meal.id}`,
                      className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                      children: "Ime obroka"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: `edit-name-${meal.id}`,
                      type: "text",
                      value: editName,
                      onChange: (e) => setEditName(e.target.value),
                      className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "label",
                    {
                      htmlFor: `edit-calories-${meal.id}`,
                      className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                      children: "Kalorije"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      id: `edit-calories-${meal.id}`,
                      type: "number",
                      min: 0,
                      value: editCalories,
                      onChange: (e) => setEditCalories(e.target.value),
                      className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `edit-protein-${meal.id}`,
                        className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                        children: "Beljakovine (g)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `edit-protein-${meal.id}`,
                        type: "number",
                        min: 0,
                        value: editProtein,
                        onChange: (e) => setEditProtein(e.target.value),
                        className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `edit-carbs-${meal.id}`,
                        className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                        children: "Ogljikovi hidrati (g)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `edit-carbs-${meal.id}`,
                        type: "number",
                        min: 0,
                        value: editCarbs,
                        onChange: (e) => setEditCarbs(e.target.value),
                        className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "label",
                      {
                        htmlFor: `edit-fat-${meal.id}`,
                        className: "block text-sm font-medium text-gray-700 dark:text-gray-200",
                        children: "Mascobe (g)"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: `edit-fat-${meal.id}`,
                        type: "number",
                        min: 0,
                        value: editFat,
                        onChange: (e) => setEditFat(e.target.value),
                        className: "mt-2 block w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => handleSaveEdit(meal.id),
                      className: "rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold text-white transition hover:bg-blue-700",
                      children: "Shrani"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: handleCancelEdit,
                      className: "rounded-full border border-gray-200 px-4 py-1 text-xs font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800",
                      children: "Preklici"
                    }
                  )
                ] })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: meal.naziv }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-300", children: [
                      meal.kalorije,
                      " kcal"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleStartEdit(meal),
                        className: "rounded-full border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600 transition hover:bg-blue-50 dark:border-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-950/40",
                        children: "Uredi"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        onClick: () => handleDeleteMeal(meal.id),
                        className: "rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-300 dark:hover:bg-red-950/40",
                        children: "Izbrisi"
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Beljakovine: ",
                    meal.beljakovine,
                    " g"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Ogljikovi hidrati: ",
                    meal.ogljikovi_hidrati,
                    " g"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                    "Mascobe: ",
                    meal.mascobe,
                    " g"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs uppercase tracking-wide text-gray-400", children: [
                  "Cas vnosa: ",
                  new Date(meal.cas).toLocaleString()
                ] }),
                meal.note && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-gray-600 dark:text-gray-300", children: [
                  "Opis: ",
                  meal.note
                ] })
              ] })
            },
            meal.id ?? `${meal.naziv}-${meal.cas ?? "no-date"}-${index}`
          )) })
        ] })
      ] })
    ] })
  ] });
}

export { MealsPage as default };
//# sourceMappingURL=page-CBijhQrY.js.map
