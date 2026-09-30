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

Publish versions through GitHub Actions, not with local `npm publish` or `pnpm run publish:beta`. The workflows bump the version, run lint, tests and build, publish to GitHub Packages, and push the version commit and tag.

### Publish beta version

1. Open [Publish beta](https://github.com/navikt/nav-dekoratoren-moduler/actions/workflows/publish-beta.yaml) and select **Run workflow**.
2. Choose the branch to publish from and select `prerelease`, `preminor` or `premajor` as the version bump.
3. Run the workflow. It publishes the package with the `beta` dist-tag.

### Publish new version

1. Merge the changes into `main`.
2. Open [Publish release](https://github.com/navikt/nav-dekoratoren-moduler/actions/workflows/publish-release.yaml) and select **Run workflow** on `main`. Releases cannot be published from other branches.
3. Select `patch`, `minor` or `major`, and enter the required release description.
4. Run the workflow. It publishes the package and creates a GitHub release using the description.
