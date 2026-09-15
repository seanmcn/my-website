import React from 'react';
import {Note} from './note';

export default {
  title: 'Post components/Note',
  component: Note,
};

export const Default = {
  render: () => (
    <Note>
      <p>
        Sometimes these settings don&apos;t initially stick, and
        you&apos;ll still see files in your search results. You need to
        rebuild the Spotlight index.
      </p>
    </Note>
  ),
};

export const WithMultipleParagraphs = {
  render: () => (
    <Note>
      <p>A correction or caveat, framed apart from the main argument.</p>
      <p>Can hold more than one paragraph, same as the pull-quote can.</p>
    </Note>
  ),
};
