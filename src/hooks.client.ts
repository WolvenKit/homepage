import { injectSpeedInsights } from "@vercel/speed-insights/sveltekit";
import { dev } from "$app/environment";

injectSpeedInsights();

import("@vercel/analytics").then(({ inject }) => {
  inject({ mode: dev ? "development" : "production" });
});
