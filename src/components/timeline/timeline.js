import React from 'react'
import TimelineItem from "./timelineItem";
import TimelineHeader from "./timelineHeader";
import data from './data.json';

const Timeline = () => {

    return (
      <div className="timeline is-centered">
        {data.map((itemYears) => (
          <>
            <TimelineHeader content={itemYears.year} />
            {itemYears.items.map((item) => (
              <TimelineItem title={item.title} content={item.content} icon={item.icon} key={item.title} />
                  ))}
          </>
          ))}
      </div>
    )
}

export default Timeline
