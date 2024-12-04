import { mkdir } from "node:fs/promises"

export async function ensureDir(dir: string | URL): Promise<void> {
  try {
    await mkdir(dir, { recursive: true })
  } catch (_e: unknown) {}
}
