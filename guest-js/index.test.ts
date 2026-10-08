import { describe, it, expect, afterEach } from 'vitest';
import { emit } from '@tauri-apps/api/event';
import { mockIPC, clearMocks } from '@tauri-apps/api/mocks';
import { getTextScale, onTextScaleChanged, TEXT_SCALE_CHANGED_EVENT } from './index';

afterEach(() => { return clearMocks(); });

describe('getTextScale', () => {
   it('invokes plugin:text-scale|get_text_scale', async () => {
      let lastCmd = '';

      mockIPC((cmd) => {
         lastCmd = cmd;
         return 1;
      });

      await getTextScale();

      expect(lastCmd).toBe('plugin:text-scale|get_text_scale');
   });

   it('returns the scale from the backend', async () => {
      mockIPC(() => { return 1.35; });

      await expect(getTextScale()).resolves.toBe(1.35);
   });

   it('rejects with the backend\'s error', async () => {
      mockIPC(() => { throw new Error('unavailable'); });

      await expect(getTextScale()).rejects.toThrow('unavailable');
   });
});

describe('onTextScaleChanged', () => {
   it('calls the callback with each new scale', async () => {
      const scales: number[] = [];

      mockIPC(() => { return undefined; }, { shouldMockEvents: true });

      await onTextScaleChanged((scale) => { scales.push(scale); });
      await emit(TEXT_SCALE_CHANGED_EVENT, 1.2);
      await emit(TEXT_SCALE_CHANGED_EVENT, 0.9);

      expect(scales).toEqual([ 1.2, 0.9 ]);
   });

   it('stops calling the callback after unlisten', async () => {
      const scales: number[] = [];

      mockIPC(() => { return undefined; }, { shouldMockEvents: true });

      const unlisten = await onTextScaleChanged((scale) => { scales.push(scale); });

      await emit(TEXT_SCALE_CHANGED_EVENT, 1.2);
      unlisten();
      await emit(TEXT_SCALE_CHANGED_EVENT, 0.9);

      expect(scales).toEqual([ 1.2 ]);
   });
});
