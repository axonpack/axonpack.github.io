import styles from './devtools-panel.module.css';

type Tone = 'ok' | 'warn' | 'bad' | 'muted';
type Row = { lead: string; text: string; trail?: string; tone?: Tone };
type Pane = { tab: string; rows: Row[]; label: string; detail: string; tone?: Tone };

const TONES: Record<Tone, string> = {
  ok: 'text-emerald-500',
  warn: 'text-amber-500',
  bad: 'text-rose-500',
  muted: 'text-fd-muted-foreground',
};

// Every tab the package ships, three rows and one opened detail each so the panes are the same
// height and the frame never resizes mid-slide. The carousel keyframes are cut for six of these.
const panes: Pane[] = [
  {
    tab: 'Network',
    rows: [
      { lead: 'GET', text: '/v1/session', trail: '200', tone: 'ok' },
      { lead: 'POST', text: '/v1/orders', trail: '201', tone: 'ok' },
      { lead: 'GET', text: '/v1/me', trail: '401', tone: 'bad' },
    ],
    label: 'Response',
    detail: '{ "error": "token_expired" }',
    tone: 'bad',
  },
  {
    tab: 'Console',
    rows: [
      { lead: 'log', text: 'session restored' },
      { lead: 'warn', text: 'slow render, 142 ms', tone: 'warn' },
      { lead: 'error', text: 'TypeError: cart is undefined', tone: 'bad' },
    ],
    label: 'Argument',
    detail: '{ userId: 8812, retry: false }',
  },
  {
    tab: 'Crash',
    rows: [
      { lead: 'fatal', text: "cannot read 'id' of null", tone: 'bad' },
      { lead: 'screen', text: 'CartScreen' },
      { lead: 'device', text: 'iPhone 15 · iOS 18.2' },
    ],
    label: 'Stack',
    detail: 'at CartScreen (CartScreen.tsx:42:11)',
  },
  {
    tab: 'Storage',
    rows: [
      { lead: 'async', text: 'auth.token', trail: 'string' },
      { lead: 'mmkv', text: 'cart.items', trail: 'json' },
      { lead: 'secure', text: 'refresh.key', trail: 'string' },
    ],
    label: 'auth.token',
    detail: '"eyJhbGciOiJIUzI1NiIs…"',
  },
  {
    tab: 'Perf',
    rows: [
      { lead: 'fps', text: 'JS thread', trail: '58', tone: 'ok' },
      { lead: 'heap', text: 'Hermes', trail: '42 MB' },
      { lead: 'task', text: 'long task', trail: '180 ms', tone: 'warn' },
    ],
    label: 'Startup',
    detail: 'bundle 412 ms · first render 780 ms',
  },
  {
    tab: 'Debug',
    rows: [
      { lead: 'block', text: 'JS thread, 3 s' },
      { lead: 'block', text: 'main thread, 3 s' },
      { lead: 'crash', text: 'main thread', tone: 'bad' },
    ],
    label: 'Armed',
    detail: 'tap again to crash',
    tone: 'bad',
  },
];

/**
 * A drawing of the panel rather than a screenshot, so it themes with the page, weighs nothing and
 * can walk its own tabs. The track repeats the first pane at the end: the loop's wrap then lands on
 * an identical frame instead of snapping backwards through five panes.
 *
 * It owns its motion and knows nothing about where it is mounted, so it outlives the hero.
 */
export function DevtoolsPanel() {
  return (
    <div className="w-[272px] rounded-[2.25rem] border bg-fd-secondary p-2.5 shadow-2xl sm:w-[300px]">
      <div className="overflow-hidden rounded-[1.75rem] border bg-fd-background">
        <div className="flex justify-center pt-2.5 pb-1.5">
          <span className="h-1.5 w-16 rounded-full bg-fd-muted-foreground/25" />
        </div>

        <div className="flex items-center gap-2 px-3.5 pb-2">
          <span className="size-2 animate-pulse rounded-full bg-rose-500" />
          <b className="text-[0.8125rem] font-[620]">Devtools</b>
          <span className="ms-auto font-mono text-[0.625rem] text-fd-muted-foreground">
            on device
          </span>
        </div>

        <div className="flex justify-between gap-1.5 border-b px-3.5">
          {panes.map((pane, i) => (
            <span
              key={pane.tab}
              className={`${styles.tab} relative pb-1.5 text-[0.5625rem] font-medium`}
              style={{ animationDelay: `${4 * i - 24}s` }}
            >
              {pane.tab}
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-fd-primary" />
            </span>
          ))}
        </div>

        <div className="overflow-hidden">
          <div className={`${styles.track} flex`}>
            {[...panes, panes[0]].map((pane, i) => (
              <div
                key={`${pane.tab}-${i}`}
                className="w-full shrink-0"
                aria-hidden={i === panes.length}
              >
                <ul className="divide-y">
                  {pane.rows.map((row) => (
                    <li
                      key={row.text}
                      className="flex items-center gap-2 px-3.5 py-2.5 font-mono text-[0.6875rem]"
                    >
                      <span className="w-11 shrink-0 text-fd-muted-foreground">{row.lead}</span>
                      <span className={`truncate ${TONES[row.tone ?? 'muted']}`}>{row.text}</span>
                      {row.trail && (
                        <span
                          className={`ms-auto shrink-0 font-[620] ${TONES[row.tone ?? 'muted']}`}
                        >
                          {row.trail}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>

                <div className="border-t bg-fd-card px-3.5 py-3 font-mono text-[0.6875rem]">
                  <div className="mb-1.5 text-[0.625rem] tracking-wide text-fd-muted-foreground uppercase">
                    {pane.label}
                  </div>
                  <div className={`truncate ${TONES[pane.tone ?? 'muted']}`}>{pane.detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 border-t px-3.5 py-2.5 font-mono text-[0.6875rem]">
          <span className="w-11 shrink-0 text-fd-muted-foreground">GET</span>
          <span className="truncate text-fd-foreground">/v1/feed</span>
          <span className="ms-auto h-1 w-14 shrink-0 overflow-hidden rounded-full bg-fd-secondary">
            <span className={`${styles.flow} block h-full w-1/3 rounded-full bg-fd-primary`} />
          </span>
        </div>
      </div>
    </div>
  );
}
