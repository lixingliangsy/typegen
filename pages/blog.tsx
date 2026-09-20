import Head from 'next/head'

import { buildFaqJsonLd, buildHowToJsonLd } from '../lib/schema'

const faqs = [
  {
    "question": "What is TypeGen — and when to use it",
    "answer": "TypeGen is a tool that infers clean TypeScript type definitions from sample JSON or CSV, including a Zod schema option, and flags ambiguous fields. Use it when you need accurate types without writing them by hand."
  },
  {
    "question": "How to infer a TypeScript type definition in 10 minutes",
    "answer": "A step-by-step for a first TypeScript type definition using TypeGen: paste sample JSON or CSV, pick an output style, then review the inferred types and flagged fields."
  },
  {
    "question": "Common TypeScript type definition mistakes (and how to avoid them)",
    "answer": "5 recurring errors teams make in a TypeScript type definition, with fixes: guessing field types, ignoring nullable fields, missing unknown keys, mixing type aliases and interfaces, and skipping the Zod option."
  },
  {
    "question": "TypeGen vs. doing it manually",
    "answer": "Trade-offs: speed, cost, and where human review still wins."
  }
] as { question: string; answer: string }[]

const howToBlocks = [
  {
    "name": "How to infer a TypeScript type definition in 10 minutes",
    "steps": [
      {
        "name": "Paste sample data",
        "text": "Paste your sample JSON or CSV so TypeGen can read the field shapes."
      },
      {
        "name": "Pick an output style",
        "text": "Choose interfaces, type aliases, or a Zod schema for the generated types."
      },
      {
        "name": "Review the inferred types",
        "text": "Review the TypeScript type definition and double-check any ambiguous fields TypeGen flagged."
      }
    ]
  }
] as { name: string; steps: { name: string; text: string }[] }[]

export default function Page() {
  const NAME = "TypeGen";
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqJsonLd(faqs)) }}
        />
        {howToBlocks.map((block, i) => (
          <script
            key={`howto-${i}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(buildHowToJsonLd(block.name, block.steps)),
            }}
          />
        ))}

        <title>{NAME} — Blog</title>
        <meta name="description" content={NAME + " — Definitional and how-to posts."} />
      </Head>
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <header className="border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="font-bold text-slate-900">{NAME}</a>
            <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-500">
              <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
              <a href="/integrations" className="hover:text-slate-900">Integrations</a>
              <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
              <a href="/security" className="hover:text-slate-900">Security</a>
              <a href="/blog" className="hover:text-slate-900">Blog</a>
            </nav>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-14">
          <h1 className="text-3xl font-bold text-slate-900">Blog</h1>
          <p className="mt-3 text-slate-600">Definitional and how-to posts that help search engines and humans understand TypeGen.</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">What is TypeGen — and when to use it</h3>
            <p className="mt-2 text-sm text-slate-600">TypeGen is a tool that infers clean TypeScript type definitions from sample JSON or CSV, including a Zod schema option, and flags ambiguous fields. Use it when you need accurate types without writing them by hand.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">How to infer a TypeScript type definition in 10 minutes</h3>
            <p className="mt-2 text-sm text-slate-600">A step-by-step for a first TypeScript type definition using TypeGen: paste sample JSON or CSV, pick an output style, then review the inferred types and flagged fields.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">Common TypeScript type definition mistakes (and how to avoid them)</h3>
            <p className="mt-2 text-sm text-slate-600">5 recurring errors teams make in a TypeScript type definition, with fixes: guessing field types, ignoring nullable fields, missing unknown keys, mixing type aliases and interfaces, and skipping the Zod option.</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-6">
            <h3 className="font-semibold text-slate-900">TypeGen vs. doing it manually</h3>
            <p className="mt-2 text-sm text-slate-600">Trade-offs: speed, cost, and where human review still wins.</p>
          </article>
          </div>
        </main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-slate-500 flex flex-wrap gap-6">
            <a href="/security" className="hover:text-slate-900">Security</a>
            <a href="/use-cases" className="hover:text-slate-900">Use cases</a>
            <a href="/integrations" className="hover:text-slate-900">Integrations</a>
            <a href="/how-it-works" className="hover:text-slate-900">How it works</a>
            <a href="/blog" className="hover:text-slate-900">Blog</a>
          </div>
        </footer>
      </div>
    </>
  )
}
