import { getTextScale, onTextScaleChanged } from '@silvermine/tauri-plugin-text-scale';

import './styles.css';

// Counts the change events, so that a read can tell whether a change arrived while it
// waited for its reply.
let changeCount = 0;

function element<T extends HTMLElement>(id: string): T {
   return document.getElementById(id) as T;
}

function showScale(scale: number): void {
   element<HTMLElement>('scale').textContent = String(scale);
   document.documentElement.style.setProperty('--text-scale', String(scale));
}

function showError(id: string, message: string, error: unknown): void {
   const errorElement = element<HTMLParagraphElement>(id);

   errorElement.textContent = `${message}: ${String(error)}`;
   errorElement.hidden = false;
   console.error(message, error);
}

function logChange(scale: number): void {
   const item = document.createElement('li');

   item.textContent = `${new Date().toLocaleTimeString()}: ${scale}`;
   element<HTMLLIElement>('no-changes').hidden = true;
   element<HTMLOListElement>('changes').prepend(item);
   console.info('The text scale changed', scale);
}

async function readScale(): Promise<void> {
   const changeCountAtStart = changeCount;

   element<HTMLParagraphElement>('read-error').hidden = true;

   try {
      const scale = await getTextScale();

      // A change event that arrived during the read is newer than the reply.
      if (changeCount === changeCountAtStart) {
         showScale(scale);
      }
   } catch(error) {
      showError('read-error', 'Failed to read the text scale', error);
   }
}

async function start(): Promise<void> {
   element<HTMLButtonElement>('refresh').addEventListener('click', () => {
      void readScale();
   });

   try {
      await onTextScaleChanged((scale) => {
         changeCount += 1;
         showScale(scale);
         logChange(scale);
      });
   } catch(error) {
      showError('listen-error', 'Failed to listen for text scale changes', error);
   }

   await readScale();
}

void start();
