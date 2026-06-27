# ProxyDate

AI dating proxy prototype.

Instead of endless swiping and low-signal texting, each user creates a private AI dating proxy. Two proxies run a structured compatibility check, produce a match report, and only introduce the humans if both approve.

## Prototype features

- Landing page for the startup idea
- Editable sample profiles for two dating proxies
- Structured proxy-to-proxy compatibility simulation
- Match score and report
- Privacy/share-rules section
- Mutual approval before intro

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Product principles

- Private by default
- Agents can reason over private context but only disclose approved summaries
- Humans must consent before being introduced
- LLM API keys must live server-side only in a future real backend
