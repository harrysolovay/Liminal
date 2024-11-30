export function recombine(template: TemplateStringsArray, values: Array<unknown>): string {
  const segments = []
  for (let i = 0; i < template.length; i++) {
    segments.push(template[i])
    if (i < values.length) {
      segments.push(String(values[i]))
    }
  }
  return segments.join("")
}
