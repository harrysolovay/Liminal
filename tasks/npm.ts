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
  shims: {},
  scriptModule: false,
  declaration: "separate",
  compilerOptions: {
    importHelpers: true,
    sourceMap: true,
  },
  typeCheck: false,
  importMap: "./deno.json",
  test: false,
  mappings: {
    "npm:openai@^4.68.1": {
      name: "openai",
      version: "^4.68.1",
      peerDependency: true,
    },
  },
  package: {
    name: "structured-outputs",
    version,
    description: "Compose OpenAI structured output schemas.",
    license: "Apache-2.0",
    repository: "github:harrysolovay/structured-outputs.git",
    main: "./esm/mod.js",
  },
})

await Promise.all(["README.md", "LICENSE"]
  .map((assetPath) => Deno.copyFile(assetPath, path.join(outDir, assetPath))))
