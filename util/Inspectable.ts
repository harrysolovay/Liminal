export interface Inspectable {
  [nodeCustomInspect](_0: unknown, _1: unknown, inspect: (value: unknown) => string): string
  [denoCustomInspect](inspect: (value: unknown, opts: unknown) => string, opts: unknown): string
}

export function Inspectable(inspect: Inspect): Inspectable {
  return {
    [nodeCustomInspect](_0: unknown, _1: unknown, inspect_: (value: unknown) => string): string {
      return inspect(inspect_)
    },
    [denoCustomInspect](
      inspect_: (value: unknown, opts: unknown) => string,
      opts: unknown,
    ): string {
      return inspect((x) => inspect_(x, opts))
    },
  }
}

export const nodeCustomInspect = Symbol.for("nodejs.util.inspect.custom")
export const denoCustomInspect = Symbol.for("Deno.customInspect")

export type Inspect = (inspect: (value: unknown) => string) => string
