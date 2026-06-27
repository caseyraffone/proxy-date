# ProxyDate MVP Plan

## Premise
People do not have time to manually swipe/message forever. Each user has a private AI dating proxy that understands their preferences, values, lifestyle, communication style, dealbreakers, and goals. Proxies can meet other proxies, run structured compatibility checks, and recommend high-signal human introductions.

## Core loop
1. User creates private dating profile + preference profile.
2. App creates a private AI proxy for the user.
3. Two proxies run a short structured compatibility conversation.
4. The system scores alignment, concerns, and suggested date/opening message.
5. If both users opt in, humans get introduced.

## MVP scope
- Profile builder
- Privacy/share controls
- Agent-to-agent compatibility check
- Match report
- Mutual approval before intro

## Safety/privacy rules
- User data stays private by default.
- Proxy is not allowed to disclose private details unless explicitly marked shareable.
- Matching outputs explain uncertainty.
- No claim that AI can guarantee romantic compatibility.
- Humans must consent before being introduced.
- OpenAI/Anthropic keys live server-side only, never in client/mobile bundle.

## Future architecture
Frontend: React/Vite or Expo.
Backend: Node/Express or serverless functions.
Database: Supabase/Postgres.
Auth: Supabase Auth or Clerk.
LLM: server-side calls only.

## Future tables
- users
- dating_profiles
- privacy_rules
- agent_profiles
- match_runs
- match_results
- introductions
