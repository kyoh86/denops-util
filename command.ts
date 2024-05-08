import type { Denops } from "https://deno.land/x/denops_std@v6.4.2/mod.ts";
import { TextLineStream } from "https://deno.land/std@0.224.0/streams/text_line_stream.ts";
import { EchomsgStream } from "./echomsg_stream.ts";

/**
 * Pipe the output (stdout and stderr) of the external command to the message window.
 * @param denops Denops object
 * @param command Command to execute
 * @param options Options for Deno.Command
 */
export async function echoallCommand(
  denops: Denops,
  command: string | URL,
  options?: Omit<Deno.CommandOptions, "stdin" | "stderr" | "stdout">,
): Promise<void> {
  const { pipeOut, wait, finalize } = echoerrCommand(
    denops,
    command,
    options,
  );
  const stdoutStream = new EchomsgStream(denops);
  await Promise.all([
    wait,
    pipeOut.pipeThrough(new TextLineStream()).pipeTo(stdoutStream),
  ]);
  await finalize();
}

/**
 * Pipe the error output (stderr) of the external command to the message window.
 * @param denops Denops object
 * @param command Command to execute
 * @param options Options for Deno.Command
 * @returns Object has stdout pipe and wait promise
 * @example
 * ```ts
 * const { pipeOut, wait, finalize } = echoerrCommand(denops, "git", { args: ["status"] });
 * try {
 *     for await (const line of pipeOut.pipeThrough(new TextLineStream())) {
 *         console.log(line);
 *     }
 * } finally {
 *     await wait;
 *     await finalize();
 * }
 * ```
 */
export function echoerrCommand(
  denops: Denops,
  command: string | URL,
  options?: Omit<Deno.CommandOptions, "stdin" | "stderr" | "stdout">,
) {
  const { status, stderr, stdout } = new Deno.Command(command, {
    ...options,
    stdin: "null",
    stderr: "piped",
    stdout: "piped",
  }).spawn();

  const errorMsgStream = new EchomsgStream(denops, "ErrorMsg");

  const wait = (async () => {
    const [_, s] = await Promise.all([
      stderr
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new TextLineStream())
        .pipeTo(errorMsgStream),
      status,
    ]);
    return s;
  })();

  return {
    pipeOut: stdout.pipeThrough(new TextDecoderStream()),
    finalize: async () => {
      await stdout.cancel();
      await stderr.cancel();
    },
    wait,
  };
}
