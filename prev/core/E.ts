export interface E<K extends number | string = number | string, V = any> {
  kind: "E"
  key: K
  value: V
}

export function E<K extends number | string, V>(key: K, value: V): E<K, V> {
  return {
    kind: "E",
    key,
    value,
  }
}
