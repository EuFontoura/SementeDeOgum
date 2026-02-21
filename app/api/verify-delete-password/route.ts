import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { password } = await request.json();
  const correctPassword = process.env.TEACHER_DELETE_PASSWORD;

  if (!correctPassword) {
    return NextResponse.json(
      { error: "Senha de exclusão não configurada no servidor." },
      { status: 500 }
    );
  }

  if (password !== correctPassword) {
    return NextResponse.json({ error: "Senha incorreta." }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
