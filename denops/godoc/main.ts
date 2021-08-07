import { Denops, fn, unknownutil } from "./deps.ts";
import * as internal from "./internal_autoload_fn.ts";

const dispatcherNames = {
  GODOC_SETUP: "godocSetup",
} as const;

export async function main(denops: Denops): Promise<void> {
  const prefix = "godoc://";

  const isGodocBufferName = (dri: string): boolean => {
    return dri.startsWith(prefix);
  };

  const extractPath = (dri: string): string => {
    return dri.slice(prefix.length);
  };

  const setupBuffer = async (
    bufnr: number,
    bufname?: string,
  ): Promise<void> => {
    const bn = bufname ?? await fn.bufname(denops, bufnr);
    const packageName = extractPath(bn);
    const [godocExecutable, godocArgs] = await Promise.all([
      internal.getGodocExecutable(denops),
      internal.getGodocArgs(denops, packageName),
    ]);
    const p = Deno.run({
      cmd: [
        godocExecutable,
        ...godocArgs,
      ],
      stdout: "piped",
      stderr: "inherit",
      stdin: "null",
    });
    try {
      let linenr = 1;
      const lineBuf: number[] = [];
      const buf = new Uint8Array(65536);
      const proc = async () => {
        const lines: string[] = [];
        let s: number;
        while ((s = lineBuf.indexOf(0x0a)) >= 0) {
          const line = lineBuf.splice(0, s + 1).slice(0, -1);
          lines.push(new TextDecoder().decode(Uint8Array.from(line)));
        }
        await internal.setbufline(
          denops,
          bufnr,
          linenr,
          lines,
        );
        linenr += lines.length;
      };
      while (await p.stdout.read(buf) !== null) {
        lineBuf.push(...buf);
        await proc();
      }
      await proc();
    } finally {
      p.close();
    }
  };

  const setupAllBuffers = async (): Promise<void> => {
    // Issue: https://github.com/vim-denops/deno-denops-std/issues/65
    // deno-lint-ignore no-explicit-any
    const buffers = await (fn.getbufinfo as any as (denops: Denops) => unknown)(
      denops,
    );
    unknownutil.ensureArray(buffers);
    for (const buffer of buffers) {
      unknownutil.ensureObject(buffer);
      const { name, bufnr, linecount } = buffer;
      unknownutil.ensureNumber(bufnr);
      unknownutil.ensureString(name);
      unknownutil.ensureNumber(linecount);
      const waitList: Promise<unknown>[] = [];
      if (isGodocBufferName(name) && linecount === 1) {
        waitList.push(setupBuffer(bufnr));
      }
      await Promise.all(waitList);
    }
  };

  denops.dispatcher = {
    async [dispatcherNames.GODOC_SETUP](bufnr: unknown): Promise<void> {
      unknownutil.ensureNumber(bufnr);
      await setupBuffer(bufnr);
    },
  };

  await Promise.all([
    internal.setup(denops),
    setupAllBuffers(),
  ]);
}
