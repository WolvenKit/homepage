import { fetchRoles } from "$lib/server/lizzy";

fetchRoles().then(console.log).catch(console.error);
