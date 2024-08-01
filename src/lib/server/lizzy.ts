import { DISCORD_SERVER_ID, LIZZY_API_TOKEN, LIZZY_API_URL } from "$env/static/private";

const INETERESTING_ROLES_RE = /^(Team|Mod)/;

export interface RoleMember {
  Username: string;
  Discriminator: string;
  ID: string;
  Bot: boolean;
}

export type Member = RoleMember & {
  Displayname: string;
  Roles: string[];
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

export async function fetchDetails(members: string[]) {
  const result = await fetchLizzy("/api/discord/user/details?server=" + DISCORD_SERVER_ID, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(members),
  });
  return await result.json();
}

export async function fetchRoles(): Promise<Role[]> {
  const result = await fetchLizzy("/api/discord/roles?server=" + DISCORD_SERVER_ID);
  return (await result.json())[0];
}

/** Transform role array into Record<Username, Member + role names> */
export function getMembersFromRoles(roles: Role[]) {
  const members: Record<string, Member> = {};

  for (const role of roles) {
    if (!INETERESTING_ROLES_RE.test(role.Role)) continue;

    for (const member of role.Members) {
      if (member.Bot) continue;
      if (!members[member.Username]) {
        members[member.Username] = {
          ...member,
          Roles: [],
          Displayname: member.Username.split(/(?<![a-z])/gim)
            .map((v) => v[0].toUpperCase() + v.slice(1))
            .join(""),
        };
      }
      members[member.Username].Roles.push(role.Role);
    }
  }

  return members;
}
