import type { Denops } from "https://deno.land/x/denops_std@v6.5.1/mod.ts";
import { batch } from "https://deno.land/x/denops_std@v6.5.1/batch/batch.ts";

export async function echomsg(denops: Denops, msg: string, highlight?: string) {
  await batch(denops, async (denops) => {
    if (highlight) {
      await denops.cmd("echohl highlight", { highlight });
    }
    await denops.cmd(`echomsg "[${denops.name}] " .. l:msg`, { msg });
    if (highlight) {
      await denops.cmd("echohl None");
    }
  });
}
