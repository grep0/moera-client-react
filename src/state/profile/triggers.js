import { conj, inv, trigger } from "state/trigger";
import { CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME } from "state/home/actions";
import {
    PROFILE_EDIT,
    PROFILE_EDIT_CANCEL,
    PROFILE_UPDATE_SUCCEEDED,
    profileEditConflict,
    profileLoad,
    profileUnset
} from "state/profile/actions";
import { isProfileEditing, isProfileToBeLoaded } from "state/profile/selectors";
import {
    bottomMenuHide,
    bottomMenuShow,
    GO_TO_PAGE,
    INIT_FROM_LOCATION,
    newLocation,
    WAKE_UP
} from "state/navigation/actions";
import { isAtProfilePage } from "state/navigation/selectors";
import { EVENT_NODE_PROFILE_UPDATED } from "api/events/actions";

export default [
    trigger(GO_TO_PAGE, conj(isAtProfilePage, inv(isProfileEditing), isProfileToBeLoaded), profileLoad),
    trigger(GO_TO_PAGE, conj(isAtProfilePage, isProfileEditing), () => profileLoad(true)),
    trigger(INIT_FROM_LOCATION, inv(isAtProfilePage), profileUnset),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP],
        conj(isAtProfilePage, inv(isProfileEditing)),
        profileLoad
    ),
    trigger(
        [CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP, PROFILE_EDIT],
        conj(isAtProfilePage, isProfileEditing),
        () => profileLoad(true)
    ),
    trigger([CONNECTED_TO_HOME, DISCONNECTED_FROM_HOME, WAKE_UP], inv(isAtProfilePage), profileUnset),
    trigger([PROFILE_EDIT, PROFILE_EDIT_CANCEL, PROFILE_UPDATE_SUCCEEDED], isAtProfilePage, newLocation),
    trigger(PROFILE_EDIT, isAtProfilePage, bottomMenuHide),
    trigger([PROFILE_EDIT_CANCEL, PROFILE_UPDATE_SUCCEEDED], isAtProfilePage, bottomMenuShow),
    trigger(EVENT_NODE_PROFILE_UPDATED, isAtProfilePage, profileLoad),
    trigger(EVENT_NODE_PROFILE_UPDATED, conj(isAtProfilePage, isProfileEditing), profileEditConflict),
    trigger(EVENT_NODE_PROFILE_UPDATED, inv(isAtProfilePage), profileUnset)
];
