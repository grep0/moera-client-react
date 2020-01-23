import React from 'react';

import TimelineNewButton from "ui/timeline/TimelineNewButton";
import TimelineCalendarButton from "ui/timeline/TimelineCalendarButton";
import TimelineRewindButtons from "ui/timeline/TimelineRewindButtons";
import "./TimelinePageHeader.css";

const TimelinePageHeader = ({empty}) => (
    <div id="timeline-header">
        <h2>Timeline</h2>
        <TimelineNewButton />
        {!empty && <TimelineCalendarButton />}
        {!empty && <TimelineRewindButtons />}
    </div>
);

export default TimelinePageHeader;