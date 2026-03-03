# CONTRIBUTE

## Installere pnpm

Dette prosjektet bruker **pnpm** som package manager. Node.js kommer med Corepack som automatisk bruker riktig pnpm-versjon:

```bash
corepack enable
```

Corepack leser `packageManager`-feltet i `package.json` og installerer riktig versjon automatisk.

**Merk:** Når Corepack er aktivert, vil `npm`-kommandoer ikke fungere.

## Local development

```
  pnpm install
  pnpm run build:csr // Pga noen avhengigheter frem og tilbake må denne for øyeblikket kjøres først
  pnpm run build
  pnpm start
```

## Publish

### Publish beta version

- Make sure your branch is up to date with main and also run `git fetch` to get all remote tags.
- `pnpm run publish:beta`

### Publish new version

- Make sure your branch is up to date with main and also run `git fetch` to get all remote tags.

- `pnpm run build`
- `npm version patch|minor|major`
- `npm publish --access public`
