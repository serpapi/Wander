import { NextResponse } from "next/server";
import { getAnswer } from "../intelligent";

export async function POST(request) {
  const data = await request.json();
  const answer = await getAnswer(data.message)
  return NextResponse.json({ message: answer }, { status: 200 })
}
