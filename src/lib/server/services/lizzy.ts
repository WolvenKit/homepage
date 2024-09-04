import { dev } from "$app/environment";
import { DISCORD_SERVER_ID, LIZZY_API_TOKEN, LIZZY_API_URL } from "$env/static/private";
import type { Theme } from "$lib/themes";

export interface Role {
  Role: string;
  ID: string;
  Icon: null;
  Position: number;
}

export interface DiscordMember {
  Username: string;
  Nickname: string | null;
  Image: string;
  ID: string;
  Bot: boolean;
  Roles: Role[];
  CustomData: null | Partial<{
    id: string;
    user: string;
    userid: string;
    nexusmods: string;
    github: string;
    theme: Theme;
    description: string;
    style: "lowercase" | "uppercase";
  }>;
}

async function fetchLizzy(path: string, init?: RequestInit) {
  const url = new URL(path, LIZZY_API_URL);
  const result = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${LIZZY_API_TOKEN}`,
      ...init?.headers,
    },
  });

  if (!result.ok) throw result;
  return result;
}

let memberCache: Promise<DiscordMember[]> | null = null;

export async function fetchDiscordMembers(): Promise<DiscordMember[]> {
  // Cache in development
  if (!dev || !memberCache) {
    memberCache = fetchLizzy("/api/discord/web?q=" + DISCORD_SERVER_ID).then((r) => r.json());
  }
  return memberCache;
}
