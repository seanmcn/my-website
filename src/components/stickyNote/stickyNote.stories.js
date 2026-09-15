import React from 'react';
import {StickyNote, StickyRef, StickyStack} from './stickyNote';

export default {
  title: 'Post components/StickyNote',
};

const COLORS = ['amber', 'blue', 'plum', 'rose', 'sky', 'moss', 'green'];

export const AllColors = {
  render: () => (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: 24}}>
      {COLORS.map(color => (
        <StickyNote color={color} key={color} label={color}>
          <p>The {color} paper variant.</p>
        </StickyNote>
      ))}
    </div>
  ),
};

export const Standalone = {
  render: () => (
    <StickyNote color="sky" label="Tip">
      <p>
        I know Raycast and Alfred are popular, but I don&apos;t use either.
        Once Spotlight is stripped back to applications, it already does
        exactly what I want.
      </p>
    </StickyNote>
  ),
};

export const StackOfTwo = {
  render: () => (
    <StickyStack>
      <StickyNote color="sky" label="Tip" marker="1">
        <p>Cmd+Shift+Delete empties the Bin, with a warning first.</p>
      </StickyNote>
      <StickyNote color="amber" label="Gripe" marker="2">
        <p>My least favourite shortcut on the entire system.</p>
      </StickyNote>
    </StickyStack>
  ),
};

export const StackOfThree = {
  render: () => (
    <StickyStack>
      <StickyNote color="sky" label="Tip" marker="1">
        <p>First note in the stack.</p>
      </StickyNote>
      <StickyNote color="amber" label="Gripe" marker="2">
        <p>Second note, a fair bit longer than the others, to show how the
          stack reserves height for whichever note is tallest rather than
          jumping around as you click through them.</p>
      </StickyNote>
      <StickyNote color="moss" label="Aside" marker="3">
        <p>Third and last note in the stack.</p>
      </StickyNote>
    </StickyStack>
  ),
};

export const RefLinkedIntoAStack = {
  render: () => (
    <>
      <p>
        Cmd+Shift+Delete empties the Bin.{' '}
        <StickyRef color="sky" n="1" />
      </p>
      <p>
        That one&apos;s nowhere in any menu.{' '}
        <StickyRef color="amber" n="2" />
      </p>
      <StickyStack>
        <StickyNote color="sky" label="Tip" marker="1">
          <p>Cmd+Shift+Delete empties the Bin, with a warning first.</p>
        </StickyNote>
        <StickyNote color="amber" label="Gripe" marker="2">
          <p>My least favourite shortcut on the entire system.</p>
        </StickyNote>
      </StickyStack>
    </>
  ),
};
