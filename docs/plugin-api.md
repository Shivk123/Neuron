# Plugin API

Plugins extend Neuron with commands, panels, and MDX components. Built-in plugins under `src/renderer/plugins/builtin/` are the current executable examples.

## Module shape

```tsx
import type { PluginModule } from '../types';

const example: PluginModule = {
  manifest: {
    id: 'example.inspector',
    name: 'Example inspector',
    version: '1.0.0',
    description: 'Shows context for the active note.',
    category: 'view',
  },
  activate(host) {
    host.registerPanel({
      id: 'inspector',
      title: 'Inspector',
      location: 'side',
      render(runtime) {
        return <div>{runtime.activeNote ?? 'No note selected'}</div>;
      },
    });
  },
};

export default example;
```

## Manifest

Every plugin declares a stable ID, display name, semantic version, description, and category. Optional configuration schemas let the plugin manager render text, password, or URL settings without custom settings UI.

## Panels

`registerPanel` adds a persistent view. Use `location: 'side'` for assistants, inspectors, and calendars. Use `location: 'bottom'` for terminals, logs, diagnostics, and other wide tools. Side is the compatibility default when location is omitted.

## Commands

`registerCommand` adds an action to the command palette. Commands receive the current runtime at invocation time, so they should not capture stale note state during activation.

## Runtime capabilities

The runtime provides the active note path and content, repository note paths, note opening/creation, refresh, validated plugin configuration, namespaced storage, and approved AI/network clients. Keep permissions narrow and make network behavior explicit in the plugin description.

## MDX components

`registerMdxComponent` associates a component name with a React component. Components must render safely from note-controlled props and should use Neuron tokens instead of fixed theme colors.

## Lifecycle

Activation may return a cleanup function. Use it to remove timers, subscriptions, or external resources. The host reactivates enabled plugins when the enabled set changes and keeps panel components mounted during note editing.

## External plugins

Folder-loaded third-party plugins are not enabled yet. Until a loader, permission review, and trust model are implemented, plugins must be included in the built-in catalog and reviewed as application code.
