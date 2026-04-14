# Nav Dekoratøren Moduler

Helper library for integrating NAV decorator (header/footer) into apps. Published to GitHub Packages.

> 📚 Full docs: [nav-dekoratoren README](https://github.com/navikt/nav-dekoratoren)

## Working in this codebase

- Follow existing patterns and code style
- Verify fixes work (build passes, tests pass) before claiming success
- Type safety: avoid `any`, use proper types and type guards

## Build, Test, Lint

```bash
# Build - CRITICAL: CSR must be built first due to cross-dependencies
npm run build:csr  # Build CSR bundle first
npm run build      # Build both bundles in parallel
npm start          # Watch mode

# Test
npm test                             # All tests
npx vitest run path/to/file.test.ts  # Single test

# Lint
npm run lint         # Lint all (moduler + examples)
npm run lint:moduler # Lint only moduler + typecheck
```

## Architecture

Dual build system: **SSR** (recommended) + **CSR** (fallback)

- **SSR** (`src/ssr/` → `ssr/index.js`) - CommonJS, import from `@navikt/nav-dekoratoren-moduler/ssr`
  - Server-side: `fetchDecoratorHtml`, `fetchDecoratorReact`, `injectDecoratorServerSide`, `buildCspHeader`
  - Fetches from decorator service with 1-hour cache + version watching
  - Falls back to CSR placeholders on fetch failure (3 retries)

- **CSR** (`src/csr/` → `csr/index.js`) - UMD, import from `@navikt/nav-dekoratoren-moduler`
  - Client-side: `injectDecoratorClientSide`, `setParams`, `onLanguageSelect`, `onBreadcrumbClick`
  - Analytics: `getAnalyticsInstance`, `logAnalyticsEvent`
  - Consent helpers: `awaitDecoratorData`, `setNavCookie`, `navSessionStorage`, `navLocalStorage`
  - ⚠️ CSR causes layout shifts - use SSR when possible

- **Common** (`src/common/`) - Shared types, URL construction, CSR fallback elements

## Key Patterns & Gotchas

**Build order**: Always `npm run build:csr` before `npm run build` (cross-dependencies exist)

**Rollup rootDirs**: Each bundle can import from its own dir + common
- CSR: `rootDirs: ["src/csr", "src/common"]`
- SSR: `rootDirs: ["src/ssr", "src/common"]`

**Environment types**: `"prod"|"dev"|"beta"|"betaTms"|"localhost"`
- localhost requires `{ env: "localhost", localUrl: "..." }`
- Service discovery auto-detects NAIS GCP clusters via `process.env.NAIS_CLUSTER_NAME`
- Uses internal URLs (`http://nav-dekoratoren.personbruker`) in NAIS, external URLs otherwise

**SSR fallback**: Fetch fails after 3 retries → falls back to CSR placeholder HTML
```ts
return res?.elements || this.csrFallback(props);
```

**Test patterns**: Colocated `.test.ts` files, always clear state in hooks
```ts
beforeEach(() => {
  clearDecoratorElementsState();
  clearDecoratorWatcherState();
  fetchMock.resetMocks();
});
```

**Consent (ekomloven since Jan 2025)**: Never use raw `document.cookie`/`localStorage` directly
- Use `awaitDecoratorData()` before cookie operations at startup
- Use `setNavCookie()`/`getNavCookie()` instead of raw cookies
- Use `navSessionStorage`/`navLocalStorage` instead of raw storage
- All check allowlist + user consent automatically

## Examples

- `examples/csr/`: Vite + React CSR → `npm run dev`
- `examples/next-app-router/`: Next.js SSR (port 4400) → `npm run dev`

Both use `file:../../` dependency to consume local build.
