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
  Displayname: string;
  Image: string;
  ID: string;
  Bot: boolean;
  Roles: Role[];
  CustomData: null | Partial<{
    id: string;
    user: string;
    userid: string;
    nexusmods: string;
    nexusmodsVerified: boolean;
    github: string;
    githubVerified: boolean;
    theme: Theme;
    description: string;
    style: "lowercase" | "uppercase";
  }>;
  NexusData: null | {
    mods: {
      nodes: NexusMod[];
    };
    userByName: {
      name: string;
      modCount: number;
      kudos: number;
      country: string;
      memberId: number;
      about: string;
      posts: number;
      avatar: string;
      uniqueModDownloads: number;
    };
  };
  GithubData: null | GithubDataItem[];
}

export interface NexusMod {
  id: string;
  name: string;
  uid: string;
  version: string;
  downloads: number;
  endorsements: number;
  adultContent: boolean;
  summary: string;
  pictureUrl: string;
}

export interface GithubDataItem {
  Repository: string;
  IssueCount: number;
  CommitCount: number;
}

async function fetchLizzy(path: string, init?: RequestInit) {
  const url = new URL(path, LIZZY_API_URL);
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${LIZZY_API_TOKEN}`,
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error("Failed to fetch Lizzy: " + body, { cause: { ...response } });
  }
  return response;
}

let memberCache: Promise<DiscordMember[]> | null = null;

export async function fetchDiscordMembers(): Promise<DiscordMember[]> {
  // Cache in development
  if (!dev || !memberCache) {
    memberCache = fetchLizzy("/api/discord/web?q=" + DISCORD_SERVER_ID).then((r) => r.json());
  }
  return memberCache;
}
