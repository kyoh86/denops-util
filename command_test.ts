import { assert } from "@std/assert";
import { test } from "@denops/test";
import * as fn from "@denops/std/function";
import { echoallCommand } from "./command.ts";

test({
  mode: "all",
  name:
    "Call a command having stdout via echoallCommand and it should be printed",
  fn: async (denops) => {
    await echoallCommand(denops, "echo", { args: ["Hello, output!"] });
    const result = await fn.execute(denops, "messages");
    assert(result.includes("Hello, output!"));
  },
});

test({
  mode: "all",
  name:
    "Call a command having stderr via echoallCommand and it should be printed",
  fn: async (denops) => {
    await echoallCommand(denops, "bash", {
      args: ["-c", 'echo "Hello, error!" >&2'],
    });
    const result = await fn.execute(denops, "messages");
    assert(result.includes("Hello, error!"));
  },
});

test({
  mode: "all",
  name:
    "Call a command having stdout and stderr via echoallCommand and it should be printed",
  fn: async (denops) => {
    await echoallCommand(denops, "bash", {
      args: [
        "-c",
        'echo "Hello, output1!" && echo "Hello, error1!" >&2 && echo "Hello, output2!" && echo "Hello, error2!" >&2',
      ],
    });
    const result = await fn.execute(denops, "messages");
    assert(result.includes("Hello, output1!"));
    assert(result.includes("Hello, error1!"));
    assert(result.includes("Hello, output2!"));
    assert(result.includes("Hello, error2!"));
  },
});
