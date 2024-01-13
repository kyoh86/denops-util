import type { Denops } from "https://deno.land/x/denops_std@v5.2.0/mod.ts";
import { TextLineStream } from "https://deno.land/std@0.212.0/streams/text_line_stream.ts";
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
) {
  const { pipeOut, waitErr, finalize } = echoerrCommand(
    denops,
    command,
    options,
  );
  const stdoutStream = new EchomsgStream(denops);
  await Promise.all([
    waitErr,
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
 */
export function echoerrCommand(
  denops: Denops,
  command: string | URL,
  options?: Omit<Deno.CommandOptions, "stdin" | "stderr" | "stdout">,
) {
  const { stderr, stdout } = new Deno.Command(command, {
    ...options,
    stdin: "null",
    stderr: "piped",
    stdout: "piped",
  }).spawn();

  const errorMsgStream = new EchomsgStream(denops, "ErrorMsg");

  const waitErr = (async () => {
    await stderr
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TextLineStream())
      .pipeTo(errorMsgStream);
  })();

  return {
    pipeOut: stdout.pipeThrough(new TextDecoderStream()),
    finalize: async () => {
      await stdout.cancel();
      await stderr.cancel();
    },
    waitErr,
  };
}
