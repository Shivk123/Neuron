import type { PluginModule } from '../types';
import aiClaude from './ai-claude';
import aiLocal from './ai-local';
import dailyCalendar from './daily-calendar';
import terminal from './terminal';
import aiOpenai from './ai-openai';
import aiGemini from './ai-gemini';
import aiOpenrouter from './ai-openrouter';

/** Built-in plugin catalog surfaced in the marketplace. */
export const builtinPlugins: PluginModule[] = [
  aiClaude,
  aiLocal,
  dailyCalendar,
  terminal,
  aiOpenai,
  aiGemini,
  aiOpenrouter,
];

