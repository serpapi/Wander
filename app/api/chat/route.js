import { NextResponse } from "next/server";
import { addQuestion, getMessages } from "../intelligent";

export async function POST(request) {
  const data = await request.json();
  const messages = await addQuestion(data.message)
  return NextResponse.json({ messages }, { status: 200 })
}

export async function GET(request) {
  const messages = await getMessages()
  return NextResponse.json({ messages }, { status: 200 })
}