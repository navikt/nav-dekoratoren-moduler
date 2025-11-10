# CONTRIBUTE

## Local development

```
  npm i
  npm run build:csr // Pga noen avhengigheter frem og tilbake må denne for øyeblikket kjøres først
  npm run build
  npm start
```

## Publish

### Publish beta version

- Make sure your branch is up to date with main and also run `git fetch` to get all remote tags.
- `npm run publish:beta`

### Publish new version

- Make sure your branch is up to date with main and also run `git fetch` to get all remote tags.

- `npm run build`
- `npm version patch|minor|major`
- `npm publish --access public`
