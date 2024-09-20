# Red Modding root website

Website for Red Modding community.

## Features

- Content in YAML (`content` folder)
  - General site info (`content/site.yaml`)
  - Teams (`content/teams.yaml`)
  - Projects (`content/projects.yaml`)
  - Member overrides (`content/members.yaml`)
- Integrations
  - [LizzyFuzzy bot](https://github.com/Moonded/lizzyfuzzy)
    - Fetching members and their additional details from Discord
  - GitHub (Now through Lizzy)
    - Fetching members' info and contributions to an organization
    - Fetching details of projects
  - NexusMods (Now through Lizzy)
    - Fetching info and mods of members

## Notes

This project is not meant to be run as a server but rather as serverless function or static website due to extensive caching during the build process.

## Building

0. Have pnpm.
1. `pnpm install`
2. Configure `.env.local`, use `.env` as template
3. `pnpm build`
