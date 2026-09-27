import Kbd from './Kbd.astro';
import Note from './Note.astro';
import Step from './Step.astro';
import Steps from './Steps.astro';
import StickyNote from './StickyNote.astro';
import StickyRef from './StickyRef.astro';
import StickyStack from './StickyStack.astro';

/*
 * The components MDX posts can use without importing them. Code blocks and
 * links are handled in the Markdown pipeline instead (see astro.config.mjs).
 */
export const MDX_COMPONENTS = {
  Kbd, Note, Step, Steps, StickyNote, StickyRef, StickyStack,
};
