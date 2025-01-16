import { isTemplateStringsArray } from "../../util/isTemplateStringsArray.ts"
import { declareRune } from "../_declareRune.ts"
import type { Annotation, Type, TypeMembers } from "../Type.ts"
import type { AnnotationValue } from "../Type.ts"
import type { AnnotationSubstitution } from "../Type.ts"

export function declareType<T>(
  self: () => Type | ((...args: any) => Type),
  args?: Array<unknown>,
  annotations: Array<Annotation> = [],
): Type<T> {
  return Object.assign(
    annotate,
    declareRune("Type", self, args),
    {
      annotations,
      description() {
        const segments: Array<string> = []
        for (const annotation of annotations) {
          if (annotation) {
            segments.push(
              typeof annotation === "string"
                ? annotation
                : String.raw(annotation.template, ...annotation.substitutions),
            )
          }
        }
        return segments.length ? segments.join(" ") : undefined
      },
    } satisfies TypeMembers,
  ) as never

  function annotate(
    template: TemplateStringsArray,
    ...substitutions: Array<AnnotationSubstitution>
  ): Type<T>
  function annotate(...values: Array<AnnotationValue>): Type<T>
  function annotate(
    e0: TemplateStringsArray | AnnotationValue,
    ...rest: Array<AnnotationSubstitution | AnnotationValue>
  ): Type<T> {
    return declareType(self, args, [
      ...annotations,
      ...isTemplateStringsArray(e0)
        ? [{
          template: e0,
          substitutions: rest as Array<AnnotationSubstitution>,
        }]
        : rest as Array<AnnotationValue>,
    ])
  }
}
