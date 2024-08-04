import { DISCORD_SERVER_ID, LIZZY_API_TOKEN, LIZZY_API_URL } from "$env/static/private";
import type { Theme } from "$lib/themes";

export interface MemberDetails {
  id: string;
  user: string;
  userid: string;
  nexusmods: string;
  github: string;
  theme: Lowercase<Theme>;
  description: string;
}

export interface RoleMember {
  Username: string;
  Discriminator: string;
  ID: string;
  Bot: boolean;
}

export type TeamMember = RoleMember & {
  Displayname: string;
  Teams: Set<string>;
};

export interface Role {
  Role: string;
  Members: RoleMember[];
}

function fetchLizzy(path: string, init?: RequestInit) {
  const url = new URL(path, LIZZY_API_URL);
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${LIZZY_API_TOKEN}`,
      ...init?.headers,
    },
  });
}

export async function fetchA(): Promise<Role[]> {
  const result = await fetchLizzy("/api/experimental/web?server=" + DISCORD_SERVER_ID);
  return await result.json();
}

export async function fetchDiscordDetails(members: string[]): Promise<MemberDetails[]> {
  const result = await fetchLizzy("/api/discord/user/details?server=" + DISCORD_SERVER_ID, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(members),
  });
  return await result.json();
}

export async function fetchDiscordRoles(): Promise<Role[]> {
  const result = await fetchLizzy("/api/discord/roles?server=" + DISCORD_SERVER_ID);
  return (await result.json())[0];
}
