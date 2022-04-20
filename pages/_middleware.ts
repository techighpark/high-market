import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (req.ua?.isBot) {
    return new Response("Please don't be a Bot. Be Human.", { status: 403 });
  }

  // if (!req.url.includes("/api")) {
  //   if (!req.url.includes("/enter") && !req.cookies.highsession) {
  //     const url = req.nextUrl.clone();
  //     url.pathname = "/enter";
  //     return NextResponse.redirect(url);
  //   }
  // }
}
