import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Retrieve cookies from the request
  const accessToken = req.cookies.get("sb-access-token")?.value;
  const refreshToken = req.cookies.get("sb-refresh-token")?.value;

  // Log the tokens for debugging
  console.log("Middleware accessToken:", accessToken);
  console.log("Middleware refreshToken:", refreshToken);

  if (pathname.startsWith("/admin")) {
    if (!accessToken) {
      // If no access token, redirect to /auth
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    // Set the session manually in the Supabase client
    const {
      data: { session },
      error,
    } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    // Log detailed session information
    console.log("Middleware session:", session);
    console.log("Middleware error:", error);

    // If no session, redirect to /auth
    if (!session) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
