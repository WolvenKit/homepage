import { DISCORD_SERVER_ID, LIZZY_API_TOKEN, LIZZY_API_URL } from "$env/static/private";
import { teams } from "$lib/content/teams";
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

export type TeamMember = RoleMember &
  Partial<MemberDetails> & {
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

async function fetchDetails(members: string[]): Promise<MemberDetails[]> {
  const result = await fetchLizzy("/api/discord/user/details?server=" + DISCORD_SERVER_ID, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(members),
  });
  return await result.json();
}

export async function fetchA(): Promise<Role[]> {
  const result = await fetchLizzy("/api/experimental/web?server=" + DISCORD_SERVER_ID);
  return await result.json();
}

async function fetchRoles(): Promise<Role[]> {
  const result = await fetchLizzy("/api/discord/roles?server=" + DISCORD_SERVER_ID);
  return (await result.json())[0];
}

export async function fetchTeams() {
  const roles = await fetchRoles();

  const members: Record<string, TeamMember> = {};

  const team2manyMembers = processRoles(roles, members);

  const details = await fetchDetails(Object.keys(members));
  const memberDetails = mapDetailsById(details);

  const teamMembers = assignMembersToTeams(team2manyMembers, memberDetails);

  return teamMembers;
}

function processRoles(roles: Role[], members: Record<string, TeamMember>) {
  const role2Team = getRole2TeamMap();
  const team2manyMembers: Record<string, TeamMember[]> = {};

  for (const role of roles) {
    const team = role2Team[role.Role];
    if (!team) continue;

    for (const member of role.Members) {
      if (member.Bot) continue;

      if (!team2manyMembers[team]) {
        team2manyMembers[team] = [];
      }

      if (!members[member.ID]) {
        members[member.ID] = createTeamMember(member);
      }

      team2manyMembers[team].push(members[member.ID]);
    }
  }

  return team2manyMembers;
}

function createTeamMember(member: RoleMember): TeamMember {
  return {
    ...member,
    Teams: new Set(),
    Displayname: member.Username.split(/(?<![a-z])/gim)
      .map((v) => v[0].toUpperCase() + v.slice(1))
      .join(""),
  };
}

function mapDetailsById(details: MemberDetails[]): Record<string, MemberDetails> {
  return details.reduce(
    (acc, detail) => {
      acc[detail.userid] = detail;
      return acc;
    },
    {} as Record<string, MemberDetails>,
  );
}

function assignMembersToTeams(
  team2manyMembers: Record<string, TeamMember[]>,
  memberDetails: Record<string, MemberDetails>,
): Record<string, TeamMember[]> {
  const assignedMembers = new Set<string>();
  const teamMembers: Record<string, TeamMember[]> = {};

  for (const teamId of Object.keys(teams)) {
    if (!team2manyMembers[teamId]?.length) continue;

    for (const member of team2manyMembers[teamId]) {
      member.Teams.add(teamId);

      if (assignedMembers.has(member.ID)) continue;
      assignedMembers.add(member.ID);

      if (!teamMembers[teamId]) teamMembers[teamId] = [];

      if (member.nexusmods) member.Displayname = member.nexusmods;
      teamMembers[teamId].push(Object.assign(member, memberDetails[member.ID]));
    }
  }

  return teamMembers;
}

function getRole2TeamMap() {
  const map: Record<string, string> = {};

  for (const [teamId, team] of Object.entries(teams)) {
    if (!("discord_role" in team)) continue;

    for (const role of Array.isArray(team.discord_role) ? team.discord_role : [team.discord_role]) {
      map[role] = teamId;
    }
  }

  return map;
}
