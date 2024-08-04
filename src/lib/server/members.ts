import merge from "merge";
import { teams } from "$lib/content/teams";
import type { Combine } from "$lib/utils";
import { fetchGithubUsers, type GithubUser } from "./services/github";
import {
  fetchDiscordDetails,
  fetchDiscordRoles,
  type MemberDetails,
  type Role,
  type RoleMember,
  type TeamMember,
} from "./services/lizzy";
import { fetchNexusProfile, type NexusProfile } from "./services/nexus";

type MergedDetails = Partial<MemberDetails>;
//| (MemberDetails & Combine<{ githubProfile: GithubUser }, { nexusProfile: NexusProfile }>);

export type Member = TeamMember & MergedDetails;
export type Teams<T = TeamMember> = Record<string, T[]>;

let cache: Teams<Member> | null = null;

export async function fetchMembers() {
  if (!cache) cache = await _fetchMembers();
  return cache;
}

async function _fetchMembers() {
  const roles = await fetchDiscordRoles();
  const [team2manyMembers, members] = processRoles(roles);

  const details = await fetchDiscordDetails(Object.keys(members)).then(mapDetailsById);
  // const [githubs, nexus] = await Promise.all([fetchMembersGithubs(details), fetchMembersNexus(details)]);

  // const memberDetails: Record<string, MergedDetails> = merge.recursive(details, githubs, nexus);

  return assignMembersToTeams(team2manyMembers, details, (member) => {
    if (member.nexusmods) member.Displayname = member.nexusmods;
    else if (member.github) member.Displayname = member.github;

    return member;
  });
}

async function fetchMembersGithubs(details: Record<string, MemberDetails>) {
  const names: Record<string, string> = {};

  // Collect map of github names to usernames
  for (const [username, member] of Object.entries(details)) {
    if (member.github) names[member.github] = username;
  }

  // Fetch
  const githubs = await fetchGithubUsers(Object.keys(names));

  // Map github names back to usernames
  const output: Record<string, { githubProfile: GithubUser }> = {};
  for (const githubProfile of githubs) {
    if (!names[githubProfile.login]) continue;
    output[names[githubProfile.login]] = { githubProfile };
  }

  return output;
}

async function fetchMembersNexus(details: Record<string, MemberDetails>) {
  const output: Record<string, { nexusProfile: NexusProfile }> = {};
  const promises = [];

  for (const [username, member] of Object.entries(details)) {
    if (!member.nexusmods) continue;

    promises.push(
      fetchNexusProfile(member.nexusmods).then((nexusProfile) => {
        output[username] = { nexusProfile };
      }),
    );
  }

  await Promise.all(promises);
  return output;
}

function processRoles(roles: Role[]) {
  const role2Team = getRole2TeamMap();
  const members: Record<string, TeamMember> = {};
  const team2manyMembers: Teams<TeamMember> = {};

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

  return [team2manyMembers, members] as const;
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

function assignMembersToTeams<Details>(
  team2manyMembers: Teams,
  memberDetails: Record<string, Details>,
  processMember: (member: TeamMember & Details) => TeamMember & Details,
): Teams<TeamMember & Details> {
  const assignedMembers = new Set<string>();
  const teamMembers: Teams<TeamMember & Details> = {};

  for (const teamId of Object.keys(teams)) {
    if (!team2manyMembers[teamId]?.length) continue;

    for (const member of team2manyMembers[teamId]) {
      member.Teams.add(teamId);

      if (assignedMembers.has(member.ID)) continue;
      assignedMembers.add(member.ID);

      if (!teamMembers[teamId]) teamMembers[teamId] = [];

      const processedMember = processMember(Object.assign(member, memberDetails[member.ID]));
      teamMembers[teamId].push(processedMember);
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
