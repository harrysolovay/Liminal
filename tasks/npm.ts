import { build } from "@deno/dnt"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"
import { LIB_DESCRIPTION } from "../constants.ts"

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
  declaration: "inline",
  compilerOptions: {
    importHelpers: false,
    sourceMap: true,
  },
  typeCheck: false,
  importMap: "./deno.json",
  test: false,
  mappings: {
    // // TODO: dynamically populate based on fs crawl + .node.ts postfix.
    // "./core/inspectBearer.ts": "./core/inspectBearer.node.ts",
    // // TODO: use upon resolution of https://github.com/denoland/dnt/issues/433.
    //   "npm:openai@^4.68.1": {
    //     name: "openai",
    //     version: "^4.68.1",
    //     peerDependency: true,
    //   },
  },
  package: {
    name: "structured-outputs",
    version,
    description: LIB_DESCRIPTION,
    license: "Apache-2.0",
    repository: "github:harrysolovay/structured-outputs.git",
    type: "module",
    main: "./esm/mod.js",
  },
})

const packageJsonPath = path.join(outDir, "package.json")
await Promise.all([
  // TODO: delete upon resolution of https://github.com/denoland/dnt/issues/433.
  Deno.readTextFile(packageJsonPath).then(async (v) => {
    const initial = JSON.parse(v)
    const { openai } = initial.dependencies
    delete initial.dependencies
    initial.peerDependencies = { openai }
    await Deno.writeTextFile(packageJsonPath, JSON.stringify(initial, null, 2))
  }),
  ...["README.md", "LICENSE"].map((assetPath) =>
    Deno.copyFile(assetPath, path.join(outDir, assetPath))
  ),
])
