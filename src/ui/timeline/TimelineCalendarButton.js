import React from 'react';
import { connect } from 'react-redux';
import { DateTimePicker } from 'react-widgets';
import moment from 'moment';

import { Button } from "ui/control";
import { getTimelineAtTimestamp } from "state/timeline/selectors";
import { goToTimeline } from "state/navigation/actions";

class TimelineCalendarButton extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {active: false};
        this.activate = this.activate.bind(this);
        this.goToTimestamp = this.goToTimestamp.bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.timestamp !== prevProps.timestamp) {
            this.setState({active: false});
        }
    }

    activate() {
        this.setState({active: true});
    }

    goToTimestamp(value) {
        this.props.goToTimeline(moment(value).endOf('day').unix() * 100);
    }

    render() {
        const {timestamp} = this.props;
        const {active} = this.state;

        return (
            <div className="timeline-btn">
                {!active &&
                    <Button variant="outline-info" size="sm" onClick={this.activate}>Calendar</Button>
                }
                {active &&
                    <DateTimePicker format="dd-MM-yyyy" value={moment.unix(timestamp).toDate()} time={false}
                                    onChange={this.goToTimestamp}/>
                }
            </div>
        );
    }

}

export default connect(
    state => ({
        timestamp: getTimelineAtTimestamp(state)
    }),
    { goToTimeline }
)(TimelineCalendarButton);