import { findContributions } from "$lib/server/github";

findContributions("zhincore").then(console.log);
