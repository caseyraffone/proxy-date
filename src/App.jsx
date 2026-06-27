import { useMemo, useState } from 'react'
import './App.css'

const aiPrompt = `Based on everything you know about me, create a dating-safe profile for an AI dating proxy.

Include:
- name or nickname
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

Do not include private secrets, financial details, exact addresses, medical details, family drama, journal-level details, or anything I would not want shared with a potential match.

Return it in clear sections or JSON.`

const sampleSecondBrain = `Name: Casey
City: Tampa, FL
Dating intent: Serious but low-pressure. Open to something real if it feels natural.
Lifestyle: Ambitious, health-focused, early mornings, running, building AI products, finance/private equity internship, likes productive routines.
Values: Drive, loyalty, curiosity, emotional directness, family, self-improvement, humor.
Interests: Running, WHOOP/fitness, AI products, finance, coffee, beach weekends, live sports, restaurants around Tampa/St. Pete.
Ideal partner: Warm, consistent, ambitious, emotionally mature, funny, active, and supportive of a busy schedule.
Dealbreakers: Low ambition, inconsistent communication, heavy partying every weekend, no curiosity, arrogance.
Communication style: Direct, playful, prefers clear interest over games.
Preferred first dates: Coffee walk on Bayshore, casual dinner, beach walk, low-pressure drink somewhere quiet enough to talk.
Privacy/share rules: Can share goals, lifestyle, values, interests, dating intent, and general location. Do not share exact schedule, finances, private journal details, family details, or anything sensitive.`

const sampleMatch = {
  name: 'Maya',
  city: 'St. Petersburg, FL',
  intent: 'Relationship-minded, slow build',
  lifestyle: 'Active, social but grounded, likes routines, works in healthcare analytics, values weekends outside.',
  values: 'Kindness, ambition without ego, consistency, humor, health, family.',
  interests: 'Pilates, beach walks, restaurants, dogs, podcasts, travel, cooking nights.',
  idealPartner: 'Driven but not arrogant, emotionally steady, healthy lifestyle, good humor, clear communication.',
  dealbreakers: 'Arrogance, bad communication, no work ethic, disrespect toward service workers.',
  communication: 'Warm, clear, likes consistency and dislikes guessing games.',
  firstDates: 'Coffee, walks, casual dinner, farmers market, beach sunset.',
  shareRules: 'Can share hobbies, values, dating goals, and lifestyle. Do not share family details or workplace specifics.'
}

const blankProxy = {
  name: 'You',
  city: '',
  intent: '',
  lifestyle: '',
  values: '',
  interests: '',
  idealPartner: '',
  dealbreakers: '',
  communication: '',
  firstDates: '',
  shareRules: 'Only share dating-safe summaries. Do not share private secrets, finances, exact address, medical details, or journal-level context.'
}

function extractField(text, labels) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean)
  for (const label of labels) {
    const re = new RegExp(`^${label}\\s*:\\s*(.+)$`, 'i')
    const line = lines.find((l) => re.test(l))
    if (line) return line.match(re)?.[1]?.trim() || ''
  }
  return ''
}

function parseSecondBrain(text) {
  const fallback = text.trim()
  return {
    name: extractField(text, ['name', 'nickname']) || 'You',
    city: extractField(text, ['city', 'location', 'city/location context']) || 'Location not set',
    intent: extractField(text, ['dating intent', 'intent']) || 'Intent not specified',
    lifestyle: extractField(text, ['lifestyle']) || fallback.slice(0, 220),
    values: extractField(text, ['values']) || 'Values not specified',
    interests: extractField(text, ['interests', 'hobbies']) || 'Interests not specified',
    idealPartner: extractField(text, ['ideal partner', 'partner']) || 'Ideal partner not specified',
    dealbreakers: extractField(text, ['dealbreakers', 'red flags']) || 'Dealbreakers not specified',
    communication: extractField(text, ['communication style', 'communication']) || 'Communication style not specified',
    firstDates: extractField(text, ['preferred first dates', 'first dates', 'date preferences']) || 'First-date preferences not specified',
    shareRules: extractField(text, ['privacy/share rules', 'share rules', 'privacy rules']) || blankProxy.shareRules
  }
}

function keywordOverlap(a, b) {
  const textA = Object.values(a).join(' ').toLowerCase()
  const textB = Object.values(b).join(' ').toLowerCase()
  const keywords = ['ambition', 'ambitious', 'health', 'family', 'routine', 'communication', 'curiosity', 'active', 'fitness', 'travel', 'humor', 'loyalty', 'coffee', 'beach', 'direct', 'consistent', 'kindness']
  return keywords.filter((word) => textA.includes(word) && textB.includes(word))
}

function makeReport(a, b) {
  const overlap = keywordOverlap(a, b)
  const score = Math.max(58, Math.min(96, 68 + overlap.length * 3))
  return {
    score,
    verdict: score >= 84 ? 'Strong intro candidate' : score >= 74 ? 'Worth a low-pressure intro' : 'Needs more signal first',
    overlap: overlap.length ? overlap.slice(0, 8) : ['dating intent', 'communication style', 'location context'],
    why: [
      `${a.name || 'Your'} proxy and ${b.name}'s proxy found overlap in values, lifestyle, and first-date energy.`,
      `Both profiles appear to prefer intentional dating over random swiping and dead-end texting.`,
      `The best signal is that the match can be evaluated before either human has to spend a night on a low-fit date.`
    ],
    friction: [
      `${a.name || 'Your'} proxy should verify that ambition and schedule intensity feel attractive, not intimidating.`,
      `${b.name}'s proxy should verify communication expectations early so neither person has to guess.`,
      'The human intro should stay casual. Do not overstate compatibility from an AI report.'
    ],
    firstDate: a.firstDates && b.firstDates ? `Pick overlap between: ${a.firstDates} / ${b.firstDates}` : 'Coffee walk or quiet casual drink where conversation is easy.',
    opener: `Hey ${b.name} — our AI proxies think we have enough real overlap to skip the usual app small talk. Want to grab coffee and see if they’re right?`,
    privacyNote: 'The proxies reasoned over dating-safe summaries only. Sensitive private context should stay out of match reports unless the user explicitly marks it shareable.'
  }
}

function Field({ label, value, onChange, textarea = true }) {
  const Cmp = textarea ? 'textarea' : 'input'
  return <label className="field"><span>{label}</span><Cmp value={value} onChange={(e) => onChange(e.target.value)} /></label>
}

function ProxyCard({ title, proxy, setProxy }) {
  const update = (key, value) => setProxy((p) => ({ ...p, [key]: value }))
  return (
    <div className="panel proxy-card">
      <div className="panel-head"><span>{title}</span><small>Dating-safe summary</small></div>
      <div className="two">
        <Field textarea={false} label="Name" value={proxy.name} onChange={(v) => update('name', v)} />
        <Field textarea={false} label="City" value={proxy.city} onChange={(v) => update('city', v)} />
      </div>
      <Field textarea={false} label="Dating intent" value={proxy.intent} onChange={(v) => update('intent', v)} />
      <Field label="Lifestyle" value={proxy.lifestyle} onChange={(v) => update('lifestyle', v)} />
      <Field label="Values" value={proxy.values} onChange={(v) => update('values', v)} />
      <Field label="Interests" value={proxy.interests} onChange={(v) => update('interests', v)} />
      <Field label="Ideal partner" value={proxy.idealPartner} onChange={(v) => update('idealPartner', v)} />
      <Field label="Dealbreakers" value={proxy.dealbreakers} onChange={(v) => update('dealbreakers', v)} />
      <Field label="Communication style" value={proxy.communication} onChange={(v) => update('communication', v)} />
      <Field label="Preferred first dates" value={proxy.firstDates} onChange={(v) => update('firstDates', v)} />
      <Field label="Privacy/share rules" value={proxy.shareRules} onChange={(v) => update('shareRules', v)} />
    </div>
  )
}

function App() {
  const [rawSummary, setRawSummary] = useState(sampleSecondBrain)
  const [myProxy, setMyProxy] = useState(parseSecondBrain(sampleSecondBrain))
  const [matchProxy, setMatchProxy] = useState(sampleMatch)
  const [ran, setRan] = useState(false)
  const [approved, setApproved] = useState({ me: false, them: false })
  const report = useMemo(() => makeReport(myProxy, matchProxy), [myProxy, matchProxy])

  const createProxy = () => {
    setMyProxy(parseSecondBrain(rawSummary))
    setRan(false)
    setApproved({ me: false, them: false })
  }

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(aiPrompt)
  }

  return (
    <main>
      <nav className="nav"><div className="brand"><span>ProxyDate</span><small>second-brain dating proxies</small></div><a href="#demo">Try demo</a></nav>

      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">Your AI knows you better than your dating profile does.</div>
          <h1>Let your second brain find people worth meeting.</h1>
          <p>Ask ChatGPT or Claude for a dating-safe summary of you. Paste it here. ProxyDate turns it into a private dating proxy that can compare compatibility with another person’s proxy before either human wastes time.</p>
          <div className="actions"><a className="primary" href="#prompt">Get the prompt</a><a className="secondary" href="#privacy">How privacy works</a></div>
        </div>
        <div className="hero-card">
          <div className="match-badge">{report.score}%</div>
          <h3>{report.verdict}</h3>
          <p><b>{myProxy.name}</b> ↔ <b>{matchProxy.name}</b></p>
          <p>Agents compare lifestyle, values, dealbreakers, communication style, and date preferences — then humans approve before any intro.</p>
          <div className="mini-chat"><p><b>Your proxy:</b> I can use private context to reason, but only disclose approved summaries.</p><p><b>Their proxy:</b> Good. Let’s test fit before the humans spend a night texting.</p></div>
        </div>
      </section>

      <section className="prompt-panel panel" id="prompt">
        <div className="panel-head"><span>1. Ask your AI for your dating-safe summary</span><button onClick={copyPrompt}>Copy prompt</button></div>
        <pre>{aiPrompt}</pre>
        <p className="privacy">MVP rule: do not connect your ChatGPT/Claude account. Copy/paste only. Do not paste secrets, exact addresses, finances, medical info, or anything too sensitive.</p>
      </section>

      <section className="paste-grid" id="demo">
        <div className="panel">
          <div className="panel-head"><span>2. Paste the answer</span><button onClick={() => setRawSummary(sampleSecondBrain)}>Use sample</button></div>
          <textarea className="big-paste" value={rawSummary} onChange={(e) => setRawSummary(e.target.value)} />
          <button className="run" onClick={createProxy}>Create my dating proxy</button>
        </div>
        <div className="panel explainer">
          <h2>What this creates</h2>
          <p>A dating-safe proxy profile — not your full second brain. It should know enough to find fit, but not enough to leak private life details.</p>
          <ul>
            <li>Uses values, lifestyle, intent, interests, and location context.</li>
            <li>Keeps sensitive personal details out of reports.</li>
            <li>Requires both people to approve before introduction.</li>
          </ul>
        </div>
      </section>

      <section className="grid">
        <ProxyCard title="3. Your generated proxy" proxy={myProxy} setProxy={setMyProxy} />
        <ProxyCard title="4. Sample match proxy" proxy={matchProxy} setProxy={setMatchProxy} />
      </section>

      <section className="run-panel"><button className="run" onClick={() => setRan(true)}>{ran ? 'Re-run proxy match' : 'Run proxy match'}</button><p>Structured compatibility check between two dating proxies.</p></section>

      {ran && <section className="results">
        <div className="transcript panel">
          <div className="panel-head"><span>Proxy-to-proxy screen</span><small>High signal only</small></div>
          {[
            ['Intent', `${myProxy.name} is looking for: ${myProxy.intent}`, `${matchProxy.name} is looking for: ${matchProxy.intent}`],
            ['Lifestyle', `${myProxy.name}'s rhythm: ${myProxy.lifestyle}`, `${matchProxy.name}'s rhythm: ${matchProxy.lifestyle}`],
            ['Values', `${myProxy.name} values: ${myProxy.values}`, `${matchProxy.name} values: ${matchProxy.values}`],
            ['Communication', `${myProxy.name}: ${myProxy.communication}`, `${matchProxy.name}: ${matchProxy.communication}`],
            ['First date', `${myProxy.name} would like: ${myProxy.firstDates}`, `${matchProxy.name} would like: ${matchProxy.firstDates}`]
          ].map(([topic, mine, theirs]) => <div className="turn" key={topic}><p className="q">Check: {topic}</p><p><b>{myProxy.name}'s proxy:</b> {mine}</p><p><b>{matchProxy.name}'s proxy:</b> {theirs}</p></div>)}
        </div>
        <div className="report panel">
          <div className="score"><span>{report.score}</span><small>/100</small></div>
          <h2>{report.verdict}</h2>
          <div className="chips">{report.overlap.map((o) => <span key={o}>{o}</span>)}</div>
          <h3>Why it could work</h3><ul>{report.why.map((x) => <li key={x}>{x}</li>)}</ul>
          <h3>Potential friction</h3><ul>{report.friction.map((x) => <li key={x}>{x}</li>)}</ul>
          <div className="recommendation"><b>First date:</b> {report.firstDate}</div>
          <div className="opener"><b>Suggested opener:</b> “{report.opener}”</div>
          <p className="privacy">{report.privacyNote}</p>
          <div className="approve-row"><button className={approved.me ? 'approved' : ''} onClick={() => setApproved((p) => ({ ...p, me: !p.me }))}>{myProxy.name} approves</button><button className={approved.them ? 'approved' : ''} onClick={() => setApproved((p) => ({ ...p, them: !p.them }))}>{matchProxy.name} approves</button></div>
          {approved.me && approved.them && <div className="intro">Both humans approved. Now open chat / exchange contact / suggest date plan.</div>}
        </div>
      </section>}

      <section className="waitlist panel" id="waitlist">
        <div>
          <div className="eyebrow">Private beta</div>
          <h2>Want your AI proxy to screen real matches?</h2>
          <p>Join the waitlist. Early beta will be concierge-style: paste your dating-safe AI summary, get matched manually, and approve before any intro.</p>
        </div>
        <form name="waitlist" method="POST" data-netlify="true" netlify-honeypot="bot-field">
          <input type="hidden" name="form-name" value="waitlist" />
          <p className="hidden"><label>Don’t fill this out: <input name="bot-field" /></label></p>
          <input name="email" type="email" placeholder="Email" required />
          <input name="city" placeholder="City" />
          <select name="intent" defaultValue="">
            <option value="" disabled>Dating intent</option>
            <option>Something serious</option>
            <option>Open / exploratory</option>
            <option>Just curious about the idea</option>
          </select>
          <button className="run" type="submit">Join private beta</button>
        </form>
      </section>

      <section className="principles" id="privacy">
        <div><h2>The wedge</h2><p>The first product is not “AI dates for you.” It is “your second brain creates a better dating profile and filters low-signal matches.”</p></div>
        <div className="principle-card"><b>Copy/paste MVP</b><span>No account integration needed. Users bring a dating-safe summary from ChatGPT or Claude.</span></div>
        <div className="principle-card"><b>Privacy boundary</b><span>Reason over context, disclose only approved summaries.</span></div>
        <div className="principle-card"><b>Consent gate</b><span>No intro, message, or contact exchange until both humans approve.</span></div>
      </section>
    </main>
  )
}

export default App
