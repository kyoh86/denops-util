import * as fn from "jsr:@denops/std@~7.6.0/function";
import * as mapping from "jsr:@denops/std@~7.6.0/mapping";
import type { MapOptions } from "jsr:@denops/std@7/mapping";
import type { Denops } from "jsr:@denops/std@~7.6.0";

/**
 * Make a mapping to dispatch a denops method call.
 */
export async function dispatch(
  args: {
    denops: Denops;
    lhs: string;
    method: string;
    sync?: boolean;
    name?: string;
    args?: unknown[];
  } & MapOptions,
): Promise<void> {
  const { denops, lhs, method, ...opts } = {
    sync: false,
    name: args.denops.name,
    args: [],
    mode: "n",
    ...args,
  };
  return await mapping.map(
    denops,
    lhs,
    `<cmd>call denops#${opts.sync ? "request" : "notify"}(${await fn.string(
      denops,
      opts.name,
    )}, ${await fn.string(denops, method)}, ${await fn.string(
      denops,
      opts.args,
    )})<cr>`,
  );
}
