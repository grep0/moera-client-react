import { getPosting, isPostingBeingDeleted } from "state/postings/selectors";
import { getOwnerName } from "state/owner/selectors";

export function getDetailedPostingId(state) {
    return state.detailedPosting.id;
}

export function isDetailedPostingId(state, id) {
    return state.detailedPosting.id === id;
}

export function getDetailedPosting(state) {
    return getPosting(state, getDetailedPostingId(state));
}

export function isDetailedPostingBeingDeleted(state) {
    return isPostingBeingDeleted(state, getDetailedPostingId(state));
}

export function isDetailedPostingToBeLoaded(state) {
    return !state.detailedPosting.loading && getDetailedPosting(state) == null;
}

export function isDetailedPostingPositioned(state) {
    return state.detailedPosting.positioned;
}

export function getCommentsState(state) {
    return state.detailedPosting.comments;
}

export function getCommentsReceiverPostingId(state) {
    return getCommentsState(state).receiverPostingId;
}

export function isCommentsReceiverToBeSwitched(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null) {
        return false;
    }
    const receiverName = posting.receiverName ?? ownerName;
    const receiverPostingId = posting.receiverPostingId ?? posting.id;
    const comments = getCommentsState(state);

    return comments.receiverName !== receiverName || comments.receiverPostingId !== receiverPostingId;
}

export function isFocusedCommentToBeLoaded(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    if (ownerName == null || posting == null || isCommentsReceiverToBeSwitched(state)) {
        return false;
    }
    const comments = getCommentsState(state);
    return comments.focusedCommentId != null && !comments.loadedFocusedComment && !comments.loadingFocusedComment;
}

export function isCommentsReadyToBeLoaded(state) {
    const ownerName = getOwnerName(state);
    const posting = getDetailedPosting(state);
    return ownerName != null && posting != null && !isCommentsReceiverToBeSwitched(state)
        && !isFocusedCommentToBeLoaded(state) && !isCommentComposerFocused(state);
}

export function isFutureCommentsToBeLoaded(state) {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingFuture && comments.before === comments.focusedMoment
        && comments.before < Number.MAX_SAFE_INTEGER;
}

export function isPastCommentsToBeLoaded(state) {
    const comments = getCommentsState(state);
    return isCommentsReadyToBeLoaded(state) && !comments.loadingPast && comments.after === comments.focusedMoment - 1
        && comments.after > Number.MIN_SAFE_INTEGER;
}

export function isCommentMomentInLoadedRange(state, moment) {
    const comments = getCommentsState(state);
    return moment != null && moment <= comments.before && moment > comments.after;
}

export function isCommentsFocused(state) {
    return state.detailedPosting.comments.focused;
}

export function isCommentComposerFocused(state) {
    return state.detailedPosting.compose.focused;
}
