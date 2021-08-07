import { Denops, fn, vars } from "./deps.ts";
export type { Denops };
export { vars };

// deno-lint-ignore no-explicit-any
const createCaller = (name: string): any => {
  return async (denops: Denops, ...args: unknown[]) => {
    return await fn.call(denops, name, args);
  };
};

export type GetGodocExecutable = (
  denops: Denops,
) => Promise<string>;
export const getGodocExecutable = createCaller(
  "dps#godoc#internal#get_godoc_executable",
) as GetGodocExecutable;

export type GetGodocArgs = (
  denops: Denops,
  packageName: string,
) => Promise<string[]>;
export const getGodocArgs = createCaller(
  "dps#godoc#internal#get_godoc_args",
) as GetGodocArgs;

export type Setup = (
  denops: Denops,
) => Promise<void>;
export const setup = createCaller(
  "dps#godoc#internal#setup",
) as Setup;

export type SetupBuffer = (
  denops: Denops,
) => Promise<void>;
export const setupBuffer = createCaller(
  "dps#godoc#internal#setup_buffer",
) as SetupBuffer;

export type Setbufline = (
  denops: Denops,
  bufnr: number,
  linenr: number,
  line: string,
) => Promise<void>;
export const setbufline = createCaller(
  "dps#godoc#internal#setbufline",
) as Setbufline;
