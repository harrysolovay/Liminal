# Setup

## Installation

::: code-group

```sh [Node.js]
npm i structured-outputs
```

```sh [Deno]
deno add jsr:@crosshatch/structured-outputs
```

:::

## Node.js-specific Setup

The NPM package does not contain a CommonJS build; only ES Modules are supported. Therefore, we must
specify `"module"` as the value of the `package.json`'s `type` field.

```diff
{
  // ...
+ "type": "module"
}
```
