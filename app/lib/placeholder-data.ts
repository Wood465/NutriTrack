const users = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    ime: "Jan",
    priimek: "Lesjak",
    email: "jan@example.com",
    password: "geslo123"
  },
];

const meals = [
  {
    id: "22222222-2222-2222-2222-222222222222",
    user_id: "11111111-1111-1111-1111-111111111111",
    naziv: "Piščanec z rižem",
    kalorije: 650,
    beljakovine: 45,
    ogljikovi_hidrati: 70,
    mascobe: 10,
    cas: "2025-01-01T12:00:00Z"
  },
];


export { users, meals };
