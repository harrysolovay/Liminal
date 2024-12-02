import { type AnyType, declareType, type Type } from "../core/mod.ts"

export function object<F extends Record<string, AnyType>>(
  fields: F,
): Type<{ [K in keyof F]: F[K]["T"] }, F[keyof F]["P"]> {
  const entries = Object.entries(fields)
  return declareType({
    name: "object",
    source: {
      factory: object,
      args: [fields],
    },
    visitValue: (value, visit) => {
      const visited = Object.fromEntries(
        entries.map(([key, type]) => [
          key,
          visit(
            value[key],
            type,
            () => (value) => {
              visited[key] = value
            },
            {
              formatValuePath: (leading) => `${leading}.${key}`,
              formatTypePath: (leading) => `${leading}.${key}`,
            },
          ),
        ]),
      )
      return visited as never
    },
  })
}
