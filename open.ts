import type { Denops } from "@denops/std";
import {
  bufexists,
  bufload,
  bufloaded,
  bufnr,
  fnameescape,
  fnamemodify,
  setbufvar,
} from "@denops/std/function";

// Open paths in buffer.
export async function openAll(
  denops: Denops,
  paths: string[],
  opts: {
    command: string;
  } = { command: "edit" },
) {
  for await (const path of paths) {
    await open(denops, path, opts);
  }
}

// Open a path in a buffer.
export async function open(
  denops: Denops,
  path: string,
  opts: {
    command: string;
  } = { command: "edit" },
) {
  if (opts.command !== "edit") {
    await execute_path(denops, path, opts.command);
    return;
  }

  // NOTE: bufnr() may return submatched buffer number.
  // We have to guard it with bufexists.
  if (!await bufexists(denops, path)) {
    await execute_path(denops, path, opts.command);
    return;
  }

  const bufNr = await bufnr(denops, path);

  // NOTE: "bufNr" may be hidden
  const loaded = await bufloaded(denops, bufNr);
  if (!loaded) {
    await bufload(denops, bufNr);
  }
  await denops.cmd(`buffer ${bufNr}`);
  if (!loaded) {
    await setbufvar(denops, bufNr, "&buflisted", 1);
  }
}

async function execute_path(denops: Denops, path: string, command: string) {
  await denops.cmd(
    `${command} ${await fnameescape(
      denops,
      await fnamemodify(denops, await fnamemodify(denops, path, ":p"), ":."),
    )}`,
  );
}
