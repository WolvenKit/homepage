import { teams, type Team } from "$lib/content/teams";
import { type GithubUser } from "./services/github";
import { fetchDiscordMembers, type DiscordMember } from "./services/lizzy";
import { type NexusProfile } from "./services/nexus";

export type TeamMember = DiscordMember & {
  Teams: Set<string>;
  Displayname: string;
  NexusProfile?: NexusProfile;
  GithubProfile?: GithubUser;
};

export type Teams = Record<string, TeamMember[]>;

interface ProcessedMembers {
  teamMembers: Teams;
  memberMap: Record<string, TeamMember>;
}

let cache: ProcessedMembers | null = null;

export async function fetchMembers() {
  return _getCachedMembers().then((v) => v.memberMap);
}

export async function fetchTeams() {
  return _getCachedMembers().then((v) => v.teamMembers);
}

async function _getCachedMembers() {
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

// async function fetchMembersGithubs(members: DiscordMember[]) {
//   const names: Record<string, string> = {};

//   // Collect map of github names to usernames
//   for (const member of members) {
//     if (member.CustomData?.github) names[member.CustomData.github] = member.Username;
//   }

//   // Fetch
//   const githubs = await fetchGithubUsers(Object.keys(names));

//   // Map github names back to usernames
//   const output: Record<string, { githubProfile: GithubUser }> = {};
//   for (const githubProfile of githubs) {
//     if (!names[githubProfile.login]) continue;
//     output[names[githubProfile.login]] = { githubProfile };
//   }

//   return output;
// }

// async function fetchMembersNexus(members: DiscordMember[]) {
//   const output: Record<string, { nexusProfile: NexusProfile }> = {};
//   const promises = [];

//   for (const  member of members) {
//     if (!member.CustomData?.nexusmods) continue;

//     promises.push(
//       fetchNexusProfile(member.CustomData.nexusmods).then((nexusProfile) => {
//         output[member.Username] = { nexusProfile };
//       }),
//     );
//   }

//   await Promise.all(promises);
//   return output;
// }

function processMembers(members: DiscordMember[]) {
  const role2Team = getRole2TeamMap();
  const memberMap: Record<string, TeamMember> = {};
  const team2manyMembers: Teams = {};

  for (const member of members) {
    if (member.Bot) continue;

    for (const role of member.Roles) {
      const team = role2Team[role.Role];
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
  return {
    ...discordMember,
    Teams: new Set(),
    Displayname:
      discordMember.CustomData?.nexusmods ||
      discordMember.CustomData?.github ||
      discordMember.Username.split(/(?<![a-z])/gim)
        .map((v) => v[0].toUpperCase() + v.slice(1))
        .join(""),
  };
}

function assignMembersToTeams(team2manyMembers: Teams, memberMap: Record<string, TeamMember>) {
  const teamMembers: Record<string, Set<TeamMember>> = {};
  const member2Team: Record<string, string> = {};

  function getMembers(teamId: string, team: Team) {
    const members = team2manyMembers[teamId] ?? [];
    let forcedMembers: Set<string> | null = null;

    // Add forced members
    if ("members" in team) {
      forcedMembers = new Set();
      for (const username of team.members) {
        const member = memberMap[username];
        if (member) {
          members.push(member);
          forcedMembers.add(username);
        }
      }
    }

    return { members, forcedMembers };
  }

  for (const [teamId, team] of Object.entries(teams)) {
    const { members, forcedMembers } = getMembers(teamId, team);

    // Skip empty teams, just in case
    if (!members.length) continue;

    teamMembers[teamId] = new Set();

    for (const member of members) {
      member.Teams.add(teamId);

      const currentTeam = member2Team[member.Username];

      // If already has team, skip
      if (currentTeam && !forcedMembers?.has(member.Username)) continue;

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
    if (!("discord_role" in team)) continue;

    for (const role of Array.isArray(team.discord_role) ? team.discord_role : [team.discord_role]) {
      map[role] = teamId;
    }
  }

  return map;
}
