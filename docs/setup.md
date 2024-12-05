# Setup

## Installation

::: code-group

```sh [Node.js]
npm i structured-outputs
```

```sh [Deno]
deno add jsr:@crosshatch/structured-outputs@0.1.0-beta.X

# The following will work upon stabilization.
deno add jsr:@crosshatch/structured-outputs
```

:::

## Node.js-specific Setup

`structured-outputs`'s NPM package does not contain a CommonJS build; only ES Modules are supported.
Therefore, we must specify `module` as the value of the `package.json`'s `type` field.

`package.json`

```diff
{
  // ...
+ "type": "module"
}
```
