export interface Emit<E = any> {
  action: "Emit"
  event: E
}

export function emit<E>(event: E): Emit<E> {
  return {
    action: "Emit",
    event,
  }
}
