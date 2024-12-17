export interface DescriptionParam<K extends symbol = symbol, T = any> {
  (arg: T): DescriptionArg<K, T>
  type: "DescriptionParam"
  key: K
}

export interface DescriptionArg<K extends symbol = symbol, T = any> {
  type: "DescriptionArg"
  key: K
  value: T
  serializer?: (value: T) => string
}

export function DescriptionParam<K extends symbol, T = string>(
  key: K,
  serializer?: (value: T) => string,
): DescriptionParam<K, T> {
  return Object.assign(
    (value: T): DescriptionArg<K, T> => ({
      type: "DescriptionArg",
      key,
      value,
      serializer,
    }),
    {
      type: "DescriptionParam" as const,
      key,
    },
  )
}
