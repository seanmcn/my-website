import React from 'react';
import {Kbd} from '../kbd/kbd';
import {Step, Steps} from './steps';

export default {
  title: 'Post components/Steps',
  component: Steps,
};

export const Basic = {
  render: () => (
    <Steps>
      <Step>Open: System Settings</Step>
      <Step>Type: &quot;Spotlight&quot; into settings search box</Step>
      <Step>Review: Results from Apps &amp; Results from System</Step>
    </Steps>
  ),
};

export const WithEmbeddedKbd = {
  render: () => (
    <Steps>
      <Step>Open: System Settings</Step>
      <Step>Click: Keyboard</Step>
      <Step>Click: Keyboard Shortcuts... &gt; Modifier Keys</Step>
      <Step>
        Set: <Kbd>control</Kbd> to <Kbd>cmd</Kbd>, and <Kbd>cmd</Kbd> to{' '}
        <Kbd>control</Kbd>
      </Step>
    </Steps>
  ),
};
