export class Context<P extends keyof any = never> {
  declare P: P
  constructor(private parts: ContextPart[] = []) {}

  add(template: TemplateStringsArray, params: Params) {
    return new Context([{ template, params }, ...this.parts])
  }

  apply<A extends Partial<Args<P>>>(args: A): Context<ExcludeArgs<P, A>> {
    return new Context([{ args }, ...this.parts])
  }

  toString(this: Context<never>): string {
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
