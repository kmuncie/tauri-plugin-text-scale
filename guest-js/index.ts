import { invoke } from '@tauri-apps/api/core';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';

export type { UnlistenFn };

/**
 * The name of the event that reports a new text scale. The payload is the new scale as a
 * number.
 *
 * Apps that keep their own manifest of backend events can use this constant instead of
 * typing the name again.
 */
export const TEXT_SCALE_CHANGED_EVENT = 'tauri-plugin-text-scale:changed';

/**
 * Returns the current operating system text scale.
 *
 * The scale is `1` at the platform's default text size. A larger text size gives a scale
 * above `1`, and a smaller text size gives a scale below `1`. Platforms without a text
 * size to read always return `1`.
 *
 * @returns A promise that resolves with the current text scale.
 * @throws Rejects with a string error when the platform fails to report its text size.
 */
export async function getTextScale(): Promise<number> {
   return invoke<number>('plugin:text-scale|get_text_scale');
}

/**
 * Calls `callback` with the new scale each time the operating system text size changes.
 *
 * Platforms without a text size to read never call `callback`.
 *
 * @param callback - receives the new text scale
 * @returns A promise that resolves with a function that stops the listener.
 */
export async function onTextScaleChanged(callback: (scale: number) => void): Promise<UnlistenFn> {
   return listen<number>(TEXT_SCALE_CHANGED_EVENT, (event) => {
      callback(event.payload);
   });
}
