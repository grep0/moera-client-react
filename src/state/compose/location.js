import { goToCompose } from "state/navigation/actions";
import { getComposePostingId } from "state/compose/selectors";
import { atOwner } from "util/misc";

export function transform(srcInfo, dstInfo) {
    return [goToCompose(dstInfo.parameters["id"])];
}

export function build(state, info) {
    info = info.sub("compose");
    const id = getComposePostingId(state);
    if (id == null) {
        return info.withTitle("New Post" + atOwner(state));
    } else {
        return info.withParameter("id", id).withTitle("Edit Post" + atOwner(state));
    }
}