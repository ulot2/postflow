import { NextRequest } from "next/server";

export function getAppUrl(req: NextRequest) {
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const host = req.headers.get("host") || "localhost:3000";
  return `${protocol}://${host}`;
}

export function generateState(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15);
}

export const OAUTH_CONFIG = {
  linkedin: {
    authUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    profileUrl: "https://api.linkedin.com/v2/userinfo",
    scopes: ["openid", "profile", "email", "w_member_social"],
  },
  pinterest: {
    authUrl: "https://www.pinterest.com/oauth/",
    tokenUrl: "https://api.pinterest.com/v5/oauth/token",
    profileUrl: "https://api.pinterest.com/v5/user_account",
    scopes: ["boards:read", "pins:read", "pins:write"],
  },
};
