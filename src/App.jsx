import { useMemo, useState } from 'react'
import './App.css'

const starters = [
  {
    id: 'casey',
    name: 'Casey',
    age: 21,
    city: 'Tampa, FL',
    intent: 'Serious, but not forced',
    lifestyle: 'Ambitious, health-focused, early mornings, building startups, private equity internship.',
    values: 'Drive, loyalty, curiosity, emotional directness, family, self-improvement.',
    interests: 'Running, WHOOP/fitness, AI products, finance, coffee, beach weekends, live sports.',
    dealbreakers: 'Low ambition, inconsistent communication, heavy partying every weekend, no curiosity.',
    shareRules: 'Can share goals, lifestyle, values, interests. Do not share private finances, exact schedule, or journal-level details.'
  },
  {
    id: 'maya',
    name: 'Maya',
    age: 22,
    city: 'St. Petersburg, FL',
    intent: 'Relationship-minded, slow build',
    lifestyle: 'Active, social but grounded, likes routines, works in healthcare analytics, values weekends outside.',
    values: 'Kindness, ambition without ego, consistency, humor, health, family.',
    interests: 'Pilates, beach walks, restaurants, dogs, podcasts, travel, cooking nights.',
    dealbreakers: 'Arrogance, bad communication, no work ethic, disrespect toward service workers.',
    shareRules: 'Can share hobbies, values, dating goals, and lifestyle. Do not share family details or workplace specifics.'
  }
]

const questions = [
  'What does a good weekday look like for your human?',
  'What kind of relationship pace feels healthy?',
  'Where would your humans naturally overlap without forcing it?',
  'What friction should be disclosed before an intro?',
  'What first date would create signal instead of small talk?'
]

function scorePair(a, b) {
  const textA = `${a.intent} ${a.lifestyle} ${a.values} ${a.interests}`.toLowerCase()
  const textB = `${b.intent} ${b.lifestyle} ${b.values} ${b.interests}`.toLowerCase()
  const keywords = ['ambition', 'ambitious', 'health', 'family', 'routine', 'communication', 'curiosity', 'active', 'fitness', 'travel', 'humor', 'loyalty']
  const overlap = keywords.filter((word) => textA.includes(word) && textB.includes(word))
  const dealbreakerRisk = a.dealbreakers.toLowerCase().split(',').some((d) => textB.includes(d.trim())) || b.dealbreakers.toLowerCase().split(',').some((d) => textA.includes(d.trim()))
  const base = 72 + Math.min(overlap.length * 4, 18) - (dealbreakerRisk ? 12 : 0)
  return { score: Math.max(42, Math.min(96, base)), overlap }
}

function makeReport(a, b) {
  const { score, overlap } = scorePair(a, b)
  const strong = score >= 82
  return {
    score,
    verdict: strong ? 'Strong intro candidate' : score >= 70 ? 'Worth a low-pressure intro' : 'Proceed carefully',
    overlap: overlap.length ? overlap : ['lifestyle intent', 'communication fit', 'shared curiosity'],
    why: [
      `${a.name} and ${b.name} both appear to value intentionality over random dating app momentum.`,
      `The strongest signal is lifestyle compatibility: both profiles suggest they would respect routines, ambition, and health rather than compete with them.`,
      `Their dating intent is aligned enough for a first conversation without forcing high stakes too early.`
    ],
    friction: [
      `${a.name}'s schedule/building mode may require someone who is okay with focused work blocks.`,
      `${b.name}'s slow-build preference means the first interaction should feel calm and human, not over-optimized.`,
      'The proxies recommend avoiding résumé-style conversation and testing natural humor/comfort quickly.'
    ],
    firstDate: 'Coffee walk on Bayshore or a casual early dinner somewhere quiet enough for real conversation.',
    opener: `Hey ${b.name} — our proxies think we’d actually have a good conversation beyond the usual app small talk. Want to grab coffee this week and see if they’re right?`,
    privacyNote: 'No sensitive details were disclosed. The report used private context for reasoning but only shared approved lifestyle/values-level summaries.'
  }
}

function Field({ label, value, onChange, textarea = true }) {
  const Cmp = textarea ? 'textarea' : 'input'
  return (
    <label className="field">
      <span>{label}</span>
      <Cmp value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  )
}

function App() {
  const [left, setLeft] = useState(starters[0])
  const [right, setRight] = useState(starters[1])
  const [active, setActive] = useState(false)
  const [approved, setApproved] = useState({ left: false, right: false })
  const report = useMemo(() => makeReport(left, right), [left, right])

  const update = (side, key, value) => {
    const setter = side === 'left' ? setLeft : setRight
    setter((p) => ({ ...p, [key]: value }))
    setApproved({ left: false, right: false })
  }

  return (
    <main>
      <nav className="nav">
        <div className="brand"><span>ProxyDate</span><small>AI dating proxies</small></div>
        <a href="#demo">Run demo</a>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Dating apps waste your time. Your proxy should not.</div>
          <h1>Let your AI filter the dating pool before you spend your evening.</h1>
          <p>
            ProxyDate lets two private AI dating proxies test compatibility, surface friction, and recommend human introductions only when there is real signal.
          </p>
          <div className="actions">
            <a className="primary" href="#demo">Try the proxy date</a>
            <a className="secondary" href="#safety">Privacy rules</a>
          </div>
        </div>
        <div className="hero-card">
          <div className="match-badge">{report.score}% fit</div>
          <h3>{report.verdict}</h3>
          <p>{left.name}'s proxy and {right.name}'s proxy found meaningful overlap in {report.overlap.slice(0, 3).join(', ')}.</p>
          <div className="mini-chat">
            <p><b>{left.name}'s proxy:</b> I can share values and lifestyle, not private journal context.</p>
            <p><b>{right.name}'s proxy:</b> Good. Let’s test routines, intent, and communication style.</p>
          </div>
        </div>
      </section>

      <section className="grid" id="demo">
        {[
          ['left', left, setLeft],
          ['right', right, setRight]
        ].map(([side, person]) => (
          <div className="panel" key={side}>
            <div className="panel-head">
              <span>{side === 'left' ? 'Your proxy' : 'Their proxy'}</span>
              <button onClick={() => side === 'left' ? setLeft(starters[0]) : setRight(starters[1])}>Reset</button>
            </div>
            <div className="two">
              <Field textarea={false} label="Name" value={person.name} onChange={(v) => update(side, 'name', v)} />
              <Field textarea={false} label="City" value={person.city} onChange={(v) => update(side, 'city', v)} />
            </div>
            <Field textarea={false} label="Dating intent" value={person.intent} onChange={(v) => update(side, 'intent', v)} />
            <Field label="Lifestyle" value={person.lifestyle} onChange={(v) => update(side, 'lifestyle', v)} />
            <Field label="Values" value={person.values} onChange={(v) => update(side, 'values', v)} />
            <Field label="Interests" value={person.interests} onChange={(v) => update(side, 'interests', v)} />
            <Field label="Dealbreakers" value={person.dealbreakers} onChange={(v) => update(side, 'dealbreakers', v)} />
            <Field label="Share rules" value={person.shareRules} onChange={(v) => update(side, 'shareRules', v)} />
          </div>
        ))}
      </section>

      <section className="run-panel">
        <button className="run" onClick={() => setActive(true)}>{active ? 'Re-run proxy date' : 'Run proxy date'}</button>
        <p>Simulates a structured compatibility conversation between two private AI proxies.</p>
      </section>

      {active && (
        <section className="results">
          <div className="transcript panel">
            <div className="panel-head"><span>Proxy conversation</span><small>Structured, not flirty</small></div>
            {questions.map((q, i) => (
              <div className="turn" key={q}>
                <p className="q">{q}</p>
                <p><b>{left.name}'s proxy:</b> Based on approved context, {left.name} is likely compatible when there is {report.overlap[i % report.overlap.length]} and clear intent.</p>
                <p><b>{right.name}'s proxy:</b> {right.name} would respond well to consistency, low-pressure plans, and direct but warm communication.</p>
              </div>
            ))}
          </div>

          <div className="report panel">
            <div className="score"><span>{report.score}</span><small>/100</small></div>
            <h2>{report.verdict}</h2>
            <div className="chips">{report.overlap.map((o) => <span key={o}>{o}</span>)}</div>
            <h3>Why it could work</h3>
            <ul>{report.why.map((x) => <li key={x}>{x}</li>)}</ul>
            <h3>Potential friction</h3>
            <ul>{report.friction.map((x) => <li key={x}>{x}</li>)}</ul>
            <div className="recommendation"><b>First date:</b> {report.firstDate}</div>
            <div className="opener"><b>Suggested opener:</b> “{report.opener}”</div>
            <p className="privacy">{report.privacyNote}</p>
            <div className="approve-row">
              <button className={approved.left ? 'approved' : ''} onClick={() => setApproved((p) => ({ ...p, left: !p.left }))}>{left.name} approves</button>
              <button className={approved.right ? 'approved' : ''} onClick={() => setApproved((p) => ({ ...p, right: !p.right }))}>{right.name} approves</button>
            </div>
            {approved.left && approved.right && <div className="intro">Both humans approved. Open private chat / exchange contact next.</div>}
          </div>
        </section>
      )}

      <section className="principles" id="safety">
        <div>
          <h2>The startup wedge</h2>
          <p>Start as a high-signal dating filter, not a replacement for humans. The proxy does the boring qualification. The human still chooses.</p>
        </div>
        <div className="principle-card"><b>Private by default</b><span>Agents reason over context but only disclose approved summaries.</span></div>
        <div className="principle-card"><b>Mutual consent</b><span>No intro unless both users approve the report.</span></div>
        <div className="principle-card"><b>Time saved</b><span>The product competes against wasted swipes, dead chats, and low-signal first dates.</span></div>
      </section>
    </main>
  )
}

export default App
