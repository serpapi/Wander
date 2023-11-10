import { NextResponse } from "next/server";
import { createSessionCookie, getSession } from "../session";

export async function GET() {
  const session = await getSession()
  if (session) return NextResponse.json(session, { status: 200 })

  const sessionCookie = await createSessionCookie()
  return new NextResponse("OK", { 
    status: 200,
    headers: { 'Set-Cookie': sessionCookie }
  })
}