import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useLocation,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";
import { motion } from "framer-motion";

import appCss from "../styles.css?url";
import tabIcon from "@/assets/tab.png";

function NotFoundComponent() {
  const { pathname } = useLocation();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { delay, duration: 0.7, ease: "easeOut" as const },
  });

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden bg-[var(--pf-bg)] px-6 font-sans text-[var(--pf-fg)] antialiased selection:bg-[var(--pf-accent)] selection:text-[var(--pf-text-on-accent)]"
      style={{
        backgroundImage:
          "linear-gradient(to right, var(--pf-grid) 1px, transparent 1px), linear-gradient(to bottom, var(--pf-grid) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ background: "var(--pf-accent-glow)", opacity: 0.35 }}
      />

      <header className="relative mx-auto flex w-full max-w-6xl items-center pt-8">
        <Link to="/" className="text-lg font-black tracking-tight text-[var(--pf-fg)]">
          Abdullah Azmi<span style={{ color: "var(--pf-accent)" }}>.</span>
        </Link>
      </header>

      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center py-16 text-center">
        <motion.span
          {...rise(0)}
          className="mb-8 inline-block rounded-full border border-[var(--pf-card-border)] px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-[var(--pf-fg-subtle)]"
        >
          Error 404
        </motion.span>

        <motion.h1
          {...rise(0.1)}
          aria-label="404"
          className="select-none text-[34vw] font-black leading-[0.8] tracking-tighter sm:text-[13rem] md:text-[17rem]"
        >
          4<span style={{ color: "var(--pf-accent)" }}>0</span>4
        </motion.h1>

        <motion.h2
          {...rise(0.25)}
          className="mt-8 text-3xl font-black leading-[0.95] tracking-tight md:text-5xl"
        >
          This page took a <span style={{ color: "var(--pf-accent)" }}>wrong turn</span>.
        </motion.h2>

        <motion.p {...rise(0.35)} className="mt-5 max-w-md text-base text-[var(--pf-fg-muted)] md:text-lg">
          The page you're looking for doesn't exist or has been moved.
        </motion.p>

        <motion.code
          {...rise(0.45)}
          className="mt-8 max-w-full truncate rounded-full border border-[var(--pf-card-border)] bg-[var(--pf-card-bg)] px-5 py-2 font-mono text-xs text-[var(--pf-fg-subtle)] md:text-sm"
        >
          GET <span className="text-[var(--pf-fg)]">{pathname}</span>{" "}
          <span style={{ color: "var(--pf-accent)" }}>&rarr; 404 Not Found</span>
        </motion.code>

        <motion.div {...rise(0.55)} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-[var(--pf-fg)] px-6 py-3 text-sm font-semibold text-[var(--pf-bg)] transition hover:opacity-90"
          >
            Back to home
          </Link>
          <a
            href="/#projects"
            className="rounded-full border border-[var(--pf-glass-border-strong)] px-6 py-3 text-sm font-semibold transition hover:bg-[var(--pf-fg)] hover:text-[var(--pf-bg)]"
          >
            View projects
          </a>
        </motion.div>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Abdullah's Portfolio" },
      { name: "description", content: "Portfolio Project" },
      { name: "author", content: "Abdullah Azmi" },
      { property: "og:title", content: "Abdullah's Portfolio" },
      { property: "og:description", content: "Portfolio Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@AbdullahAzmi" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: tabIcon, type: "image/png" },
      { rel: "apple-touch-icon", href: tabIcon },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const THEME_SCRIPT = "try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}";

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Apply the saved theme before first paint; dark unless the visitor chose light. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
