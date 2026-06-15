# Troubleshooting

## Electron opens before Vite is ready

Use `npm run dev`, not the individual Electron command. The launcher waits for port 5173 and `dist/main/main.js`. If it times out, inspect the renderer and main-process output earlier in the terminal.

## Port 5173 is already in use

Stop the older Vite process, then rerun `npm run dev`. The Vite configuration uses a strict port so Electron never connects to an unrelated server.

## Installed app cannot find the demo repository or icon

Run a fresh `npm run dist:dir`. Packaged resources are copied through Electron Builder and resolved from `process.resourcesPath`; stale unpacked builds may predate that configuration.

## Windows or macOS blocks a downloaded build

Current public artifacts are unsigned. Do not disable system security globally. Verify that the artifact came from the expected GitHub Release and use the operating system's per-application review flow. Maintainers should configure signing before promoting releases broadly.

## Packaging cannot download Electron

Electron Builder downloads platform runtime files on first use. Check network, proxy, firewall, and GitHub access. CI runners normally perform this download automatically.

## `npm audit` reports Electron advisories

Update Electron to a patched supported release, rebuild, and test the desktop application. Do not use `npm audit fix --force` blindly because Electron major upgrades can change runtime behavior.

## GitHub Pages returns 404

Choose **GitHub Actions** as the Pages source and run the `Deploy download page` workflow. Pages hosts the website only; installers appear after a version tag successfully completes the release workflow.
