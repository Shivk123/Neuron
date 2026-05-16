import { FolderGit2 } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface StatusBarProps {
  repositoryName: string | null;
  activeNote: string | null;
  saveState: SaveState;
}

const saveText: Record<SaveState, string> = {
  idle: 'Ready',
  saving: 'Saving…',
  saved: 'Saved locally',
  error: 'Save failed',
};

export default function StatusBar({ repositoryName, activeNote, saveState }: StatusBarProps) {
  return (
    <footer className="status-bar flex select-none items-center justify-between px-3 font-sans text-[11px] text-[var(--ink-muted)]">
      <div className="flex min-w-0 items-center gap-3">
        {repositoryName && (
          <span className="flex min-w-0 items-center gap-1.5">
            <FolderGit2 className="h-3 w-3 shrink-0 text-[var(--accent-strong)]" />
            <span className="truncate">{repositoryName}</span>
          </span>
        )}
        {activeNote && (
          <span className={`flex items-center gap-1.5 ${saveState === 'error' ? 'text-[var(--danger)]' : ''}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${saveState === 'error' ? 'bg-[var(--danger)]' : saveState === 'saving' ? 'bg-[var(--warning)]' : 'bg-[var(--positive)]'}`} />
            {saveText[saveState]}
          </span>
        )}
      </div>
      <div className="flex items-center gap-3">
        <span>UTF-8</span>
        <span>Markdown</span>
      </div>
    </footer>
  );
}
