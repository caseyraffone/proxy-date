# ProxyDate MVP Plan

## Premise
People do not have time to manually swipe/message forever. Many users already have a personal AI/second brain that understands their values, lifestyle, interests, communication patterns, and preferences better than a dating profile does.

ProxyDate helps a user ask ChatGPT/Claude for a dating-safe summary, paste that summary into the app, and turn it into a private dating proxy. Proxies compare compatibility with other proxies and recommend human introductions only after both users approve.

## Positioning
Primary: “Your AI knows you better than your dating profile does.”
Secondary: “Let your second brain find people worth meeting.”

## MVP flow
1. User copies a prompt from ProxyDate.
2. User pastes it into ChatGPT/Claude.
3. User pastes the AI-generated dating-safe summary back into ProxyDate.
4. ProxyDate parses it into structured fields:
   - name
   - city/location context
   - dating intent
   - lifestyle
   - values
   - interests
   - ideal partner
   - dealbreakers
   - communication style
   - preferred first dates
   - privacy/share rules
5. User runs a proxy match against a sample/real proxy.
6. App outputs:
   - compatibility score
   - why it could work
   - possible friction
   - shared signals
   - recommended first date
   - suggested opener
   - privacy note
7. Both humans approve before any intro.

## What the MVP intentionally avoids
- No ChatGPT/Claude OAuth or account connection
- No scraping user AI history
- No backend yet
- No real LLM API calls yet
- No auth/database yet
- No auto-messaging humans

## Safety/privacy rules
- User data stays private by default.
- Do not ask users to paste secrets, exact addresses, finances, medical info, or journal-level details.
- Proxy can reason over context but can only disclose dating-safe approved summaries.
- Matching outputs explain uncertainty.
- No claim that AI can guarantee romantic compatibility.
- Humans must consent before being introduced.
- Future OpenAI/Anthropic keys live server-side only, never in client code.

## Future architecture
Frontend: React/Vite or Expo.
Backend: Node/Express or serverless functions.
Database: Supabase/Postgres.
Auth: Supabase Auth or Clerk.
LLM: server-side calls only.

## Future tables
- users
- dating_profiles
- ai_imports
- privacy_rules
- agent_profiles
- match_runs
- match_results
- introductions

## Startup wedge
Start as a high-signal dating filter, not a dating replacement. The product competes against wasted swipes, dead chats, and low-signal first dates.
