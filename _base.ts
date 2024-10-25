export interface Ty<N = any> {
  new(): N
  schema(ctx: Context): object
}

export function make<Ty_ extends Ty>(schema: (ctx: Context) => unknown) {
  return class Ty {
    static schema = schema
  } as Ty_
}

export class Context {
  defs
  constructor(
    readonly root: Ty,
    readonly models?: Record<string, Ty>,
  ) {
    this.defs = new Map<Ty, string>(models ? Object.entries(models).map(([k, v]) => [v, k]) : [])
  }

  ref(value: Ty) {
    const key = this.defs.get(value)
    return key ? { $ref: `#/$defs/${key}` } : value.schema(this)
  }
}
