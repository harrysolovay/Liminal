export class Context {
  constructor(
    readonly parts: DescriptionParts[] = [],
    readonly assertions: Array<[Assertion, args: Array<unknown>]>,
  ) {}
}

export type DescriptionParts = {
  template: TemplateStringsArray
  params: Params
  args?: never
} | {
  template?: never
  params?: never
  args: Args
}

export type Params = Array<keyof any>

export type Args<P extends keyof any = keyof any> = Record<P, number | string | undefined>

export type Assertion<
  T = unknown,
  A extends unknown[] = unknown[],
> = (
  target: T,
  ...args: A
) => void | Promise<void>
