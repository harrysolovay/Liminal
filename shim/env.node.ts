import process from "node:process"

export function env(key: string): string | undefined {
  return process.env[key]
}
