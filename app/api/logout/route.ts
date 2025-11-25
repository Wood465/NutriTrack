import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ success: true });

  // odstrani session cookie
  res.cookies.set("session", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0) // takoj poteče
  });

  return res;
}
