const rootReducer = (state, action) => {
    if (state === undefined) {
        const location = window.location.protocol + "//" + window.location.host;
        const page = location + "/moera";
        const api = page + "/api";
        return {location, page, api};
    } else {
        return state;
    }
}

export default rootReducer;
