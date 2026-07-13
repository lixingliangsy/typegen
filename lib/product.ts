export interface InputField {
  key: string
  label: string
  type: 'input' | 'textarea' | 'select'
  placeholder?: string
  options?: string[]
}

export const PRODUCT = {
  name: "TypeGen",
  slug: "typegen",
  tagline: "Infer TypeScript types from sample data.",
  description: "Paste JSON or CSV and TypeGen infers clean TypeScript interfaces (or a Zod schema), explains its assumptions, and flags ambiguous fields you should double-check.",
  toolTitle: "Infer types",
  resultLabel: "Your types",
  ctaLabel: "Infer types",
  features: [
  "Sample data to TS types",
  "Interfaces / type aliases / Zod",
  "Explain inferred assumptions",
  "Flag ambiguous fields"
],
  inputs: [
  {
    "key": "sample_data",
    "label": "Paste sample JSON or CSV",
    "type": "textarea",
    "placeholder": "e.g. {\"user\": {\"id\": 1, \"name\": \"Ada\", \"vip\": false}}"
  },
  {
    "key": "style",
    "label": "Output style",
    "type": "select",
    "options": [
      "Interfaces",
      "Type aliases",
      "Zod schema"
    ]
  }
] as InputField[],
  systemPrompt: "You are a TypeScript expert. Given sample data and a preferred output style, infer accurate TypeScript types (or a Zod schema), explain the assumptions you made, and explicitly flag any ambiguous fields (mixed types, nullable, unknown keys). In demo (mock) mode, return a realistic sample type definition following exactly this structure.",
  pricing: [
  {
    "tier": "Free",
    "price": "$0",
    "desc": "12 inferences/mo"
  },
  {
    "tier": "Pro",
    "price": "$19/mo",
    "desc": "Unlimited, save history"
  }
],
  mock: (inputs: Record<string, string>): string => {
  const d = (inputs['sample_data'] || '').trim()
  const st = inputs['style'] || 'Interfaces'
  if (!d) return 'Paste sample JSON or CSV to infer types.'
  let out = 'TYPES (' + st + ')\n\n'
  out += 'interface User {\n'
  out += '  id: number;\n'
  out += '  name: string;\n'
  out += '  vip: boolean;\n}\n\n'
  out += 'Assumptions: id is always a number; vip inferred boolean from the sample.\n'
  out += 'Ambiguous: if "vip" can also be null, mark it "boolean | null".\n'
  out += '\n--- (Mock demo. Paste your real data for tailored types.)'
  return out
}
}
