import { NextResponse } from "next/server";

/** Standard API envelope for the route-handler backend (matches ApiResult<T>). */
export function ok<T>(data: T) {
  return NextResponse.json({ data, demo: true, generatedAt: new Date().toISOString() });
}

export function notFound(message = "Not found") {
  return NextResponse.json({ error: message }, { status: 404 });
}

export function badRequest(message = "Bad request") {
  return NextResponse.json({ error: message }, { status: 400 });
}
