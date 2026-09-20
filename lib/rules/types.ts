/**
 * TypeGen deterministic ruleset — sample-data type-analysis & safety checks.
 * These checks run WITHOUT any LLM so the verdict is explainable
 * (AGENTS.md §3 web-research gate). They flag ambiguous / risky fields that
 * the model (or a human) should double-check before publishing types.
 *
 * Domain standards embedded:
 *  - TypeScript Everyday Types (handbook):
 *    https://www.typescriptlang.org/docs/handbook/2/everyday-types.html
 *  - OpenAPI 3.1 Schema Object:
 *    https://spec.openapis.org/oas/v3.1.0#schema-object
 *  - Zod (runtime validation to back inferred types):
 *    https://zod.dev
 */
export const RULESET_VERSION = 'typegen@2026-10-28'

export type FieldSeverity = 'low' | 'medium' | 'high'

export interface FieldFinding {
  id: string
  field: string
  title: string
  severity: FieldSeverity
  detail: string
  remediation: string
  ref: string
  source: 'Rule-based'
}

const TS_HANDBOOK = 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'
const OPENAPI = 'https://spec.openapis.org/oas/v3.1.0#schema-object'
const ZOD = 'https://zod.dev'

function typeOf(v: unknown): string {
  if (v === null) return 'null'
  if (Array.isArray(v)) return 'array'
  return typeof v
}

// Collect the set of distinct types seen for a field path across sample records.
function collectFieldTypes(records: unknown[]): Map<string, Set<string>> {
  const types = new Map<string, Set<string>>()
  const walk = (obj: unknown, prefix: string) => {
    if (Array.isArray(obj)) {
      for (const item of obj) walk(item, prefix)
      return
    }
    if (obj && typeof obj === 'object') {
      for (const [k, val] of Object.entries(obj as Record<string, unknown>)) {
        const key = prefix ? `${prefix}.${k}` : k
        if (!types.has(key)) types.set(key, new Set())
        types.get(key)!.add(typeOf(val))
        if (val && typeof val === 'object') walk(val, key)
      }
      return
    }
    if (!types.has(prefix)) types.set(prefix, new Set())
    types.get(prefix)!.add(typeOf(obj))
  }
  for (const r of records) walk(r, '')
  return types
}

export function analyzeSample(sample: unknown[]): {
  rulesetVersion: string
  findings: FieldFinding[]
} {
  const findings: FieldFinding[] = []
  if (!Array.isArray(sample) || sample.length === 0) {
    return { rulesetVersion: RULESET_VERSION, findings }
  }
  const fieldTypes = collectFieldTypes(sample)

  for (const [field, tset] of fieldTypes.entries()) {
    // Mixed primitive types for the same field → ambiguous.
    const primitives = new Set([...tset].filter((t) => t !== 'array' && t !== 'object'))
    if (primitives.size > 1) {
      findings.push({
        id: 'TG-MIXED-01',
        field,
        title: 'Field has mixed primitive types across samples',
        severity: 'medium',
        detail: `Field "${field}" appears as: ${[...primitives].join(', ')}.`,
        remediation:
          'Union the types (e.g. `string | number`) or normalize the source. Add a runtime guard. ' +
          'See TypeScript Handbook on unions; back it with Zod for validation.',
        ref: TS_HANDBOOK,
        source: 'Rule-based',
      })
    }
    // null appears alongside a concrete type → nullable.
    if (tset.has('null') && tset.size > 1) {
      findings.push({
        id: 'TG-NULL-01',
        field,
        title: 'Field is sometimes null',
        severity: 'low',
        detail: `Field "${field}" is null in some samples.`,
        remediation: 'Mark the field optional/nullable (e.g. `T | null`) and handle the null case in code.',
        ref: TS_HANDBOOK,
        source: 'Rule-based',
      })
    }
    // OpenAPI: a field whose sample can be object OR array is not a stable schema.
    if (tset.has('object') && tset.has('array')) {
      findings.push({
        id: 'TG-OAS-01',
        field,
        title: 'Ambiguous shape for OpenAPI schema',
        severity: 'medium',
        detail: `Field "${field}" is sometimes an object and sometimes an array.`,
        remediation: 'Define one stable shape (or an allOf/oneOf) before publishing an OpenAPI Schema Object.',
        ref: OPENAPI,
        source: 'Rule-based',
      })
    }
  }

  // Recommend a validation layer (defense-in-depth for inferred types).
  findings.push({
    id: 'TG-VAL-01',
    field: '*',
    title: 'Inferred types need a runtime validator',
    severity: 'low',
    detail: 'Types inferred from a sample are only as complete as the sample.',
    remediation: 'Back inferred types with a runtime validator (e.g. Zod) so unexpected shapes fail loudly at the boundary.',
    ref: ZOD,
    source: 'Rule-based',
  })

  return { rulesetVersion: RULESET_VERSION, findings }
}

// Honesty rule (AGENTS.md §3): inference is sample-bound, never a guarantee.
export const HONESTY_NOTE =
  'Types are inferred from the SAMPLE you provide; fields not present in the sample are invisible. ' +
  'Always validate with real traffic and add runtime checks (Zod) before trusting inferred types.'
