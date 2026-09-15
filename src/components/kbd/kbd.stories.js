import React from 'react';
import {Kbd} from './kbd';

export default {
  title: 'Post components/Kbd',
  component: Kbd,
};

export const SingleKey = {
  render: () => <Kbd>cmd</Kbd>,
};

export const TwoKeyCombo = {
  render: () => <Kbd>cmd-tab</Kbd>,
};

export const ThreeKeyCombo = {
  render: () => <Kbd>cmd-shift-4</Kbd>,
};

export const LiteralKeycap = {
  render: () => <Kbd>cmd-Space</Kbd>,
};

export const Alternates = {
  render: () => <Kbd>control-left/right</Kbd>,
};

export const InSentence = {
  render: () => (
    <p>
      Press <Kbd>cmd-Space</Kbd> to open Spotlight, or{' '}
      <Kbd>cmd-shift-4</Kbd> to take a screenshot.
    </p>
  ),
};
