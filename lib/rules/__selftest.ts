// lib/rules/__selftest.ts — deterministic self-test for TypeGen type rules.
// Run: tsx lib/rules/__selftest.ts
import { analyzeSample, RULESET_VERSION, HONESTY_NOTE } from './types'

let passed = 0
let failed = 0
function assert(name: string, cond: boolean) {
  if (cond) {
    passed++
    console.log('  ok  -', name)
  } else {
    failed++
    console.error('  FAIL -', name)
  }
}

// 1. ruleset carries version + honesty note
assert('RULESET_VERSION is date-stamped', /^typegen@\d{4}-\d{2}-\d{2}$/.test(RULESET_VERSION))
assert('honesty note present', typeof HONESTY_NOTE === 'string' && HONESTY_NOTE.length > 0)

// 2. mixed primitive types across samples flagged
const mixed = analyzeSample([
  { id: 1, vip: true },
  { id: '2', vip: false },
])
assert('mixed id type flagged', mixed.findings.some((f) => f.id === 'TG-MIXED-01' && f.field === 'id'))
assert('mixed finding carries ref', !!mixed.findings.find((f) => f.id === 'TG-MIXED-01')?.ref)

// 3. nullable field flagged
const nullable = analyzeSample([
  { name: 'Ada' },
  { name: null },
])
assert('nullable name flagged', nullable.findings.some((f) => f.id === 'TG-NULL-01' && f.field === 'name'))

// 4. object/array ambiguity flagged
const amb = analyzeSample([
  { meta: { a: 1 } },
  { meta: [{ a: 1 }] },
])
assert('object/array ambiguity flagged', amb.findings.some((f) => f.id === 'TG-OAS-01' && f.field === 'meta'))

// 5. validator recommendation always present
assert('validator recommendation present', mixed.findings.some((f) => f.id === 'TG-VAL-01'))

// 6. clean, uniform sample produces only the validator recommendation
const clean = analyzeSample([
  { id: 1, name: 'Ada', vip: false },
  { id: 2, name: 'Lin', vip: true },
])
assert('clean sample has no mixed/null/ambiguous findings', !clean.findings.some((f) => ['TG-MIXED-01', 'TG-NULL-01', 'TG-OAS-01'].includes(f.id)))

// 7. empty sample yields no findings
const empty = analyzeSample([])
assert('empty sample yields no findings', empty.findings.length === 0)

console.log(`\ntypegen rules selftest: ${passed} passed, ${failed} failed`)
try {
  const fs = require('fs')
  fs.mkdirSync('.data', { recursive: true })
  fs.writeFileSync('.data/selftest-result.json', JSON.stringify({ passed, failed, ok: failed === 0, product: 'typegen' }))
} catch {}
if (failed > 0) process.exit(1)
