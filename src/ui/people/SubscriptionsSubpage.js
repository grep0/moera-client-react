import React from 'react';
import { connect } from 'react-redux';

import { Loading } from "ui/control";
import NodeName from "ui/nodename/NodeName";

const SubscriptionsSubpage = ({loading, subscriptions}) => (
    <div className="row">
        <Loading active={loading}/>
        {subscriptions.map(sr =>
            <div key={sr.id} className="subscription col-md-3 col-sm-4">
                <NodeName name={sr.remoteNodeName} fullName={sr.remoteFullName}/>
            </div>
        )}
    </div>
);

export default connect(
    state => ({
        loading: state.people.loadingSubscriptions,
        subscriptions: state.people.subscriptions
    })
)(SubscriptionsSubpage);
