import { Bug, Database, Gauge, Radio, Terminal, TriangleAlert } from 'lucide-react';
import styles from './devtools-panel.module.css';

type Tone = 'ok' | 'warn' | 'bad' | 'muted';
type Row = { lead: string; text: string; trail?: string; tone?: Tone };
type Pane = {
  tab: string;
  icon: typeof Radio;
  filters: string[];
  rows: Row[];
  views: string[];
  detail: { key: string; value: string; tone?: Tone }[];
};

const TONES: Record<Tone, string> = {
  ok: 'text-emerald-500',
  warn: 'text-amber-500',
  bad: 'text-rose-500',
  muted: 'text-fd-muted-foreground',
};

// Every tab the package ships. Five rows and four detail lines each, so the panes are the same
// height and the window never resizes mid-slide. The carousel keyframes are cut for six of these.
const panes: Pane[] = [
  {
    tab: 'Network',
    icon: Radio,
    filters: ['All', 'Fetch', 'XHR', 'WS', 'SSE'],
    rows: [
      { lead: 'GET', text: '/v1/session', trail: '200', tone: 'ok' },
      { lead: 'POST', text: '/v1/orders', trail: '201', tone: 'ok' },
      { lead: 'GET', text: '/v1/products?page=2', trail: '200', tone: 'ok' },
      { lead: 'GET', text: '/v1/me', trail: '401', tone: 'bad' },
      { lead: 'WS', text: '/live', trail: 'open', tone: 'ok' },
    ],
    views: ['Headers', 'Response', 'Timing', 'Initiator'],
    detail: [
      { key: 'status', value: '401 Unauthorized', tone: 'bad' },
      { key: 'body', value: '{ "error": "token_expired" }' },
      { key: 'waiting', value: '61 ms · downloading 27 ms' },
      { key: 'initiator', value: 'api-client.ts:88' },
    ],
  },
  {
    tab: 'Console',
    icon: Terminal,
    filters: ['All', 'Log', 'Warn', 'Error', 'REPL'],
    rows: [
      { lead: 'log', text: 'session restored' },
      { lead: 'log', text: 'cart hydrated, 3 items' },
      { lead: 'warn', text: 'slow render, 142 ms', tone: 'warn' },
      { lead: 'error', text: 'TypeError: cart is undefined', tone: 'bad' },
      { lead: '>', text: 'store.getState().user' },
    ],
    views: ['Message', 'Arguments', 'Source'],
    detail: [
      { key: 'level', value: 'error', tone: 'bad' },
      { key: 'origin', value: 'CartScreen.tsx:42' },
      { key: 'argument', value: '{ userId: 8812, retry: false }' },
      { key: 'repeated', value: '3 times' },
    ],
  },
  {
    tab: 'Crash',
    icon: TriangleAlert,
    filters: ['All', 'Fatal', 'Rejection', 'Render', 'Native'],
    rows: [
      { lead: 'fatal', text: "cannot read 'id' of null", tone: 'bad' },
      { lead: 'render', text: 'CartScreen boundary caught', tone: 'bad' },
      { lead: 'reject', text: 'refresh failed, 401', tone: 'warn' },
      { lead: 'native', text: 'NSInvalidArgumentException', tone: 'bad' },
      { lead: 'note', text: 'reported at next launch' },
    ],
    views: ['Stack', 'Component stack', 'Breadcrumbs', 'Device'],
    detail: [
      { key: 'message', value: "cannot read 'id' of null", tone: 'bad' },
      { key: 'stack', value: 'at CartScreen (CartScreen.tsx:42:11)' },
      { key: 'component', value: 'CartScreen › CartList › Row' },
      { key: 'device', value: 'iPhone 15 · iOS 18.2 · build 412' },
    ],
  },
  {
    tab: 'Storage',
    icon: Database,
    filters: ['All', 'Async', 'MMKV', 'Secure', 'Custom'],
    rows: [
      { lead: 'async', text: 'auth.token', trail: 'string' },
      { lead: 'async', text: 'onboarding.seen', trail: 'boolean' },
      { lead: 'mmkv', text: 'cart.items', trail: 'json' },
      { lead: 'secure', text: 'refresh.key', trail: 'string' },
      { lead: 'custom', text: 'feature.flags', trail: 'json' },
    ],
    views: ['Value', 'Type', 'Edit'],
    detail: [
      { key: 'key', value: 'auth.token' },
      { key: 'store', value: 'AsyncStorage · async' },
      { key: 'type', value: 'string · 184 bytes' },
      { key: 'value', value: '"eyJhbGciOiJIUzI1NiIsInR5cCI6…"' },
    ],
  },
  {
    tab: 'Perf',
    icon: Gauge,
    filters: ['All', 'Frames', 'Memory', 'Long tasks', 'Startup'],
    rows: [
      { lead: 'fps', text: 'JS thread', trail: '58', tone: 'ok' },
      { lead: 'fps', text: 'lowest this minute', trail: '31', tone: 'warn' },
      { lead: 'heap', text: 'Hermes allocated', trail: '42 MB' },
      { lead: 'task', text: 'long task, main bundle', trail: '180 ms', tone: 'warn' },
      { lead: 'task', text: 'long task, image decode', trail: '96 ms', tone: 'warn' },
    ],
    views: ['Startup', 'Frames', 'Memory'],
    detail: [
      { key: 'bundle', value: '412 ms' },
      { key: 'first render', value: '780 ms' },
      { key: 'runtime init', value: '96 ms' },
      { key: 'note', value: 'JS heap, not app memory' },
    ],
  },
  {
    tab: 'Debug',
    icon: Bug,
    filters: ['All', 'JS thread', 'Main thread'],
    rows: [
      { lead: 'block', text: 'JS thread, 3 s' },
      { lead: 'block', text: 'main thread, 3 s' },
      { lead: 'crash', text: 'JS thread', tone: 'bad' },
      { lead: 'crash', text: 'main thread', tone: 'bad' },
      { lead: 'note', text: 'needs a development build' },
    ],
    views: ['Effect', 'Why'],
    detail: [
      { key: 'armed', value: 'tap again to crash', tone: 'bad' },
      { key: 'js block', value: 'shows as a long task, drops JS fps' },
      { key: 'main block', value: 'freezes the screen, JS stays fine' },
      { key: 'crash', value: 'read back off disk at next launch' },
    ],
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
    <div className="rounded-[18px] border bg-fd-secondary p-1.5 shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
      <div className="flex gap-1.5">
        {/* On the frame itself, the way a mac sidebar is part of the window rather than a panel
            inside it. No divider: the gap to the content card is the separation. */}
        <div className="shrink-0 space-y-0.5 p-1 sm:w-[132px]">
          {panes.map((pane, i) => (
            <span
              key={pane.tab}
              className={`${styles.tab} relative isolate flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.75rem] font-medium`}
              style={{ animationDelay: `${4 * i - 24}s` }}
            >
              <span className="absolute inset-0 -z-10 rounded-md bg-fd-card" />
              <pane.icon className="size-3.5 shrink-0 text-fd-primary" />
              <span className="max-sm:hidden">{pane.tab}</span>
            </span>
          ))}
        </div>

        {/* The content is its own inset card, lighter than the chrome around it, which is the one
            thing that makes a window read as a window rather than as a bordered box. */}
        <div className="min-w-0 flex-1 overflow-hidden rounded-xl border bg-fd-background">
          <div className={`${styles.track} flex`}>
            {[...panes, panes[0]].map((pane, i) => (
              <div
                key={`${pane.tab}-${i}`}
                className="grid w-full shrink-0 sm:grid-cols-[1.15fr_1fr]"
                aria-hidden={i === panes.length}
              >
                <div className="border-fd-border/70 sm:border-e">
                  <div className="flex items-center gap-1.5 border-b px-4 py-2">
                    {pane.filters.map((filter, f) => (
                      <span
                        key={filter}
                        className={`rounded-full px-2 py-0.5 text-[0.6875rem] ${
                          f === 0
                            ? 'bg-fd-primary text-fd-primary-foreground'
                            : 'text-fd-muted-foreground'
                        }`}
                      >
                        {filter}
                      </span>
                    ))}
                  </div>
                  <ul className="divide-y">
                    {pane.rows.map((row) => (
                      <li
                        key={row.text}
                        className="flex items-center gap-3 px-4 py-2.5 font-mono text-[0.75rem]"
                      >
                        <span className="w-12 shrink-0 text-fd-muted-foreground">{row.lead}</span>
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
                    <li className="flex items-center gap-3 px-4 py-2.5 font-mono text-[0.75rem]">
                      <span className="w-12 shrink-0 text-fd-muted-foreground">GET</span>
                      <span className="truncate text-fd-foreground">/v1/feed</span>
                      <span className="ms-auto h-1 w-16 shrink-0 overflow-hidden rounded-full bg-fd-secondary">
                        <span
                          className={`${styles.flow} block h-full w-1/3 rounded-full bg-fd-primary`}
                        />
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="max-sm:hidden">
                  <div className="flex items-center gap-4 border-b px-4 py-2 text-[0.6875rem]">
                    {pane.views.map((view, v) => (
                      <span
                        key={view}
                        className={v === 0 ? 'font-medium' : 'text-fd-muted-foreground'}
                      >
                        {view}
                      </span>
                    ))}
                  </div>
                  <dl className="divide-y">
                    {pane.detail.map((line) => (
                      <div
                        key={line.key}
                        className="flex gap-3 px-4 py-2.5 font-mono text-[0.75rem]"
                      >
                        <dt className="w-24 shrink-0 text-fd-muted-foreground">{line.key}</dt>
                        <dd className={`truncate ${TONES[line.tone ?? 'muted']}`}>{line.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
