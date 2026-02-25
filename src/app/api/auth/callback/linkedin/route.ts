import { NextRequest, NextResponse } from "next/server";
import { OAUTH_CONFIG, getAppUrl } from "@/lib/oauth";
import { cookies } from "next/headers";
import { fetchMutation } from "convex/nextjs";
import { api } from "../../../../../../convex/_generated/api";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { auth } from "@clerk/nextjs/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  const cookieStore = await cookies();
  const savedState = cookieStore.get("oauth_state")?.value;
  const workspaceIdStr = cookieStore.get("oauth_workspace_id")?.value;

  if (error) {
    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&error=${error}`,
    );
  }

  if (
    !code ||
    !state ||
    !savedState ||
    state !== savedState ||
    !workspaceIdStr
  ) {
    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&error=invalid_state`,
    );
  }

  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "LinkedIn credentials not configured" },
      { status: 500 },
    );
  }

  const redirectUri = `${getAppUrl(req)}/api/auth/callback/linkedin`;

  try {
    const tokenRes = await fetch(OAUTH_CONFIG.linkedin.tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: clientSecret,
      }),
    });

    if (!tokenRes.ok) throw new Error("Failed to get token");

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const expiresIn = tokenData.expires_in;
    const tokenExpiresAt = Date.now() + expiresIn * 1000;

    const profileRes = await fetch(OAUTH_CONFIG.linkedin.profileUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) throw new Error("Failed to get profile");

    const profileData = await profileRes.json();
    const platformAccountId = profileData.sub;
    const displayName = `${profileData.given_name} ${profileData.family_name}`;
    const avatarUrl = profileData.picture;

    const { getToken } = await auth();
    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) throw new Error("No auth token");

    await fetchMutation(
      api.accounts.connectAccount,
      {
        workspaceId: workspaceIdStr as Id<"workspaces">,
        platform: "linkedin",
        platformAccountId,
        handle: displayName,
        displayName,
        avatarUrl,
        accessToken,
        tokenExpiresAt,
        scopes: OAUTH_CONFIG.linkedin.scopes.join(" "),
      },
      { token: convexToken },
    );

    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&connected=linkedin`,
    );
  } catch (err) {
    console.error("LinkedIn OAuth Error:", err);
    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&error=oauth_failed`,
    );
  }
}
