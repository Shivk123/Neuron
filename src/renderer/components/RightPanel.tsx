import { useState } from 'react';
import { Blocks, PanelBottomClose, PanelRightClose } from 'lucide-react';
import { usePlugins } from '../plugins/host';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

export default function RightPanel({
  location = 'side',
  onOpenMarketplace,
  onClose,
}: {
  location?: 'side' | 'bottom';
  onOpenMarketplace: () => void;
  onClose: () => void;
}) {
  const { panels, runtimeFor } = usePlugins();
  const [activeId, setActiveId] = useState<string | null>(null);
  const dockPanels = panels.filter(({ view }) => (view.location ?? 'side') === location);

  const panelKey = (pluginId: string, panelId: string) => `${pluginId}:${panelId}`;
  const current = dockPanels.find((p) => panelKey(p.pluginId, p.view.id) === activeId) ?? dockPanels[0] ?? null;
  const CloseIcon = location === 'bottom' ? PanelBottomClose : PanelRightClose;

  return (
    <aside
      aria-label={`${location === 'bottom' ? 'Bottom' : 'Side'} plugin peek`}
      className={cn('nav-surface flex h-full w-full flex-col', location === 'bottom' ? 'border-t' : 'border-l')}
    >
      <header className="pane-header flex items-center justify-between gap-1 border-b px-2">
        <div className="flex min-w-0 items-center gap-0.5 overflow-x-auto">
          {dockPanels.length === 0 && <span className="px-2 text-xs text-[var(--ink-muted)]">{location === 'bottom' ? 'Bottom peek' : 'Side peek'}</span>}
          {dockPanels.map(({ pluginId, view }) => {
            const Icon = view.icon;
            const key = panelKey(pluginId, view.id);
            const isActive = current ? panelKey(current.pluginId, current.view.id) === key : false;
            return (
              <button
                key={key}
                onClick={() => setActiveId(key)}
                aria-pressed={isActive}
                className={cn(
                  'interactive flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium',
                  isActive ? 'bg-[var(--surface-hover)] text-[var(--ink)]' : 'text-[var(--ink-muted)] hover:text-[var(--ink)]',
                )}
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {view.title}
              </button>
            );
          })}
        </div>
        <button aria-label="Hide panel" className="interactive grid h-7 w-7 shrink-0 place-items-center rounded-md text-[var(--ink-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--ink)]" onClick={onClose}>
          <CloseIcon className="h-4 w-4" />
        </button>
      </header>

      <div className="min-h-0 flex-1">
        {current ? (
          <div key={current.view.id} className="h-full">
            {current.view.render(runtimeFor(current.pluginId))}
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--divider)] bg-[var(--surface)] text-[var(--ink-muted)]">
              <Blocks className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-sm font-semibold text-[var(--ink)]">No panels enabled</h3>
            <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--ink-secondary)]">
              {location === 'bottom'
                ? 'Enable a plugin with a bottom view, such as a terminal or diagnostics tool.'
                : 'Enable an AI assistant or integration to add a side view here.'}
            </p>
            <Button size="sm" variant="secondary" className="mt-4" onClick={onOpenMarketplace}>Browse plugins</Button>
          </div>
        )}
      </div>
    </aside>
  );
}
