export interface Ty<N = any> {
  new(): N
  schema(ctx: Context): Record<string, unknown>
}

export function make<Ty_ extends Ty>(schema: (ctx: Context) => unknown) {
  return class Ty {
    static schema = schema
  } as Ty_
}

export class Context {
  defs: Map<Ty, string>
  constructor(
    readonly root: Ty,
    readonly models?: Record<string, Ty>,
  ) {
    this.defs = new Map(models ? Object.entries(models).map(([k, v]) => [v, k]) : [])
  }

  ref(value: Ty): Record<string, unknown> {
    const key = this.defs.get(value)
    return key ? { $ref: `#/$defs/${key}` } : value.schema(this)
  }
}
