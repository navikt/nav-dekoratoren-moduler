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

* Add a beta-flag to version in package.json 
```
  "version": "1.2.4-beta.0",
```
* Run `npm run publish-beta`

### Publish new version

* Run `npm version patch|minor|major`
* Run `npm run publish`
