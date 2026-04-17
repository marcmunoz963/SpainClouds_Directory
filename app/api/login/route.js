import { NextResponse } from "next/server";

export async function POST(request) {
  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL || "admin@spainclouds.local";
  const validPassword = process.env.ADMIN_PASSWORD || "cambia-esta-password";

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ ok: false, error: "Credenciales incorrectas." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("spainclouds_admin_auth", "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
