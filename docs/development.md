# Development guide

## Requirements

- Node.js 20+
- npm 10+
- Git
- Windows, macOS, or Linux with a desktop session

Run `npm ci` after cloning. This uses the committed lockfile and should be preferred over `npm install` in CI and routine setup.

## Development loop

```bash
npm run dev
```

The command starts three coordinated processes:

1. Vite serves and hot-reloads the React renderer on port 5173.
2. TypeScript watches the Electron main process and preload bridge.
3. `tools/dev/start-electron.js` waits for both outputs and starts Electron without relying on a fixed delay or `npx` shell resolution.

Stop the parent command to stop all three processes.

## Quality checks

```bash
npm run build
npm audit
```

Before a release, also run `npm run dist:dir` and open the unpacked application. Verify repository creation, note editing, settings persistence, plugin enablement, the terminal, external links, and the bundled demo repository.

## Useful paths

- Main process: `src/main/main.ts`
- Preload bridge: `src/main/preload.ts`
- App shell: `src/renderer/App.tsx`
- Global tokens and editor styles: `src/renderer/index.css`
- Plugin contracts: `src/renderer/plugins/types.ts`
- Built-in plugins: `src/renderer/plugins/builtin/`
- Demo content: `examples/demo-repo/`
- Packaging configuration: `package.json#build`

## Adding dependencies

Runtime packages belong in `dependencies`; build and test tools belong in `devDependencies`. Commit both `package.json` and `package-lock.json`. Run the production build and audit after upgrades, especially Electron upgrades.

## Environment and secrets

Do not commit `.env` files, API keys, signing certificates, personal note repositories, or generated release output. Release signing values belong in GitHub Actions secrets. Agent-specific files are intentionally ignored.

## Debugging

The renderer can use Chromium DevTools during development. Main-process errors appear in the terminal that launched `npm run dev`. IPC changes usually require coordinated edits to `src/main/main.ts`, `src/main/preload.ts`, and `src/renderer/electron.d.ts`.
