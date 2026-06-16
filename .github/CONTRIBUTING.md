# Contributing to Neuron

Thanks for helping improve Neuron.

## Before opening a pull request

1. Create a focused branch from `main`.
2. Run `npm ci` and `npm run build`.
3. Test desktop interactions on the operating system affected by your change.
4. Keep renderer code inside the context-isolated bridge; never enable `nodeIntegration`.
5. Include screenshots for visible interface changes and explain any new plugin permissions.

Use conventional, imperative commit subjects such as `feat: add note history` or `fix: preserve escaped table pipes`.

## Plugin changes

Plugins should request the narrowest host capability they need. Side panels are intended for inspectors and assistants; bottom panels are intended for terminals, logs, and diagnostics. Network behavior must be explicit in the plugin description.

## Reporting bugs

Include the Neuron version, operating system, reproduction steps, expected behavior, and relevant console output. Remove note contents, paths, API keys, and other personal information before posting logs.
