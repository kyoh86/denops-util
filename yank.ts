import type { Denops } from "https://deno.land/x/denops_std@v6.4.0/mod.ts";
import { setreg } from "https://deno.land/x/denops_std@v6.4.0/function/mod.ts";
import { v } from "https://deno.land/x/denops_std@v6.4.0/variable/mod.ts";

/**
 * Yank text to the register.
 * @param denops Denops object
 * @param value Text to yank
 */
export async function yank(denops: Denops, value: string) {
  await setreg(denops, '"', value, "v");
  await setreg(denops, await v.get(denops, "register"), value, "v");
}
