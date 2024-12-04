import { build } from "@deno/dnt"
import type { SpecifierMappings } from "@deno/dnt/transform"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"
import denoConfig from "../deno.json" with { type: "json" }
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
const mappings: SpecifierMappings = Object.fromEntries(
  mappingTargets.map(({ path }) => [`${splitLast(path, ".node.ts")[0]}.ts`, path]),
)
// TODO: enable upon resolution of https://github.com/denoland/dnt/issues/433.
if (false as boolean) {
  mappings["npm:openai@^4.68.1"] = {
    name: "openai",
    version: "^4.68.1",
    peerDependency: true,
  }
}

await build({
  entryPoints: ["./mod.ts", {
    name: "./std",
    path: "./std/mod.ts",
  }],
  outDir,
  shims: {
    deno: true,
  },
  scriptModule: false,
  declaration: "inline",
  compilerOptions: {
    importHelpers: false,
    sourceMap: true,
  },
  typeCheck: false,
  importMap: "./deno.json",
  test: false,
  mappings,
  package: {
    name: "structured-outputs",
    version,
    description: denoConfig.description,
    license: "Apache-2.0",
    repository: "github:harrysolovay/structured-outputs.git",
    type: "module",
    main: "./esm/mod.js",
  },
})

// TODO: delete upon resolution of https://github.com/denoland/dnt/issues/433.
{
  const packageJsonPath = path.join(outDir, "package.json")
  await Deno.readTextFile(packageJsonPath).then(async (v) => {
    const initial = JSON.parse(v)
    const { openai } = initial.dependencies
    delete initial.dependencies
    initial.peerDependencies = { openai }
    await Deno.writeTextFile(packageJsonPath, JSON.stringify(initial, null, 2))
  })
}

await Promise.all(
  ["README.md", "LICENSE"].map((assetPath) =>
    Deno.copyFile(assetPath, path.join(outDir, assetPath))
  ),
)
