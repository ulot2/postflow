import { NextRequest, NextResponse } from "next/server";
import { OAUTH_CONFIG, generateState, getAppUrl } from "@/lib/oauth";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get("workspaceId");
  if (!workspaceId) {
    return NextResponse.json(
      { error: "workspaceId is required" },
      { status: 400 },
    );
  }

  const state = generateState();
  const cookieStore = await cookies();
  cookieStore.set("oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });
  cookieStore.set("oauth_workspace_id", workspaceId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: "LinkedIn client ID not configured" },
      { status: 500 },
    );
  }

  const redirectUri = `${getAppUrl(req)}/api/auth/callback/linkedin`;

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    scope: OAUTH_CONFIG.linkedin.scopes.join(" "),
  });

  return NextResponse.redirect(
    `${OAUTH_CONFIG.linkedin.authUrl}?${params.toString()}`,
  );
}
