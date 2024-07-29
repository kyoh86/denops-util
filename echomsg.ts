import type { Denops } from "@denops/std";
import { batch } from "@denops/std/batch";

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
