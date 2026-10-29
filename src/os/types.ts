import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

/** What an app (and the terminal) may ask the OS to do. */
export interface OSApi {
  openApp: (appId: string) => void;
  restart: () => void;
  shutdown: () => void;
  toggleTheme: () => void;
  toggleMute: () => void;
  dark: boolean;
  muted: boolean;
}

export interface AppDef {
  id: string;
  title: string;
  icon: LucideIcon;
  /** hsl triplet used for the icon glow */
  accent?: string;
  w: number;
  /** Only used with `fixedH`; other windows size to their content. */
  h?: number;
  fixedH?: boolean;
  /** Opens filling the whole desktop. */
  openMaximized?: boolean;
  /** Shown on the desktop (apps hidden from it still live in the start menu). */
  desktop?: boolean;
  render: (os: OSApi) => ReactNode;
}
