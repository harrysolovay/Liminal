import type { Refinements } from "./Type.ts"

export class Context<T, R extends Refinements, P extends keyof any> {
  constructor(private parts: ContextPart[] = [], private refinements: R) {}

  add(template: TemplateStringsArray, params: Params) {
    return new Context([{ template, params }, ...this.parts], this.refinements)
  }

  apply<A extends Partial<Args<P>>>(args: A): Context<T, R, ExcludeArgs<P, A>> {
    return new Context([{ args }, ...this.parts], this.refinements)
  }

  refine() {}

  toString(this: Context<T, R, P>): string {
    throw 0
  }
}

export type ContextPart = {
  template: TemplateStringsArray
  params: Params
  args?: never
} | {
  template?: never
  params?: never
  args: Args
}

export type Params = Array<keyof any>

export type Args<P extends keyof any = any> = Record<P, number | string | undefined>

export type ExcludeArgs<P extends keyof any, A extends Partial<Args<P>>> = Exclude<
  P,
  keyof { [K in keyof A as A[K] extends undefined ? never : K]: never }
>
