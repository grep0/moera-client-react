import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    FEED_FUTURE_SLICE_LOAD,
    FEED_GENERAL_LOAD,
    FEED_PAST_SLICE_LOAD,
    FEED_STATUS_LOAD,
    FEED_STATUS_UPDATE,
    FEED_SUBSCRIBE,
    FEED_UNSUBSCRIBE,
    feedFutureSliceLoadFailed,
    feedFutureSliceSet,
    feedGeneralLoadFailed,
    feedGeneralSet,
    feedPastSliceLoadFailed,
    feedPastSliceSet,
    FEEDS_UPDATE,
    feedSliceUpdate,
    feedStatusLoadFailed,
    feedStatusSet,
    feedStatusUpdated,
    feedStatusUpdateFailed,
    feedSubscribed,
    feedSubscribeFailed,
    feedUnsubscribed,
    feedUnsubscribeFailed
} from "state/feeds/actions";
import { errorThrown } from "state/error/actions";
import { getAllFeeds, getFeedState } from "state/feeds/selectors";
import { fillActivityReactions } from "state/activityreactions/sagas";
import { fillSubscriptions } from "state/subscriptions/sagas";
import { introduce } from "api/node/introduce";
import { executor } from "state/executor";

export default [
    executor(FEED_GENERAL_LOAD, payload => payload.feedName, introduce(feedGeneralLoadSaga)),
    executor(FEED_SUBSCRIBE, payload => `${payload.nodeName}:${payload.feedName}`, introduce(feedSubscribeSaga)),
    executor(FEED_UNSUBSCRIBE, payload => `${payload.nodeName}:${payload.feedName}`, introduce(feedUnsubscribeSaga)),
    executor(FEED_STATUS_LOAD, payload => payload.feedName, introduce(feedStatusLoadSaga)),
    executor(FEED_STATUS_UPDATE, payload => payload.feedName, feedStatusUpdateSaga),
    executor(FEED_PAST_SLICE_LOAD, payload => payload.feedName, introduce(feedPastSliceLoadSaga)),
    executor(FEED_FUTURE_SLICE_LOAD, payload => payload.feedName, introduce(feedFutureSliceLoadSaga)),
    executor(FEEDS_UPDATE, "", introduce(feedsUpdateSaga))
];

function* feedGeneralLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const data = yield call(Node.getFeedGeneral, "", feedName);
        yield put(feedGeneralSet(feedName, data));
    } catch (e) {
        yield put(feedGeneralLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* feedSubscribeSaga(action) {
    const {nodeName, feedName} = action.payload;
    const {homeOwnerFullName} = action.context;
    try {
        const whoAmI = yield call(Node.getWhoAmI, nodeName);
        const subscriber = yield call(Node.postFeedSubscriber, nodeName, feedName, homeOwnerFullName);
        yield call(Node.postFeedSubscription, ":", subscriber.id, nodeName, whoAmI.fullName, feedName);
        yield put(feedSubscribed(nodeName, whoAmI.fullName, feedName, subscriber));
    } catch (e) {
        yield put(feedSubscribeFailed(nodeName, feedName));
        yield put(errorThrown(e));
    }
}

function* feedUnsubscribeSaga(action) {
    const {nodeName, feedName, subscriberId} = action.payload;
    try {
        yield call(Node.deleteSubscriber, nodeName, subscriberId);
        yield call(Node.deleteSubscription, ":", subscriberId, nodeName);
        yield put(feedUnsubscribed(nodeName, feedName));
    } catch (e) {
        yield put(feedUnsubscribeFailed(nodeName, feedName));
        yield put(errorThrown(e));
    }
}

function* feedStatusLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const data = yield call(Node.getFeedStatus, ":", feedName.substring(1)); // feedName must start with ":"
        yield put(feedStatusSet(feedName, data));
    } catch (e) {
        yield put(feedStatusLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* feedStatusUpdateSaga(action) {
    const {feedName, viewed, read, before} = action.payload;
    try {
        yield put(feedStatusUpdated(feedName, viewed, read, before));
        // feedName must start with ":"
        const data = yield call(Node.putFeedStatus, ":", feedName.substring(1), viewed, read, before);
        yield put(feedStatusSet(feedName, data));
    } catch (e) {
        yield put(feedStatusUpdateFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* feedPastSliceLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const before = (yield select(state => getFeedState(state, feedName))).after;
        const data = feedName.startsWith(":")
            ? yield call(Node.getFeedSlice, ":", feedName.substring(1), null, before, 20)
            : yield call(Node.getFeedSlice, "", feedName, null, before, 20);
        yield call(fillActivityReactions, data.stories);
        yield call(fillSubscriptions, data.stories);
        yield put(feedPastSliceSet(feedName, data.stories, data.before, data.after));
    } catch (e) {
        yield put(feedPastSliceLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* feedFutureSliceLoadSaga(action) {
    const {feedName} = action.payload;
    try {
        const after = (yield select(state => getFeedState(state, feedName))).before;
        const data = feedName.startsWith(":")
            ? yield call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
            : yield call(Node.getFeedSlice, "", feedName, after, null, 20);
        yield call(fillActivityReactions, data.stories);
        yield call(fillSubscriptions, data.stories);
        yield put(feedFutureSliceSet(feedName, data.stories, data.before, data.after));
    } catch (e) {
        yield put(feedFutureSliceLoadFailed(feedName));
        yield put(errorThrown(e));
    }
}

function* feedsUpdateSaga() {
    const feedNames = yield select(getAllFeeds);
    for (const feedName of feedNames) {
        if (feedName.startsWith(":")) {
            try {
                const data = yield call(Node.getFeedStatus, ":", feedName.substring(1));
                yield put(feedStatusSet(feedName, data));
            } catch (e) {
                yield put(errorThrown(e));
            }
        }
        try {
            let {before, after} = yield select(state => getFeedState(state, feedName));
            while (before > after) {
                const data = feedName.startsWith(":")
                    ? yield call(Node.getFeedSlice, ":", feedName.substring(1), after, null, 20)
                    : yield call(Node.getFeedSlice, "", feedName, after, null, 20);
                yield call(fillActivityReactions, data.stories);
                yield call(fillSubscriptions, data.stories);
                yield put(feedSliceUpdate(feedName, data.stories, data.before, data.after));
                if (after === data.before) {
                    break;
                }
                after = data.before;
            }
        } catch (e) {
            yield put(errorThrown(e));
        }
    }
}
