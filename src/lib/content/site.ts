import siteRaw from "$content/site.yaml";

export interface Site {
  name: string;
  source: string;
  color: string;
  description: string;
  menu: Record<string, string>;
  socials: Record<string, string>;
}

export const site = siteRaw as Site;
