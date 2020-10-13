import React from 'react'
import TimelineItem from "./timelineItem";
import TimelineHeader from "./timelineHeader";

const Timeline = () => {
    return (
      <div className="timeline is-centered">
        <header className="timeline-header">
          <span className="tag is-medium is-primary">2010</span>
        </header>
        <TimelineItem
          title=""
          content="Kilkenny, Ireland"
          icon="fa-home"
        />
        <TimelineItem
          title="January 2010"
          content="Started working as a PHP freelancer."
          icon="fa-briefcase"
        />
        <TimelineHeader content="2014" />
        <TimelineItem
          title="May 2014"
          content="Moved to Vancouver, Canada"
          icon="fa-plane"
        />
        <TimelineItem
          title="June 2014"
          content="Started working at Motbot"
          icon="fa-briefcase"
        />
        <TimelineHeader content="2015" />
        <TimelineItem
          title="January 2015"
          content="Started working at UBC"
          icon="fa-briefcase"
        />
        <TimelineHeader content="2016" />
        <TimelineItem
          title="May 2016"
          content="Moved to London, UK"
          icon="fa-plane"
        />
        <TimelineItem
          title="June 2016"
          content="Started working at Kobas"
          icon="fa-briefcase"
        />
      </div>
    )
}

export default Timeline
