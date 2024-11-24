# Setup

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

## Node.js-specifics

### Use Modules

The `structured-outputs` NPM package does not contain a CommonJS build; only ESModules are
supported. Therefore, we must specify `module` as the value of the `package.json`'s `type` field.

```diff
{
  // ...
+ "type": "module"
}
```
