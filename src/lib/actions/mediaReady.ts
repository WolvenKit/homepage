import type { Action } from "svelte/action";

export const mediaReady = ((node, callback) => {
  if ("readyState" in node ? node.readyState >= node.HAVE_CURRENT_DATA : node.complete) {
    callback();
    return;
  }

  node.addEventListener("load", callback, { once: true, passive: true });
  node.addEventListener("loadeddata", callback, { once: true, passive: true });

  return {
    destroy() {
      node.removeEventListener("load", callback);
      node.removeEventListener("loadeddata", callback);
    },
  };
}) satisfies Action<HTMLMediaElement | HTMLImageElement, () => void>;
