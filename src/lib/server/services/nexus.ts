import { NEXUS_GAME_IDS, NEXUS_URL } from "$env/static/private";

export interface NexusMod {
  author: string;
  createdAt: string;
  downloads: number;
  endorsements: number;
  id: string;
  modId: number;
  name: string;
  summary: string;
  thumbnailUrl: string;
  game: { domainName: string; name: string };
  modCategory: { name: string };
}

export interface NexusProfile {
  mods: NexusMod[];
  user: {
    about: string | null;
    country: string | null;
    kudos: number;
    name: string;
    avatar: string;
    uniqueModDownloads: number;
  };
}

const GAME_IDS = new Set(NEXUS_GAME_IDS.split(",").map((v) => v.trim()));

export function getNexusProfileURL(name: string) {
  return new URL(`/profile/${name}`, NEXUS_URL);
}

export async function fetchNexusProfile(name: string): Promise<NexusProfile> {
  const url = getNexusProfileURL(name);
  url.pathname += "/mods";
  url.searchParams.set("sortBy", "endorsements");

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch NexusMods profile: " + response.status + ": " + response.statusText);
  }

  const page = await response.text();

  const matches = page.matchAll(/<script>window\["__RQ:Rbta:"\].+?.push\((.+?)\);<\/script>/g);

  const queries: Record<string, unknown> = {};

  for (const match of matches) {
    const data = JSON.parse(match[1]);
    for (const query of data.queries) {
      queries[query.queryKey[0]] = query.state.data;
    }
  }

  queries.mods = (queries.mods as { nodes: NexusMod[] }).nodes.filter((mod) => {
    const gameId = mod.id.split(",")[0];
    return GAME_IDS.has(gameId);
  });

  return queries as unknown as NexusProfile;
}