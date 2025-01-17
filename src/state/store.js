import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import { CARTES_SET } from "state/cartes/actions";
import { SETTINGS_CLIENT_VALUES_LOADED } from "state/settings/actions";

import { applyMiddleware, combineReducers, createStore } from 'redux';
import getContext from "state/context";
import pulse from "state/pulse/reducer";
import error from "state/error/reducer";
import naming from "state/naming/reducer";
import node from "state/node/reducer";
import home from "state/home/reducer";
import tokens from "state/tokens/reducer";
import navigation from "state/navigation/reducer";
import connectDialog from "state/connectdialog/reducer";
import owner from "state/owner/reducer";
import nodeName from "state/nodename/reducer";
import profile from "state/profile/reducer";
import detailedPosting from "state/detailedposting/reducer";
import compose from "state/compose/reducer";
import postings from "state/postings/reducer";
import feeds from "state/feeds/reducer";
import settings from "state/settings/reducer";
import cartes from "state/cartes/reducer";
import reactionsDialog from "state/reactionsdialog/reducer";
import postingReply from "state/postingreply/reducer";
import changeDateDialog from "state/changedatedialog/reducer";
import people from "state/people/reducer";
import nodeCards from "state/nodecards/reducer";
import contacts from "state/contacts/reducer";
import shareDialog from "state/sharedialog/reducer";
import sourceDialog from "state/sourcedialog/reducer";
import messageBox from "state/messagebox/reducer";
import confirmBox from "state/confirmbox/reducer";
import flashBox from "state/flashbox/reducer";
import signUpDialog from "state/signupdialog/reducer";
import quickTips from "state/quicktips/reducer";
import refresh from "state/refresh/reducer";
import webPush from "state/webpush/reducer";

import createSagaMiddleware from 'redux-saga';
import { spawn, takeEvery } from 'redux-saga/effects';
import { flushPostponedIntroducedSaga } from "api/node/introduce";
import { flushPostponedNamingSaga } from "api/node/ask-naming";
import { pulseSaga, signalPostInitSaga } from "state/pulse/sagas";
import navigationExecutors from "state/navigation/sagas";
import errorExecutors from "state/error/sagas";
import ownerExecutors from "state/owner/sagas";
import connectExecutors from "state/home/connect";
import connectDialogExecutors from "state/connectdialog/sagas";
import homeExecutors from "state/home/sagas";
import cartesExecutors from "state/cartes/sagas";
import nodeNameExecutors from "state/nodename/sagas";
import profileExecutors from "state/profile/sagas";
import feedExecutors from "state/feeds/sagas";
import detailedPostingExecutors from "state/detailedposting/sagas";
import composeExecutors from "state/compose/sagas";
import postingsExecutors from "state/postings/sagas";
import settingsExecutors from "state/settings/sagas";
import namingExecutors from "state/naming/sagas";
import reactionsDialogExecutors from "state/reactionsdialog/sagas";
import postingReplyExecutors from "state/postingreply/sagas";
import storiesExecutors from "state/stories/sagas";
import changeDateDialogExecutors from "state/changedatedialog/sagas";
import peopleExecutors from "state/people/sagas";
import nodeCardsExecutors from "state/nodecards/sagas";
import contactsExecutors from "state/contacts/sagas";
import shareDialogExecutors from "state/sharedialog/sagas";
import sourceDialogExecutors from "state/sourcedialog/sagas";
import flashBoxExecutors from "state/flashbox/sagas";
import signUpDialogExecutors from "state/signupdialog/sagas";
import refreshExecutors from "state/refresh/sagas";
import webPushExecutors from "state/webpush/sagas";

import { collectTriggers, invokeTriggers } from "state/trigger";
import homeTriggers from "state/home/triggers";
import cartesTriggers from "state/cartes/triggers";
import navigationTriggers from "state/navigation/triggers";
import ownerTriggers from "state/owner/triggers";
import nodeNameTriggers from "state/nodename/triggers";
import profileTriggers from "state/profile/triggers";
import feedTriggers from "state/feeds/triggers";
import detailedPostingTriggers from "state/detailedposting/triggers";
import composeTriggers from "state/compose/triggers";
import postingsTriggers from "state/postings/triggers";
import settingsTriggers from "state/settings/triggers";
import namingTriggers from "state/naming/triggers";
import reactionsDialogTriggers from "state/reactionsdialog/triggers";
import peopleTriggers from "state/people/triggers";
import nodeCardsTriggers from "state/nodecards/triggers";
import contactsTriggers from "state/contacts/triggers";
import signUpDialogTriggers from "state/signupdialog/triggers";
import quickTipsTriggers from "state/quicktips/triggers";
import refreshTriggers from "state/refresh/triggers";
import webPushTriggers from "state/webpush/triggers";

import { collectExecutors, invokeExecutors } from "state/executor";

const reducers = combineReducers({
    pulse,
    error,
    naming,
    node,
    home,
    tokens,
    navigation,
    connectDialog,
    owner,
    nodeName,
    profile,
    detailedPosting,
    compose,
    postings,
    feeds,
    settings,
    cartes,
    reactionsDialog,
    postingReply,
    changeDateDialog,
    people,
    nodeCards,
    contacts,
    shareDialog,
    sourceDialog,
    messageBox,
    confirmBox,
    flashBox,
    signUpDialog,
    quickTips,
    refresh,
    webPush
});

function combinedReducer(state, action) {
    action.context = getContext(state);
    return reducers(state, action);
}

const triggers = collectTriggers(
    homeTriggers,
    cartesTriggers,
    navigationTriggers,
    ownerTriggers,
    nodeNameTriggers,
    profileTriggers,
    feedTriggers,
    detailedPostingTriggers,
    composeTriggers,
    postingsTriggers,
    settingsTriggers,
    namingTriggers,
    reactionsDialogTriggers,
    peopleTriggers,
    nodeCardsTriggers,
    contactsTriggers,
    signUpDialogTriggers,
    quickTipsTriggers,
    refreshTriggers,
    webPushTriggers
);

const executors = collectExecutors(
    navigationExecutors,
    errorExecutors,
    ownerExecutors,
    connectExecutors,
    connectDialogExecutors,
    homeExecutors,
    nodeNameExecutors,
    cartesExecutors,
    profileExecutors,
    feedExecutors,
    detailedPostingExecutors,
    composeExecutors,
    postingsExecutors,
    settingsExecutors,
    namingExecutors,
    reactionsDialogExecutors,
    postingReplyExecutors,
    storiesExecutors,
    changeDateDialogExecutors,
    peopleExecutors,
    nodeCardsExecutors,
    contactsExecutors,
    shareDialogExecutors,
    sourceDialogExecutors,
    flashBoxExecutors,
    signUpDialogExecutors,
    refreshExecutors,
    webPushExecutors
);

function* flushPostponedSaga() {
    yield flushPostponedIntroducedSaga();
    yield flushPostponedNamingSaga();
}

function* combinedSaga() {
    yield spawn(signalPostInitSaga);
    yield spawn(pulseSaga);

    yield takeEvery(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, CARTES_SET, SETTINGS_CLIENT_VALUES_LOADED],
        flushPostponedSaga
    );
    yield takeEvery(SETTINGS_CLIENT_VALUES_LOADED, flushPostponedNamingSaga);

    yield* invokeTriggers(triggers);
    yield* invokeExecutors(executors);
}

const sagaMiddleware = createSagaMiddleware();
export default createStore(combinedReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(combinedSaga);
