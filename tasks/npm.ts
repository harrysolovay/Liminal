import { build } from "@deno/dnt"
import type { SpecifierMappings } from "@deno/dnt/transform"
import { parseArgs } from "@std/cli"
import * as fs from "@std/fs"
import * as path from "@std/path"
import denoConfig from "../deno.json" with { type: "json" }
import { splitLast } from "../util/splitLast.ts"

const outDir = ".liminal/npm"
await fs.emptyDir(outDir)

const { version } = parseArgs(Deno.args, { string: ["version"] })

const mappingTargets = await Array.fromAsync(fs.walk(".", {
  exts: [".node.ts"],
  includeDirs: false,
}))
const mappings: SpecifierMappings = Object.fromEntries(
  mappingTargets.map(({ path }) => [`${splitLast(path, ".node.ts")![0]}.ts`, path]),
)
// TODO: enable upon resolution of https://github.com/denoland/dnt/issues/433.
if (false as boolean) {
  Object.assign(mappings, {
    "npm:@anthropic-ai/sdk@^0.32.1": {
      name: "@anthropic-ai",
      version: "^0.32.1",
      peerDependency: true,
    },
    "npm:ollama@^0.5.11": {
      name: "ollama",
      version: "@^0.5.11",
      peerDependency: true,
    },
    "npm:openai@^4.76.0": {
      name: "openai",
      version: "^4.76.0",
      peerDependency: true,
    },
  })
}

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
  mappings,
  package: {
    name: "liminal",
    version: version ?? denoConfig.version,
    description: denoConfig.description,
    license: "Apache-2.0",
    repository: "github:harrysolovay/liminal.git",
    type: "module",
    main: "./esm/mod.js",
  },
})

const packageJsonPath = path.join(outDir, "package.json")
await Deno.readTextFile(packageJsonPath).then(async (v) => {
  const initial = JSON.parse(v)
  { // TODO: delete upon resolution of https://github.com/denoland/dnt/issues/433.
    const { "@anthropic-ai/sdk": anthropic, openai } = initial.dependencies
    delete initial.dependencies
    initial.peerDependencies = { "@anthropic-ai/sdk": anthropic, openai }
  }
  if (version === undefined) {
    initial.private = true
  }
  await Deno.writeTextFile(packageJsonPath, JSON.stringify(initial, null, 2))
})

await Promise.all(
  ["README.md", "LICENSE"].map((assetPath) =>
    Deno.copyFile(assetPath, path.join(outDir, assetPath))
  ),
)
