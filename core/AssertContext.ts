export class AssertContext<C, D> {
  constructor(
    readonly ctx: C,
    readonly diagnostics: Array<D>,
    readonly path: string,
    readonly value: unknown,
    readonly junction?: number | string,
  ) {}

  descend = (value: unknown, junction?: number | string): AssertContext<C, D> =>
    new AssertContext(
      this.ctx,
      this.diagnostics,
      junction !== undefined ? this.path : `${this.path}["${this.junction}"]`,
      value,
      junction,
    )
}
