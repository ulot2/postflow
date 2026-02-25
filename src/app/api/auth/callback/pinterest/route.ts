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

  const clientId = process.env.PINTEREST_APP_ID;
  const clientSecret = process.env.PINTEREST_APP_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "Pinterest credentials not configured" },
      { status: 500 },
    );
  }

  const redirectUri = `${getAppUrl(req)}/api/auth/callback/pinterest`;

  try {
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString(
      "base64",
    );

    const tokenRes = await fetch(OAUTH_CONFIG.pinterest.tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${authHeader}`,
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenRes.ok) throw new Error("Failed to get token");

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;
    const expiresIn = tokenData.expires_in;
    const tokenExpiresAt = Date.now() + expiresIn * 1000;

    const profileRes = await fetch(OAUTH_CONFIG.pinterest.profileUrl, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) throw new Error("Failed to get profile");

    const profileData = await profileRes.json();
    // Use username as unique account identifier and display name
    const platformAccountId = profileData.username;
    const displayName = profileData.username;
    const avatarUrl = profileData.profile_image;

    const { getToken } = await auth();
    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) throw new Error("No auth token");

    await fetchMutation(
      api.accounts.connectAccount,
      {
        workspaceId: workspaceIdStr as Id<"workspaces">,
        platform: "pinterest",
        platformAccountId,
        handle: platformAccountId,
        displayName,
        avatarUrl,
        accessToken,
        refreshToken,
        tokenExpiresAt,
        scopes: OAUTH_CONFIG.pinterest.scopes.join(","),
      },
      { token: convexToken },
    );

    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&connected=pinterest`,
    );
  } catch (err) {
    console.error("Pinterest OAuth Error:", err);
    return NextResponse.redirect(
      `${getAppUrl(req)}/settings?tab=accounts&error=oauth_failed`,
    );
  }
}
