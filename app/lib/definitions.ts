export type User = {
  id: string;
  ime: string;
  priimek: string;
  email: string;
  password_hash: string;
};

export type Meal = {
  id: string;
  user_id: string;
  naziv: string;
  kalorije: number;
  energijska_vrednost: number;
  cas: string;
};
