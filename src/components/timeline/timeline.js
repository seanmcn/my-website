import React, {Fragment} from 'react';
import TimelineItem from './timelineItem';
import TimelineHeader from './timelineHeader';
import data from './data.json';

const Timeline = () => (
  <div className="timeline is-centered">
    {data.map(itemYears => (
      <Fragment key={itemYears.year}>
        <TimelineHeader content={itemYears.year} />
        {itemYears.items.map(item => (
          <TimelineItem
            title={item.title}
            content={item.content}
            icon={item.icon}
            key={item.title}
          />
        ))}
      </Fragment>
    ))}
  </div>
);

export default Timeline;
