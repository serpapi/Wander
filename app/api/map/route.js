import { searchById } from "../search_api"
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const placeId = searchParams.get('placeId')
  const results = await searchById(placeId)
  return NextResponse.json(results, { status: 200 })
}