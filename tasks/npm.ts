import { build } from "@deno/dnt"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"
import { LIB_DESCRIPTION } from "../constants.ts"
import { collect, splitLast } from "../util/mod.ts"

const outDir = "target/npm"
await fs.emptyDir(outDir)

const { version } = parseArgs(Deno.args, {
  string: ["version"],
  default: {
    version: "0.0.0-local.0",
  },
})

const mappingTargets = await collect(fs.walk(".", {
  exts: [".node.ts"],
  includeDirs: false,
}))
const mappings = Object.fromEntries(
  mappingTargets.map(({ path }) => [`${splitLast(path, ".node.ts")[0]}.ts`, path]),
)

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
    ...mappings,
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
