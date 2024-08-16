import membersRaw from "$content/members.yaml";
import type { TeamMember } from "$lib/server/members";

export const members = membersRaw as Record<string, Partial<TeamMember>>;
