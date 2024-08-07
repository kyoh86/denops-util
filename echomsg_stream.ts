import type { Denops } from "@denops/std";
import { echo } from "@denops/std/helper";
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
