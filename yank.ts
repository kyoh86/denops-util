import type { Denops } from "@denops/std";
import { setreg } from "@denops/std/function";
import { v } from "@denops/std/variable";

/**
 * Yank text to the register.
 * @param denops Denops object
 * @param value Text to yank
 */
export async function yank(denops: Denops, value: string) {
  await setreg(denops, '"', value, "v");
  await setreg(denops, await v.get(denops, "register"), value, "v");
}
