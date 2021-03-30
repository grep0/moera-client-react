import { call, put, select } from 'redux-saga/effects';

import { Node } from "api";
import {
    REACTION_VERIFY,
    REACTIONS_DIALOG_PAST_REACTIONS_LOAD,
    REACTIONS_DIALOG_TOTALS_LOAD,
    reactionsDialogPastReactionsLoaded,
    reactionsDialogPastReactionsLoadFailed,
    reactionsDialogTotalsLoaded,
    reactionsDialogTotalsLoadFailed,
    reactionVerifyFailed
} from "state/reactionsdialog/actions";
import { errorThrown } from "state/error/actions";
import { getOwnerName } from "state/owner/selectors";
import { getPosting } from "state/postings/selectors";
import { executor } from "state/executor";

export default [
    executor(REACTIONS_DIALOG_PAST_REACTIONS_LOAD, "", reactionsDialogPastReactionsLoadSaga),
    executor(REACTIONS_DIALOG_TOTALS_LOAD, "", reactionsDialogTotalsLoadSaga),
    executor(
        REACTION_VERIFY,
        payload => `${payload.postingId}:${payload.commentId}:${payload.ownerName}`,
        reactionVerifySaga
    )
];

function* reactionsDialogPastReactionsLoadSaga() {
    const {nodeName, posting, commentId, negative, before, emoji} = yield select(state => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getPosting(state, state.reactionsDialog.postingId),
        commentId: state.reactionsDialog.commentId,
        negative: state.reactionsDialog.negative,
        before: state.reactionsDialog.reactions.after,
        emoji: state.reactionsDialog.activeTab
    }));
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const data = commentId == null
            ? yield call(Node.getPostingReactions, nodeName, postingId, negative, emoji, before, 40)
            : yield call(Node.getCommentReactions, nodeName, postingId, commentId, negative, emoji, before, 40);
        yield put(reactionsDialogPastReactionsLoaded(
            data.reactions, posting.id, commentId, negative, emoji, data.before, data.after, data.total));
    } catch (e) {
        yield put(reactionsDialogPastReactionsLoadFailed(posting.id, null, negative, emoji));
        yield put(errorThrown(e));
    }
}

function* reactionsDialogTotalsLoadSaga() {
    const {nodeName, posting, commentId} = yield select(state => ({
        nodeName: state.reactionsDialog.nodeName,
        posting: getPosting(state, state.reactionsDialog.postingId),
        commentId: state.reactionsDialog.commentId
    }));
    const postingId = posting.receiverPostingId ?? posting.id;
    try {
        const data = commentId == null
            ? yield call(Node.getPostingReactionTotals, "", posting.id)
            : yield call(Node.getCommentReactionTotals, nodeName, postingId, commentId)
        yield put(reactionsDialogTotalsLoaded(data.positive, data.negative));
    } catch (e) {
        yield put(reactionsDialogTotalsLoadFailed());
        yield put(errorThrown(e));
    }
}

function* reactionVerifySaga(action) {
    const {postingId, commentId, ownerName} = action.payload;
    const nodeName = action.context.ownerName;
    try {
        if (commentId == null) {
            yield call(Node.remotePostingReactionVerify, ":", nodeName, postingId, ownerName);
        } else {
            yield call(Node.remoteCommentReactionVerify, ":", nodeName, postingId, commentId, ownerName);
        }
    } catch (e) {
        yield put(reactionVerifyFailed(postingId, commentId, ownerName));
        yield put(errorThrown(e));
    }
}
