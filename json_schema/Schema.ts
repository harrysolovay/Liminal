export type Schema = Record<string, unknown>

export namespace Schema {
  export function isRootCompatible(schema: Schema): boolean {
    return "type" in schema && schema.type === "object"
  }
}
