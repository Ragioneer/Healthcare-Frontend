import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const referer = request.headers.get("referer") || "";
  const clientParam = url.searchParams.get("client");
  const existingClient = request.cookies.get("client")?.value;

  const response = NextResponse.next();

  let client = clientParam?.toLowerCase();

  if (!client) {
    client = referer.includes("nudii.com")
      ? "nudii"
      : referer.includes("mefia.com")
      ? "mefIA"
      : existingClient;
  }

  if (client) {
    console.log("Setting client to:", client);
    response.cookies.set("client", client, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}
