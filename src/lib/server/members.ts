import { members } from "$lib/content/members";
import { teams, type Team } from "$lib/content/teams";
import { fetchDiscordMembers, type CustomData, type DiscordMember } from "./lizzy";

interface CustomCustomData extends CustomData {
  background?: string;
  brokenTheme?: boolean;
}

export type TeamMember = Omit<DiscordMember, "CustomData"> & {
  Teams: Set<string>;
  Displayname: string;
  PrimaryTeam?: string;
  CustomData: CustomCustomData | null;
};

export type Teams = Record<string, TeamMember[]>;

interface ProcessedMembers {
  teamMembers: Teams;
  memberMap: Record<string, TeamMember>;
}

let cache: ProcessedMembers | null = null;

export async function fetchMembers() {
  return getCachedMembers().then((v) => v.memberMap);
}

export async function fetchTeams() {
  return getCachedMembers().then((v) => v.teamMembers);
}

export async function getCachedMembers() {
  if (!cache) cache = await _fetchMembers();
  return cache;
}

async function _fetchMembers() {
  const members = await fetchDiscordMembers();

  const { team2manyMembers, memberMap } = processMembers(members);
  const teamMembers = assignMembersToTeams(team2manyMembers, memberMap);

  const output: Teams = {};

  for (const [key, value] of Object.entries(teamMembers)) {
    output[key] = Array.from(value).sort((a, b) => a.Username.localeCompare(b.Username));
  }

  return { teamMembers: output, memberMap };
}

function processMembers(members: DiscordMember[]) {
  const role2Team = getRole2TeamMap();
  const memberMap: Record<string, TeamMember> = {};
  const team2manyMembers: Teams = {};

  for (const member of members) {
    if (member.Bot) continue;

    for (const role of member.Roles) {
      const team = role2Team[role.ID];
      if (!team) continue;

      if (!team2manyMembers[team]) {
        team2manyMembers[team] = [];
      }

      if (!memberMap[member.Username]) {
        memberMap[member.Username] = createTeamMember(member);
      }

      team2manyMembers[team].push(memberMap[member.Username]);
    }
  }

  return { team2manyMembers, memberMap };
}

function createTeamMember(discordMember: DiscordMember): TeamMember {
  const override = members[discordMember.Username];
  const customDataOrigin = discordMember.CustomData
    ? Object.values(discordMember.CustomData).reduce((acc, v) => ({ ...acc, ...v }), {})
    : null;

  const customData =
    discordMember.CustomData || override?.CustomData ? { ...customDataOrigin, ...override?.CustomData } : null;
  const style = customData?.style || "uppercase";

  return {
    ...discordMember,
    Teams: new Set(),

    // Override
    ...override,

    // generate displayname
    Displayname:
      override?.Displayname ||
      discordMember.Username.split(/(?<![a-z])/gim)
        .map((v) => (style == "uppercase" ? v[0].toUpperCase() + v.slice(1) : v))
        .join(""),

    // Merge custom data with override
    CustomData: customData,
  };
}

function assignMembersToTeams(team2manyMembers: Teams, memberMap: Record<string, TeamMember>) {
  const teamMembers: Record<string, Set<TeamMember>> = {};
  const member2Team: Record<string, string> = {};

  function getMembers(teamId: string, team: Team) {
    const members = team2manyMembers[teamId] ?? [];

    // Add forced members
    if ("members" in team) {
      for (const username of team.members) {
        const member = memberMap[username];
        if (member) {
          members.push(member);
        }
      }
    }

    return members;
  }

  for (const [teamId, team] of Object.entries(teams)) {
    const members = getMembers(teamId, team);

    // Skip empty teams, just in case
    if (!members.length) continue;

    teamMembers[teamId] = new Set();

    for (const member of members) {
      member.Teams.add(teamId);

      const wantedTeam = member.PrimaryTeam;
      const currentTeam = member2Team[member.Username];

      // If already has team (and the team is wanted), skip
      if (currentTeam && (!wantedTeam || wantedTeam == currentTeam)) continue;

      // If already had a team, remove them from it
      teamMembers[currentTeam]?.delete(member);

      member2Team[member.Username] = teamId;
      teamMembers[teamId].add(member);
    }
  }

  return teamMembers;
}

function getRole2TeamMap() {
  const map: Record<string, string> = {};

  for (const [teamId, team] of Object.entries(teams)) {
    if (!("discordRole" in team)) continue;

    for (const role of Array.isArray(team.discordRole) ? team.discordRole : [team.discordRole]) {
      map[role.toString()] = teamId;
    }
  }

  return map;
}
