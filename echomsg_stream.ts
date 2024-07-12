import type { Denops } from "https://deno.land/x/denops_std@v6.5.1/mod.ts";
import { echo } from "https://deno.land/x/denops_std@v6.5.1/helper/mod.ts";
import { echomsg } from "./echomsg.ts";

/**
 * Stream to echo messages to the message window.
 * @extends WritableStream
 */
export class EchomsgStream extends WritableStream<string> {
  private lines: string[] = [];
  constructor(denops: Denops, highlight?: string) {
    super({
      write: async (chunk, _controller) => {
        await echomsg(denops, chunk, highlight);
        this.lines.push(chunk);
      },
    });
  }
  public getLines(): string[] {
    return this.lines;
  }
  public clearLines(): void {
    this.lines = [];
  }
  public async finalize(denops: Denops) {
    const content = this.lines.join("\n").trim();
    if (content === "") {
      return;
    }
    await echo(denops, content);
    this.clearLines();
  }
}
