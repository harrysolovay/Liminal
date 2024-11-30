import type { ExcludeRefiners, Refinements, Unapplied, UnappliedRefiners } from "./Type.ts"
import type { TypeDeclaration } from "./TypeDeclaration.ts"

export class Context<T, R extends Refinements, P extends keyof any> {
  constructor(
    readonly decl: TypeDeclaration<T, R, P>,
    readonly parts: ContextPart[] = [],
    readonly refinements: { [K in keyof R]+?: R[K] extends Unapplied<infer U> ? U : never },
  ) {}

  add = (
    template: TemplateStringsArray,
    params: Params,
  ): Context<unknown, Refinements, keyof any> =>
    new Context(this.decl, [{ template, params }, ...this.parts], this.refinements) as never

  apply = <A extends Partial<Args<P>>>(args: A): Context<T, R, ExcludeArgs<P, A>> =>
    new Context(this.decl, [{ args }, ...this.parts], this.refinements)

  refine = <const V extends UnappliedRefiners<R>>(
    refinements: V,
  ): Context<T, ExcludeRefiners<R, V>, P> =>
    new Context(this.decl, this.parts, { ...this.refinements, ...refinements }) as never

  // TODO: clean up typing
  #refinementsMessages?: Record<any, string>
  refinementMessages(): Record<any, string> | void {
    if (this.decl.refinements) {
      if (!this.#refinementsMessages) {
        this.#refinementsMessages = this.decl.refinements(this.refinements as never) as never
      }
      return this.#refinementsMessages
    }
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
