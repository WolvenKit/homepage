import { dev } from "$app/environment";

import("@vercel/analytics").then(({ inject }) => {
  inject({ mode: dev ? "development" : "production" });
});
