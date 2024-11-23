export function recombineTaggedTemplateArgs(
  strings: TemplateStringsArray,
  values: Array<number | string>,
): string {
  return strings.reduce((acc, cur, i) => `${acc}${cur}${values[i] ?? ""}`, "")
}
