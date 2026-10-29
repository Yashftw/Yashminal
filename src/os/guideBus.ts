/* Tiny event bus so apps can talk to the tutorial guide without prop-drilling
   through the window manager. */

export const guideBus = {
  /** A new window for `appId` was created. */
  opened(appId: string) {
    window.dispatchEvent(new CustomEvent("guide:open", { detail: { appId } }));
  },
  /** The user hovered something inside `appId`'s window worth explaining. */
  hint(appId: string, key: string, text: string) {
    window.dispatchEvent(new CustomEvent("guide:hint", { detail: { appId, key, text } }));
  },
};
