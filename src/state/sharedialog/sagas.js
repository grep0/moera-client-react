import { call, put } from 'redux-saga/effects';

import {
    closeShareDialog,
    openShareDialog,
    SHARE_DIALOG_COPY_LINK,
    SHARE_DIALOG_PREPARE
} from "state/sharedialog/actions";
import { executor } from "state/executor";
import { getNodeUri } from "state/naming/sagas";
import { messageBox } from "state/messagebox/actions";
import { normalizeUrl } from "util/url";
import clipboardCopy from "clipboard-copy";
import { Browser } from "ui/browser";
import { flashBox } from "state/flashbox/actions";

export default [
    executor(SHARE_DIALOG_PREPARE, "", shareDialogPrepareSaga),
    executor(SHARE_DIALOG_COPY_LINK, payload => payload.url, shareDialogCopyLinkSaga),
];

function* shareDialogPrepareSaga(action) {
    const {title, nodeName, href} = action.payload;

    const nodeUri = yield call(getNodeUri, nodeName);
    if (nodeUri == null) {
        yield put(messageBox(`Cannot resolve name: ${nodeName}`));
        return;
    }
    const url = normalizeUrl(nodeUri) + href;
    if (navigator.share) {
        navigator.share({title, url});
    } else {
        yield put(openShareDialog(title, url));
    }
}

function* shareDialogCopyLinkSaga(action) {
    yield put(closeShareDialog());
    yield call(clipboardCopy, action.payload.url);
    if (Browser.userAgentOs !== "android") {
        yield put(flashBox("Link copied to the clipboard"));
    }

}
