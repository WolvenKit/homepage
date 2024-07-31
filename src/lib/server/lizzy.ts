import { DISCORD_SERVER_ID, LIZZY_API_TOKEN, LIZZY_API_URL } from "$env/static/private";

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

export async function fetchRoles() {
  const result = await fetchLizzy("/api/discord/roles?server=" + DISCORD_SERVER_ID);
  return result.json();
}
