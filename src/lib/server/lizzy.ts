import { dev } from "$app/environment";
import { DISCORD_SERVER_ID, API_URL } from "$env/static/private";
import type { Theme } from "$lib/themes";

export interface Role {
  Role: string;
  ID: string;
  Icon: null;
  Position: number;
}

export interface CustomData {
  theme?: Theme;
  style?: "lowercase" | "uppercase";
  nexusmods?: string;
  nexusmodsVerified?: boolean;
  github?: string;
  githubVerified?: boolean;
  description?: string;
}

export interface DiscordMember {
  Username: string;
  Nickname: string | null;
  Displayname: string;
  Image: string;
  ID: string;
  Bot: boolean;
  Roles: Role[];
  CustomData: null | Record<`${number}`, CustomData>;
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
  modId: number;
  name: string;
  version: string;
  downloads: number;
  endorsements: number;
  adultContent: boolean;
  summary: string;
  status: string;
  modCategory: {
    name: string;
  };
  pictureUrl: string;
  game: {
    domainName: string;
  };
}

export interface GithubDataItem {
  Repository: string;
  IssueCount: number;
  CommitCount: number;
}

async function fetchLizzy(path: string, init?: RequestInit) {
  const url = new URL(path, API_URL);
  const response = await fetch(url, { ...init });

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
    memberCache = fetchLizzy("/web/user" + DISCORD_SERVER_ID)
      .then((r) => r.json())
      .catch((e) => {
        memberCache = null;
        throw e;
      });
  }
  return memberCache;
}
