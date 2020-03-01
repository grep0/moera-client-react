import {
    BROWSER_API_SET,
    CONNECT_TO_HOME,
    CONNECTED_TO_HOME,
    CONNECTION_TO_HOME_FAILED,
    DISCONNECT_FROM_HOME,
    HOME_OWNER_SET,
    HOME_OWNER_VERIFIED
} from "state/home/actions";
import { toWsUrl } from "util/misc";

const initialState = {
    connecting: false,
    root: {
        location: null,
        page: null,
        api: null,
        events: null
    },
    login: null,
    owner: {
        name: null,
        latest: false,
        verified: false,
        correct: false,
        deadline: null
    },
    addonApiVersion: 1
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CONNECT_TO_HOME:
            return {
                ...state,
                connecting: true
            };

        case CONNECTION_TO_HOME_FAILED:
            return {
                ...state,
                connecting: false
            };

        case CONNECTED_TO_HOME:
            return {
                ...state,
                connecting: false,
                root: {
                    location: action.payload.location,
                    page: action.payload.location + "/moera",
                    api: action.payload.location + "/moera/api",
                    events: toWsUrl(action.payload.location + "/moera/api/events"),
                },
                login: action.payload.login
            };

        case DISCONNECT_FROM_HOME:
            return initialState;

        case HOME_OWNER_SET:
            return {
                ...state,
                owner: {
                    ...state.owner,
                    ...action.payload,
                    verified: false
                }
            };

        case HOME_OWNER_VERIFIED:
            if (state.owner.name === action.payload.name) {
                return {
                    ...state,
                    owner: {
                        ...state.owner,
                        ...action.payload,
                        verified: true
                    }
                };
            }
            return state;

        case BROWSER_API_SET:
            return {
                ...state,
                addonApiVersion: action.payload.version
            };

        default:
            return state;
    }
}
