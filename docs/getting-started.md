---
prev:
  text: Overview
  link: /
next:
  text: Values
  link: /values
---

# Getting Started

## Lifecycle

Let's briefly touch on the Liminal usage lifecycle at a high level.

1. We declare state and functions.
2. We create transactions that deploy and/or utilize pre-deployed functions.
3. We can generate and deploy migrations.

During development, we may also use Liminal to test contracts against an ephemeral network, but more
on this [later](/testing.md).

## Installation

::: code-group

```sh [Node.js]
npm i liminal
```

```sh [Deno]
jsr add @mina/liminal
```

:::

## Node.js-specifics

### Use Modules

Liminal's NPM package does not contain a CommonJS build; only ESModules are supported. Therefore, we
must specify the `package.json` `type` field as `"module"`.

```diff
{
  // ...
+ "type": "module"
}
```

### `tsconfig.json` Fields

Ensure that you've configured module resolution to support `package.json` `exports`.

```diff
{
  // ...
+ "module": "ESNext"
}
```

### Shim Web Crypto API

Liminal uses the standard
[Web Crypto API](https://nodejs.org/docs/latest-v20.x/api/webcrypto.html#web-crypto-api) (Node
v20.3.1 and above). To use Liminal in previous major versions of Node, you can shim
`globalThis.crypto` as follows.

```ts
globalThis.crypto = require("node:crypto").webcrypto
```

## CLI Usage

You may want to add Liminal to your scripts/tasks for convenience.

::: code-group

```diff [Node.js]
{
  // ...
  "scripts": {
    // ...
+   "liminal": "liminal"
  }
}
```

```diff [Deno]
{
  // ...
  "tasks": {
    // ...
+   "liminal": "deno run -r -A https://deno.land/x/liminal/main.ts"
  }
}
```

:::

This simplifies interacting with the Liminal CLI.

::: code-group

```sh [Node.js]
npm run liminal --help
```

```sh [Deno]
deno task liminal --help
```

:::

## Namespace-importing Liminal

Throughout the remainder of this documentation, we'll refer to the Liminal namespace as `L`. In
practice, this means namespace-importing Liminal in your modules like so.

```ts
import * as L from "liminal"
```
