import { build } from "@deno/dnt"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"

const outDir = "target/npm"
await fs.emptyDir(outDir)

const { version } = parseArgs(Deno.args, {
  string: ["version"],
  default: {
    version: "0.0.0-local.0",
  },
})

await build({
  entryPoints: ["./mod.ts"],
  outDir,
  shims: {
    deno: true,
    webSocket: true,
  },
  scriptModule: false,
  compilerOptions: {
    importHelpers: true,
    sourceMap: true,
  },
  test: false,
  package: {
    name: "structured-outputs",
    version,
    description: "Lightweight virtual types for OpenAI structured outputs.",
    license: "Apache-2.0",
    repository: "github:harrysolovay/structured-outputs.git",
  },
})

await Promise.all(["README.md", "LICENSE"]
  .map((assetPath) => Deno.copyFile(assetPath, path.join(outDir, assetPath))))
