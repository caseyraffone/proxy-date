# ProxyDate

AI dating proxy prototype built around the “second brain dating profile” wedge.

## Concept

Users already use ChatGPT/Claude as a second brain. ProxyDate gives them a prompt to ask their AI for a dating-safe summary, then turns that summary into a private dating proxy. Two proxies can compare compatibility, produce a match report, and only introduce the humans if both approve.

Core line:

> Your AI knows you better than your dating profile does.

## Prototype features

- Landing page explaining the second-brain dating proxy concept
- Copyable ChatGPT/Claude prompt
- Paste area for an AI-generated dating summary
- Local parser that turns the summary into a structured proxy profile
- Editable proxy fields
- Sample match proxy
- Proxy-to-proxy compatibility simulation
- Match score/report
- Suggested first date and opener
- Privacy/share rules
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

- Copy/paste MVP first; no ChatGPT/Claude account connection required
- Private by default
- Agents can reason over dating-safe context but only disclose approved summaries
- Humans must consent before being introduced
- Future LLM API keys must live server-side only, never in frontend code
