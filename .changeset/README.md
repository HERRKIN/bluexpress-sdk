# Changesets

This folder manages versioning and changelogs for `@herrkin/bluexpress-sdk`.

Create a changeset before merging feature/fix PRs:

```bash
npm run changeset
```

Apply version bumps locally (usually done by release workflow):

```bash
npm run version-packages
```

Publish (usually done by GitHub Actions):

```bash
npm run release
```
