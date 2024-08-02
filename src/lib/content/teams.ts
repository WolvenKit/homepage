import teamsRaw from "$content/teams.yaml";

interface TeamBase {
  label: string;
  description?: string;
}

type TeamByRole = TeamBase & {
  discord_role: string | string[];
};

type TeamByMembers = TeamBase & {
  members: string[];
};

type TeamBase2 = TeamByRole | TeamByMembers;

type TeamWithIcon = TeamBase2 & {
  icon?: string;
};

type TeamWithColor = TeamBase2 & {
  color: string;
};

export type Team = TeamWithIcon | TeamWithColor;

export type Teams = Record<string, Team>;

export const teams = teamsRaw as Teams;
