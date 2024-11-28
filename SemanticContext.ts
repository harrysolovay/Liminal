import type { ExcludeRefiners, Refinements, UnappliedRefiners } from "./Type.ts"

export class SemanticContext<T, R extends Refinements, P extends keyof any> {
  constructor(
    readonly parts: ContextPart[] = [],
    readonly refinements: R,
  ) {}

  add(template: TemplateStringsArray, params: Params) {
    return new SemanticContext([{ template, params }, ...this.parts], this.refinements)
  }

  apply<A extends Partial<Args<P>>>(args: A): SemanticContext<T, R, ExcludeArgs<P, A>> {
    return new SemanticContext([{ args }, ...this.parts], this.refinements)
  }

  refine<const V extends UnappliedRefiners<R>>(
    refinements: V,
  ): SemanticContext<T, ExcludeRefiners<R, V>, P> {
    return new SemanticContext(this.parts, {
      ...this.refinements,
      ...refinements,
    } as never)
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

export type Args<P extends keyof any = keyof any> = Record<P, number | string | undefined>

export type ExcludeArgs<P extends keyof any, A extends Partial<Args<P>>> = Exclude<
  P,
  keyof { [K in keyof A as A[K] extends undefined ? never : K]: never }
>
